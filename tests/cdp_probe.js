#!/usr/bin/env node
// CDP probe for the smoke suite: load <url> in headless Chrome and poll
// the DOM over the DevTools Protocol until it contains <expect>, then
// print the serialized DOM and exit 0. Exits 1 (loudly) on timeout.
//
// Chrome's `--dump-dom --virtual-time-budget` hangs forever on modern
// Chrome builds (the process never exits and leaves crashpad children
// behind), so instead we start Chrome with `--remote-debugging-port=0`
// and drive it over CDP, which returns as soon as the SPA has rendered.
//
// No npm dependencies: uses the global fetch/WebSocket (node >= 22).
//
// Usage: node cdp_probe.js <chrome-binary> <url> <expect> [timeout-seconds]
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const [chrome, url, expect, timeoutArg] = process.argv.slice(2);
if (!chrome || !url || !expect) {
  console.error('usage: cdp_probe.js <chrome-binary> <url> <expect> [timeout-seconds]');
  process.exit(2);
}
if (typeof WebSocket === 'undefined' || typeof fetch === 'undefined') {
  console.error('cdp_probe: node >= 22 required (global fetch + WebSocket)');
  process.exit(2);
}

const deadline = Date.now() + (Number(timeoutArg) || 30) * 1000;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'blogdown-cdp-'));

// detached => Chrome leads its own process group, so we can kill the
// whole group (including crashpad children) on exit.
const child = spawn(chrome, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  '--disable-background-networking',
  '--disable-component-update',
  `--user-data-dir=${profile}`,
  '--remote-debugging-port=0',
  url,
], { detached: true, stdio: 'ignore' });

function cleanup() {
  try { process.kill(-child.pid, 'SIGKILL'); } catch {}
  try { child.kill('SIGKILL'); } catch {}
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
}
process.on('exit', cleanup);
process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function devtoolsPort() {
  const portFile = path.join(profile, 'DevToolsActivePort');
  while (Date.now() < deadline) {
    try {
      const port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim();
      if (port) return port;
    } catch {}
    await sleep(200);
  }
  throw new Error('DevToolsActivePort never appeared (chrome failed to start?)');
}

async function pageTarget(port) {
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === 'page' && !t.url.startsWith('devtools:'));
      if (page && page.webSocketDebuggerUrl) return page;
    } catch {}
    await sleep(200);
  }
  throw new Error('no debuggable page target found');
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => resolve(ws);
    ws.onerror = (e) => reject(new Error(`websocket error: ${e.message || 'connect failed'}`));
  });
}

(async () => {
  const port = await devtoolsPort();
  const target = await pageTarget(port);
  const ws = await connect(target.webSocketDebuggerUrl);
  const pending = new Map();
  let nextId = 0;
  ws.onmessage = (event) => {
    let msg;
    try { msg = JSON.parse(event.data); } catch { return; }
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(msg.error.message));
      else p.resolve(msg.result);
    }
  };
  const rpc = (method, params) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const res = await rpc('Runtime.evaluate', { expression, returnByValue: true });
    return (res && res.result && res.result.value) || '';
  };

  let dom = '';
  while (Date.now() < deadline) {
    dom = await evaluate('document.documentElement.outerHTML');
    if (dom.includes(expect)) {
      process.stdout.write(dom + '\n');
      process.exit(0);
    }
    await sleep(250);
  }
  process.stdout.write(dom + '\n');
  console.error(`cdp_probe: timed out waiting for ${JSON.stringify(expect)} at ${url}`);
  process.exit(1);
})().catch((err) => {
  console.error(`cdp_probe: ${err.message}`);
  process.exit(1);
});

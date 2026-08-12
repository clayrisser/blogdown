#!/usr/bin/env bats
load helper.sh

@test "app shell is served" {
  run curl -fsS "$BLOGDOWN_URL/"
  [ "$status" -eq 0 ]
  printf '%s' "$output" | grep -q '<app-root>'
  printf '%s' "$output" | grep -q 'webcomponents-lite\.js'
}

@test "spa history fallback serves the shell for deep links" {
  run curl -fsS -H 'Accept: text/html' "$BLOGDOWN_URL/posts/hello-2026"
  [ "$status" -eq 0 ]
  printf '%s' "$output" | grep -q '<app-root>'
}

@test "vendored bower components are served" {
  for f in webcomponentsjs/webcomponents-lite.js polymer/polymer.html \
    marked-element/marked-element.html marked/lib/marked.js page/index.js; do
    run curl -fsS -o /dev/null -w '%{http_code}' "$BLOGDOWN_URL/core/bower_components/$f"
    [ "$status" -eq 0 ]
    [ "$output" = "200" ]
  done
}

@test "babel-transpiled core is served" {
  run curl -fsS "$BLOGDOWN_URL/core/elements.html"
  [ "$status" -eq 0 ]
  printf '%s' "$output" | grep -q 'marked-element/marked-element\.html'
  # crisper splits inline scripts out of dom-modules during the babel task
  run curl -fsS "$BLOGDOWN_URL/core/renderers/renderer-md.js"
  [ "$status" -eq 0 ]
  printf '%s' "$output" | grep -q 'renderer-md'
}

@test "content manifests and the 2026 sample post are served" {
  run curl -fsS "$BLOGDOWN_URL/content/posts.json"
  [ "$status" -eq 0 ]
  printf '%s' "$output" | grep -q '"hello-2026"'
  run curl -fsS "$BLOGDOWN_URL/content/posts/hello-2026.md"
  [ "$status" -eq 0 ]
  printf '%s' "$output" | grep -q '# Hello from 2026'
}

@test "markdown renders to HTML in a real browser" {
  CHROME=$(find_chrome) || skip "no chrome/chromium binary found"
  run chrome_dump_dom "$CHROME" "$BLOGDOWN_URL/#!/posts/hello-2026"
  [ "$status" -eq 0 ]
  printf '%s' "$output" | grep -Eq '<h1[^>]*>Hello from 2026</h1>'
  printf '%s' "$output" | grep -q 'preservation revival'
}

# BlogDown _Beta_

[![](https://img.shields.io/docker/stars/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![](https://img.shields.io/docker/pulls/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![](https://img.shields.io/docker/build/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/thingdown/blogdown?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

A back-end agnostic, zero compilation, markdown blogging platform

![](assets/blogdown.png)

Please &#9733; this repo if you found it useful &#9733; &#9733; &#9733;

### [Download](https://github.com/thingdown/blogdown/releases/download/v0.2.0/blogdown.zip)
### [Demo](https://blogdown.info)


## 2026 preservation notes

This repo was revived in August 2026 as a **working historical artifact**.
The Polymer 1.x / bower / gulp 3 architecture is intact — nothing was
modernized — but the toolchain was made reproducible again. A Polymer 1.x
app still runs fine in current browsers because `webcomponents-lite`
polyfills everything (HTML imports, custom elements v0) that browsers have
since removed.

### How to run it now

Requirements: docker (with compose) and GNU make. Run `make prepare` once
to install the remaining dev tools (bats, shfmt) via asdf.

```sh
make serve     # dev server (gulp serve inside a node 8 container)
               #   -> http://localhost:8801  (try /#!/posts/hello-2026)
make build     # legacy production build (vulcanize + minify) -> dist/
make test      # legacy mocha unit tests (inside the container)
make test/e2e  # bats smoke test: serves the app, curls rendered output,
               #   and (if chrome + node >= 22 are installed) drives
               #   headless Chrome over CDP to assert markdown renders
               #   to HTML in a real browser
make stop      # tear the dev server down
make clean     # remove build artifacts
```

Without make: `docker compose -f docker/compose.yaml up` and open
[http://localhost:8801](http://localhost:8801).

### What was changed and why

* **bower deps repaired** (`bower.json`): the `molecules` meta-package
  (PolymerElements/molecules) was deleted from GitHub — replaced with a
  direct dependency on `marked-element` (the only element this app used
  from it). The `webcomponentsjs-safari-patch` fork lost its `0.7.x`
  tags — now pinned to the exact master commit (patched 0.7.24), with a
  `resolutions` entry so non-interactive installs resolve it.
* **`app/core/bower_components` is vendored** (committed, ~56MB, 145
  packages): the bower registry and the 2017-era upstream repos are
  increasingly fragile (one had already vanished), so installing from
  the network is no longer required to run or build the app.
* **`gulp-envify` removed**: its manifest pins a deleted GitHub fork of
  `loose-envify`, which broke every `npm install`. Its single use in the
  gulpfile (substituting `process.env.NODE_ENV` during vulcanize) is now
  done with `gulp-replace`, which was already a dependency.
* **Toolchain containerized** (`docker/Dockerfile`): gulp 3's
  `graceful-fs`/`natives` dependency aborts on node >= 10, and node 8 has
  no builds for modern hosts (e.g. darwin-arm64), so the toolchain runs in
  a `node:8.17.0-stretch` container. The imagemin helpers (`optipng`,
  `jpegtran`) ship x86-only prebuilt binaries; the distro binaries from
  archive.debian.org are symlinked over them — the same fix the original
  2017 `Dockerfile` applied on alpine.
* **Makefile + make.mk wrapper, bats smoke test** (`tests/`), and a
  sample post (`hello-2026`) proving markdown renders end-to-end.

### Known limitations

* The original root `Dockerfile` (alpine 3.5 production image with nginx,
  dnsmasq and the `thingdown/prerender` sidecar) is preserved untouched as
  a historical artifact, but is not expected to build in 2026 (dead apk
  repos, dead `envstamp` release URL). Use `docker/Dockerfile` instead.
* `npm run demo` (gh-pages deploy) and the Disqus module talk to external
  services and are out of preservation scope.
* Some external badge/demo URLs in this README and the demo content are
  dead (docker hub build badges, blogdown.info) — kept for history.


## Features

| Feature          | [BlogDown](https://github.com/thingdown/blogdown) | [Jekyll](https://jekyllrb.com/) | [WordPress](https://wordpress.org/) | [Ghost](https://ghost.org/) |
| ---------------- | :-----------------------------------------------: | :-----------------------------: | :---------------------------------: | :-------------------------: |
| Single Page      | :heavy_check_mark:                                | :x:                             | :x:                                 | :x:                         |
| Page Transitions | :heavy_check_mark:                                | :x:                             | :x:                                 | :x:                         |
| Modular Styles   | :heavy_check_mark:                                | :x:                             | :x:                                 | :x:                         |
| Custom Rendering | :heavy_check_mark:                                | :x:                             | :heavy_check_mark:                  | :x:                         |
| Taxonomies       | :heavy_check_mark:                                | :x:                             | :heavy_check_mark:                  | :x:                         |
| No Compilation   | :heavy_check_mark:                                | :x:                             | :heavy_check_mark:                  | :heavy_check_mark:          |
| Commenting       | :heavy_check_mark:                                | :x:                             | :heavy_check_mark:                  | :heavy_check_mark:          |
| Server Agnostic  | :heavy_check_mark:                                | :heavy_check_mark:              | :x:                                 | :x:                         |
| No Database      | :heavy_check_mark:                                | :heavy_check_mark:              | :x:                                 | :x:                         |
| Modules/Plugins  | :heavy_check_mark:                                | :heavy_check_mark:              | :heavy_check_mark:                  | :x:                         |
| Themes           | :heavy_check_mark:                                | :heavy_check_mark:              | :heavy_check_mark:                  | :heavy_check_mark:          |


## Installing

1. Unzip the contents from [HERE](https://github.com/thingdown/blogdown/releases/download/v0.1.10/blogdown.zip) on your server

2. There is no step two. That's how easy it is to install BlogDown.

### Try locally

```sh
curl -OL https://github.com/thingdown/blogdown/releases/download/v0.2.0/blogdown.zip
unzip blogdown.zip && cd blogdown
python -m SimpleHTTPServer
```

Go to [http://localhost:8000](http://localhost:8000)

### Docker

```sh
docker run --name some-blogdown -v /volumes/blogdown-content:/app/content -p 8801:8801 thingdown/blogdown:latest
```

Go to [http://localhost:8801](http://localhost:8801)

### Build from source

```sh
git clone https://github.com/thingdown/blogdown.git
yarn install # or `npm intall`
bower install
yarn start
```


## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## License

[MIT License](https://github.com/thingdown/blogdown/blob/master/LICENSE)

[Jam Risser]('https://github.com/jamrizzi') &copy; 2017


## Credits

* [Jam Risser](https://github.com/jamrizzi) - Author
* [Polymer](https://www.polymer-project.org/)


## Changelog

[Changelog](https://github.com/thingdown/blogdown/blob/master/CHANGELOG.md)

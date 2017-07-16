# BlogDown _Beta_

[![](https://img.shields.io/docker/stars/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![](https://img.shields.io/docker/pulls/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![](https://img.shields.io/docker/build/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/thingdown/blogdown?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

A back-end agnostic, zero compilation, markdown blogging platform


## Features
* Custom Taxonomies
* Styles
* Themes
* Modules
* 100% Fontend Processing
* Markdown, HTML, and PDF posts

## Installing
Step 1: Unzip the contents from [HERE](https://github.com/thingdown/blogdown/releases/download/v0.1.0/blogdown.zip) on your server

Step 2: There is no step two. That's how easy it is to install BlogDown.

You can easily try the platform locally by spinning up a python server.
```
mkdir blogdown && cd blogdown
curl -OL https://github.com/thingdown/blogdown/releases/download/v0.1.0/blogdown.zip
unzip blogdown.zip && rm blogdown.zip
python -m SimpleHTTPServer
```
Then, just go to [http://localhost:8000](http://localhost:8000) in your browser.

If you want to build the platform yourself, you can run the following.
```
git clone git@github.com:jamrizzi/blogdown.git
npm install && bower install
gulp serve:dist
```

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Built With
* Polymer

## Authors
* Jam Risser

## License
This project is licensed under the GNU Public License Version 3

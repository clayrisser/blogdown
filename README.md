# BlogDown _Beta_

[![](https://img.shields.io/docker/stars/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![](https://img.shields.io/docker/pulls/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![](https://img.shields.io/docker/build/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/thingdown/blogdown?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

A back-end agnostic, zero compilation, markdown blogging platform

![](assets/blogdown.png)

Please &#9733; this repo if you found it useful &#9733; &#9733; &#9733;

### [Download](https://github.com/thingdown/blogdown/releases/download/v0.2.0/blogdown.zip)
### [Demo](https://blogdown.info)


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

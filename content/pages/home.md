# BlogDown _Beta_

[![](https://img.shields.io/docker/stars/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![](https://img.shields.io/docker/pulls/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![](https://img.shields.io/docker/build/thingdown/blogdown.svg?style=flat-square)](https://hub.docker.com/r/thingdown/blogdown/) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/thingdown/blogdown?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

A back-end agnostic, zero compilation, markdown blogging platform

### [Download](https://github.com/thingdown/blogdown/releases/download/v0.1.9/blogdown.zip)


## Features

| Feature          | [BlogDown](http://thingdown.github.io/blogdown/)  | [Jekyll](https://jekyllrb.com/) | [WordPress](https://wordpress.org/) | [Ghost](https://ghost.org/) |
| ---------------- | :-----------------------------------------------: | :----------------------------:  | :--------------------------------:  | :-------------------------: |
| Single Page      | YES                                               | NO                              | NO                                  | NO                          |
| Page Transitions | YES                                               | NO                              | NO                                  | NO                          |
| Modular Styles   | YES                                               | NO                              | NO                                  | NO                          |
| Custom Rendering | YES                                               | NO                              | YES                                 | NO                          |
| Taxonomies       | YES                                               | NO                              | YES                                 | NO                          |
| No Compilation   | YES                                               | NO                              | YES                                 | YES                         |
| Commenting       | YES                                               | NO                              | YES                                 | YES                         |
| Server Agnostic  | YES                                               | YES                             | NO                                  | NO                          |
| No Database      | YES                                               | YES                             | NO                                  | NO                          |
| Modules/Plugins  | YES                                               | YES                             | YES                                 | NO                          |
| Themes           | YES                                               | YES                             | YES                                 | YES                         |


## Installing

1. Unzip the contents from [HERE](https://github.com/thingdown/blogdown/releases/download/v0.1.9/blogdown.zip) on your server

2. There is no step two. That's how easy it is to install BlogDown.


### Try locally

```sh
mkdir blogdown && cd blogdown
curl -OL https://github.com/thingdown/blogdown/releases/download/v0.1.9/blogdown.zip
unzip blogdown.zip && rm blogdown.zip
python -m SimpleHTTPServer
```

Go to [http://localhost:8000](http://localhost:8000)

### Docker

```sh
docker run --name some-blogdown -v /volumes/blogdown-content:/app/content -p 8081:8081 thingdown/blogdown:latest
```

Go to [http://localhost:8081](http://localhost:8081)

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

[MIT License](https://github.com/thingdow/blogdown/blob/master/LICENSE)
[Jam Risser]('https://github.com/jamrizzi') &copy; 2017


## Credits

* [Jam Risser](https://github.com/jamrizzi) - Author
* [Polymer](https://www.polymer-project.org/)


## Changelog

0.1.9 (2017-09-10)
* Improved release flow

0.1.2 (2017-02-21)
* API finalized
* Under the hood improvements
* Bug fixes

0.1.1 (2017-02-21)
* Under the hood improvements
* Bug fixes

0.1.0 (2017-02-21)
* Beta release

0.0.1 (2016-04-10)
* Alpha release

0.0.0 (2016-03-10)
* Project started

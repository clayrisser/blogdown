# &lt;pdf-object&gt;

An embeddable PDF viewer for Polymer.


## Install

Requires [Polymer 1.0](https://www.polymer-project.org/1.0/)

Install the component using [Bower](http://bower.io/):

```sh
$ bower install pdf-object --save
```

Or [download as ZIP](https://github.com/jamrizzi/pdf-object/archive/gh-pages.zip).


## Usage

Example:
```html
<pdf-object file="http://www.polyu.edu.hk/iaee/files/pdf-sample.pdf"></pdf-object>
```

Example - with card enabled and elevation set to 5:
```html
<pdf-object file="[[pdfUrl]]" elevation="5" card></pdf-object>
```

Example - with data binding and custom height:
```html
<pdf-object file="[[pdfUrl]]" height="800px"></pdf-object>
```


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## License

[GNU Public License v3](LICENSE)

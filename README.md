# browserify-css #

A Browserify transform for bundling and minifying CSS files.

## Getting Started

If you're new to browserify, check out the [browserify handbook](https://github.com/substack/browserify-handbook) and the resources on [browserify.org](http://browserify.org/).

## Installation

`npm install --save-dev browserify-css`

## Usage

app.css:
``` css
@import url("modules/foo/index.css");
@import url("modules/bar/index.css");
body {
    background-color: #fff;
}
```

app.js:
``` js
var css = require('./app.css');
console.log(css);
```

You can compile your app by passing -t browserify-css to browserify:
```
$ browserify -t browserify-css app.js > bundle.js
```

Each `require('./path/to/file.css')` call will concatenate CSS files with @import statements, rebasing urls, inlining @import, and minifying CSS. It will add a style tag with an optional data-href attribute to the head section of the document during runtime:

```
<html>
<head>
<style 
<style type="text/css" data-href="app.css">...</style>
</head>
</html>
```

## Configuration

You can put your [browserify-css](https://github.com/cheton/browserify-css) options into your package.json file:
``` json
{
    "browserify-css": {
        "auto-inject": true,
        "minify": true,
        "rootDir": "."
    }
}
```

or use an external configuration file like below:
``` json
{
    "browserify-css": "./config/browserify-css.js"
}
```

config/browserify-css.js:
``` js
module.exports = {
    "auto-inject": true,
    "minify": true,
    "rootDir": "."
};
```

## Options

### auto-inject

Type: `Boolean`
Default: `true`

If true, each `require('path/to/file.css')` call will add a style tag to the head section of the document.

### rootDir

Type: `String`
Default: `./`

An absolute path to resolve relative paths against the project's base directory.

### minfiy

Type: `Boolean`
Default: `false`

### minify-options

Type: `Object`
Default: `{}`

Check out a list of CSS minify options at [CleanCSS](https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-programmatically).

## License

MIT

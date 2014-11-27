'use strict';

var _ = require('lodash');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var cssTransform = require('./css-transform');
var CleanCSS = require('clean-css');

var defaults = {
    'auto-inject': true,
    'rootDir': process.cwd(),
    'minify': false,
    'minify-options': {
        // Check out a list of CSS minify options at [CleanCSS](https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-programmatically).
    }
};

var pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json') || '{}');
var options = pkg['browserify-css'] || {};
if (typeof options === 'string') {
    var base = path.relative(__dirname, process.cwd());
    options = require(path.join(base, options)) || {};
}
options = _.defaults(options || {}, defaults);

module.exports = function(filename) {
    if ( ! /\.css$/i.test(filename)) {
        return through();
    }

    var cssBuffer = {};
    var buffer = '';
    var externalURLs = [];

    return through(
        function transform(chunk, enc, next) {
            buffer += chunk;
            next();
        },
        function flush(done) {
            var that = this;

            cssTransform({ rootDir: options.rootDir }, filename, function(data) {
                var moduleBody = '';
                var rootDir = path.join(process.cwd(), options.rootDir);
                var relativePath = path.relative(rootDir, path.dirname(filename));
                var href = path.join(relativePath, path.basename(filename));

                if (options.minify) {
                    data = new CleanCSS(options['minify-options']).minify(data);
                }

                if ( ! options['auto-inject']) {
                    moduleBody = 'module.exports = ' + JSON.stringify(data) + ';'
                } else if (options['injected-tag'] === 'style') { // <style>
                    moduleBody = 'var css = ' + JSON.stringify(data) + '; (require(' + JSON.stringify(__dirname) + ').createStyle(css, { "href": ' + JSON.stringify(href) + '})); module.exports = css;'

                }

                that.push(moduleBody);
                that.push(null);
                done();
            });
        }
    );
};

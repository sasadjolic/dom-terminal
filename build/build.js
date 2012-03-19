// Dependencies
var exec = require('child_process').exec;
var fs = require('fs-extra');
var less = require('less');
var mime = require('mime');
var seq = require('seq');

// Do the build.
var build = {};
seq()
	.seq(function () {
		// Read in the project version.
		fs.readFile('VERSION', 'ascii', this);
	})
	.seq(function(version) {
		// Save the version number for later.
		build.version = '' + version;

		// Copy raw JS, if required.
		/*
		fs.copyFileSync('lib/terminal.js', 'dist/terminal-' + build.version + '.js');
		*/

		// Minify JS.
		exec('java -jar build/closure/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js lib/terminal.js --js_output_file dist/terminal-' + build.version + '.min.js', this);

		// Alternatively, use jsmin. It doesn't compress as much as the closure compiler.
		/*
		var jsmin = require('jsmin').jsmin;
		var minified = jsmin(css, 3);
		*/
	})
	.par(function () {
		// Read in the less stylesheet.
		fs.readFile('lib/terminal.less', 'ascii', this);
	})
	.par(function () {
		// Read in 'interlace.png'.
		fs.readFile('lib/interlace.png', this);
	})
	.par(function () {
		// Read in 'external.png'.
		fs.readFile('lib/external.png', this);
	})
	.seq(function(styles, interlacepng, externalpng) {
		// Convert to string.
		styles = '' + styles;

		// Embed interlace.png
		var interlace = 'url("data:' + mime.lookup('lib/interlace.png') + ';base64,' + new Buffer(interlacepng).toString('base64') + '")';
		styles = styles.replace('dataurl("interlace.png")', interlace);

		// Embed external.png
		var external = 'url("data:' + mime.lookup('lib/external.png') + ';base64,' + new Buffer(externalpng).toString('base64') + '")';
		styles = styles.replace('dataurl("external.png")', external);

		// Minify the stylesheet.
		less.render(styles, {compress: true}, this);
	})
	.seq(function(css) {
		// Write out the minified CSS.
		fs.writeFile('dist/terminal-' + build.version + '.min.css', css);
	});

[![Build Status](https://secure.travis-ci.org/SDA/terminal.png)](http://travis-ci.org/SDA/terminal)

# Terminal

Simple command-line terminal for your browser app.

Web apps are great. But sometimes instead of all the double-clicks,
mouse pointers, taps and swipes across the screen - you just want
good old keyboard input. This terminal runs in a browser, desktop or mobile. It provides a simple
and easy way to extend the terminal with your own commands.

Enjoy.

## How to use

Include `terminal.js` and `terminal.css` in your HTML:

```html
<script src="terminal.min.js"></script>
<link rel="stylesheet" media="all" href="terminal.min.css">
```

Define an HTML div tag where the terminal will be contained:

```html
<div id="terminal"></div>
```

Create a new terminal instance and convert the DOM element
into a live terminal.

```js
var terminal = new Terminal('terminal', {}, {});
```

This won't be terribly useful because by default the terminal
doesn't define any commands. It's meant to be extended. Let's
define some:

```js
var terminal = new Terminal('terminal', {}, {
	execute: function(cmd, args) {
		switch (cmd) {
			case 'clear':
				terminal.clear();
				return '';

			case 'help':
				return 'Commands: clear, help, theme, ver or version<br>More help available <a class="external" href="http://github.com/SDA/terminal" target="_blank">here</a>';

			case 'theme':
				if (args && args[0]) {
					if (args.length > 1) return 'Too many arguments';
					else if (args[0].match(/^interlaced|modern|white$/)) { terminal.setTheme(args[0]); return ''; }
					else return 'Invalid theme';
				}
				return terminal.getTheme();

			case 'ver':
			case 'version':
				return '1.0.0';

			default:
				// Unknown command.
				return false;
		};
	}
});
```

This gives us 4 commands: `clear`, `help`, `theme`, and `ver` or `version`.
[Go ahead and try it out using our live example.](http://sda.github.com/terminal/example.html)

## Features

### Welcome message

The default welcome message is empty but you can set it to be anything.

```js
var terminal = new Terminal('terminal', {welcome: 'Welcome to awesome terminal!'}, {});
```

### Command-line history

History is automatically kept track of. You can use up and down arrow keys to
go through the command-line history, just like a standard shell.

### Prompt and separator

You can change the prompt. The default is an empty prompt with a `>` separator.
Set the prompt option to change.

```js
var terminal = new Terminal('terminal', {prompt: 'C:\', separator: '&gt;'}, {});
```

This will display the prompt like this: `C:\>`

### Theme

There are 3 built-in themes:

* `interlaced`
* `modern`
* `white`

`interlaced` theme is the default. If you're nostalgic about the old-school CRT
monitors then this theme is for you.

`modern` is a clean modern theme that's white on black, while the `white` theme is
black on white.

Set the theme in options:

```js
var terminal = new Terminal('terminal', {theme: 'interlaced'}, {});
```

Or alternatively use the API to change the theme after creating the terminal object.

### Command extensions

The default terminal doesn't provide any built-in commands. You must define your
own set of commands. This can be done through options when creating the object.

```js
var terminal = new Terminal('terminal', {}, {
	execute: function(cmd, args) {
		switch (cmd) {
			case 'hello':
				return 'world';

			// Place your other commands here.

			default:
				// Unknown command.
				return false;
		};
	}
});
```

When executing commands you can run whatever code you want. Just return a string
that you want to be displayed in the terminal as the output of your command. The
example above would produce:

```
> hello
world
> 
```

Return `false` to indicate that this is an unknown command.

You can have more than one command set and you can list them out one after another:

```js
var terminal = new Terminal('terminal', {}, {
	execute: function(cmd, args) {
		switch (cmd) {
			case 'hello': return 'world';
			default: return false;
		};
	}
},{
	execute: function(cmd, args) {
		switch (cmd) {
			case 'echo': return args[0];
			default: return false;
		};
	}
});
```

You might want to use multiple command sets, for example, if your app has modules
that hook into the terminal independently.

### Local storage persistence

Command-line history is persisted using HTML5 local storage.

## API

### Clear the screen

```js
terminal.clear();
```

### Change the theme

```js
terminal.setTheme('interlaced');
```

Sets CSS class `terminal-interlaced` on the terminal DOM element. The three built-in
themes are `interlaced`, `modern`, and `white`. You can also make your own theme and
pass in your theme's name into `setTheme`.

To retrieve the name of the active theme, use `getTheme`.

```js
console.log(terminal.getTheme());
```

### Set the prompt

```js
terminal.setPrompt('test');
```

Because the default separator is `>` this will display:

```
test>
```

You can set the separator in options while creating the Terminal object. At this
time it's not possible to change the separator after the terminal is created.

Prompt can be changed at any time.

## Thank-yous

I was inspired by the HTML5 Terminal demo for Chrome created by Eric Bidelman.
Thanks! You can find his demo and source code here:
http://www.htmlfivewow.com/demos/terminal/terminal.html
http://code.google.com/p/html5wow/source/browse/#hg%2Fsrc%2Fdemos%2Fterminal

My version of the terminal component is completely rewritten and has no code
in common with the source, but it does borrow ideas from Eric's demo. It also
works for other browsers, whereas Eric's version is optimized for Chrome.

## License

(The MIT License)

Copyright (c) 2012 Sasa Djolic, SDA Software Associates Inc.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.


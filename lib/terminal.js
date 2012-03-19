(function (global, undefined) {

	var Terminal = Terminal || function(containerID, options) {
		if (!containerID) return;

		var defaults = {
			welcome: '',
			prompt: '',
			separator: '&gt;',
			theme: 'interlaced'
		};

		var options = options || defaults;
		options.welcome = options.welcome || defaults.welcome;
		options.prompt = options.prompt || defaults.prompt;
		options.separator = options.separator || defaults.separator;
		options.theme = options.theme || defaults.theme;

		var extensions = Array.prototype.slice.call(arguments, 2);

		var _history = localStorage.history ? JSON.parse(localStorage.history) : [];
		var _histpos = _history.length;
		var _histtemp = '';

		// Create terminal and cache DOM nodes;
		var _terminal = document.getElementById(containerID);
		_terminal.classList.add('terminal');
		_terminal.classList.add('terminal-' + options.theme);
		_terminal.insertAdjacentHTML('beforeEnd', [
			'<div class="background"><div class="interlace"></div></div>',
			'<div class="container">',
			'<output></output>',
			'<table class="input-line">',
			'<tr><td nowrap><div class="prompt">' + options.prompt + options.separator + '</div></td><td width="100%"><input class="cmdline" autofocus /></td></tr>',
			'</table>',
			'</div>'].join(''));
		var _container = _terminal.querySelector('.container');
		var _inputLine = _container.querySelector('.input-line');
		var _cmdLine = _container.querySelector('.input-line .cmdline');
		var _output = _container.querySelector('output');
		var _prompt = _container.querySelector('.prompt');
		var _background = document.querySelector('.background');

		// Hackery to resize the interlace background image as the container grows.
		_output.addEventListener('DOMSubtreeModified', function(e) {
			// Works best with the scroll into view wrapped in a setTimeout.
			setTimeout(function() {
				_cmdLine.scrollIntoView();
			}, 0);
		}, false);

		if (options.welcome) {
			output(options.welcome);
		}

		window.addEventListener('click', function(e) {
			_cmdLine.focus();
		}, false);

		_output.addEventListener('click', function(e) {
			e.stopPropagation();
		}, false);

		// Always force text cursor to end of input line.
		_cmdLine.addEventListener('click', inputTextClick, false);
		_inputLine.addEventListener('click', function(e) {
			_cmdLine.focus();
		}, false);

		// Handle up/down key presses for shell history and enter for new command.
		_cmdLine.addEventListener('keyup', historyHandler, false);
		_cmdLine.addEventListener('keydown', processNewCommand, false);

		window.addEventListener('keyup', function(e) {
			_cmdLine.focus();
			e.stopPropagation();
			e.preventDefault();
		}, false);

		function inputTextClick(e) {
			this.value = this.value;
		}

		function historyHandler(e) {
			// Clear command-line on Escape key.
			if (e.keyCode == 27) {
				this.value = '';
				e.stopPropagation();
				e.preventDefault();
			}

			if (_history.length && (e.keyCode == 38 || e.keyCode == 40)) {
				if (_history[_histpos]) {
					_history[_histpos] = this.value;
				}
				else {
					_histtemp = this.value;
				}

				if (e.keyCode == 38) {
					// Up arrow key.
					_histpos--;
					if (_histpos < 0) {
						_histpos = 0;
					}
				}
				else if (e.keyCode == 40) {
					// Down arrow key.
					_histpos++;
					if (_histpos > _history.length) {
						_histpos = _history.length;
					}
				}

				this.value = _history[_histpos] ? _history[_histpos] : _histtemp;

				// Move cursor to end of input.
				this.value = this.value;
			}
		}

		function processNewCommand(e) {
			// Only handle the Enter key.
			if (e.keyCode != 13) return;

			var cmdline = this.value;

			// Save shell history.
			if (cmdline) {
				_history[_history.length] = cmdline;
				localStorage['history'] = JSON.stringify(_history);
				_histpos = _history.length;
			}

			// Duplicate current input and append to output section.
			var line = this.parentNode.parentNode.parentNode.parentNode.cloneNode(true);
			line.removeAttribute('id')
			line.classList.add('line');
			var input = line.querySelector('input.cmdline');
			input.autofocus = false;
			input.readOnly = true;
			input.insertAdjacentHTML('beforebegin', input.value);
			input.parentNode.removeChild(input);
			_output.appendChild(line);

			// Hide command line until we're done processing input.
			_inputLine.classList.add('hidden');

			// Clear/setup line for next input.
			this.value = '';

			// Parse out command, args, and trim off whitespace.
			if (cmdline && cmdline.trim()) {
				var args = cmdline.split(' ').filter(function(val, i) {
					return val;
				});
				var cmd = args[0];
				args = args.splice(1); // Remove cmd from arg list.
			}

			if (cmd) {
				var response = false;
				for (var index in extensions) {
					var ext = extensions[index];
					if (ext.execute) response = ext.execute(cmd, args);
					if (response !== false) break;
				}
				if (response === false) response = cmd + ': command not found';
				output(response);
			}

			// Show the command line.
			_inputLine.classList.remove('hidden');
		}

		function clear() {
			_output.innerHTML = '';
			_cmdLine.value = '';
			_background.style.minHeight = '';
		}

		function output(html) {
			_output.insertAdjacentHTML('beforeEnd', html);
			_cmdLine.scrollIntoView();
		}

		return {
			clear: clear,
			setPrompt: function(prompt) { _prompt.innerHTML = prompt + options.separator; },
			getPrompt: function() { return _prompt.innerHTML.replace(new RegExp(options.separator + '$'), ''); },
			setTheme: function(theme) { _terminal.classList.remove('terminal-' + options.theme); options.theme = theme; _terminal.classList.add('terminal-' + options.theme); },
			getTheme: function() { return options.theme; }
		}
	};

	// node.js
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Terminal;

	// web browsers
	} else {
		var oldTerminal = global.Terminal;
		Terminal.noConflict = function () {
			global.Terminal = oldTerminal;
			return Terminal;
		};
		global.Terminal = Terminal;
	}

})(this);

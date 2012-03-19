qunit = require('qunit');
qunit.options.log.assertions = false;
qunit.options.log.errors = false;
qunit.options.log.tests = false;
qunit.options.log.summary = false;
qunit.options.log.globalSummary = false;
qunit.run({
	code: {
		path: './lib/terminal.js',
		namespace: 'Terminal'
	},
	tests: [
		'terminal.test.js'
	].map(function (v) { return './test/' + v })
}, function(err, report) {
	var assertions = qunit.log.assertion();
	for (var i in assertions) {
		var assertion = assertions[i];
		if (!assertion.result) {
			console.log(assertion);
		}
	}
	if (report.failed > 0) {
		console.log('\nFAILED: ' + report.failed + '  Passed: ' + report.passed);
	}
	else {
		console.log('\nPassed: ' + report.passed);
	}
});

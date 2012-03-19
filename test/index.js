qunit = require('qunit');
qunit.options.assertions = false;
qunit.options.tests = false;
qunit.options.summary = false;
qunit.options.globalSummary = false;
qunit.run({
	code: {
		path: './lib/Terminal.js',
		namespace: 'Terminal'
	},
	tests: [
		'Terminal.test.js'
	].map(function (v) { return './test/' + v })
}, function(report) {
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

var hujiserver = require('./hujiwebserver');

var server = hujiserver.start(8000, './ex2', function(e) {
	if(e) {
		console.log(e)
	} else {
		console.log('Server is up');
	}
});


var hujiserver = require('./hujiwebserver');

var server = hujiserver.start(80, '/tmp/potato', function(e) {
	e ? console.log(e) : console.log('Server is up');
});

var hujiserver = require('./hujiwebserver');

var server = hujiserver.start(8000, '/tmp/potato', function(e) {
	if(e) {
		console.log(e)
	} else {
		console.log('Server is up');
		setTimeout(function() {
			server.stop(function() {
				console.log('Server stopped');
			});
		}, 5000);
	}
});


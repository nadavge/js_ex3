var net = require('net');
var http = require('http');
var hujiserver = require('./hujiwebserver');

var servPort = 1337;
var rootFolder = './ex2'

var server = hujiserver.start(servPort, rootFolder, function(e) {
	if(e) {
		console.log(e)
	} else {
		console.log('Server is up');
		runTests();
		setTimeout(function() {
			server.stop();
		}, 1500);
	}
});

function runTests() {
	console.log("Initiating test sequence...");
	testOk();
	testNotFound();
	testForbidden();
	testInternalError();
}

function testOk() {
	http.get({
			port: servPort,
			path: '/index.html'
		},
		function (response) {
			console.log('testOk result:');
			console.log((response.statusCode === 200) ? 'Success' : 'Failed');
		}
	);
}

function testNotFound() {
	http.get({
			port: servPort,
			path: '/superkalifragilistic'
		},
		function (response) {
			console.log('testNotFound result:');
			console.log((response.statusCode === 404) ? 'Success' : 'Failed');
		}
	);
}

function testForbidden() {
	http.get({
			port: servPort,
			path: '/'
		},
		function (response) {
			console.log('testForbidden result:');
			console.log((response.statusCode === 403) ? 'Success' : 'Failed');
		}
	);
}

function testInternalError() {
	var conn;
	var response;

	conn = net.createConnection(servPort);
	conn.on('data', function(data) {
		data = data.toString('ascii', 0, data.length);
		console.log('testInternalError result:');
		console.log((data.indexOf('500 Internal') !== -1) ? 'Success' : 'Failed');
	});
	conn.on('error', function(error) {
		console.log('testInternalError error:');
		console.log(error);
	});
	conn.write('HTTP/1.0 / GET');
}

var hujinet = require('./hujinet');
var net = require('net');

module.exports.start = function(port, rootFolder, errorCallback) {
	return new serverObj(port, rootFolder, errorCallback);
}

function serverObj(port, rootFolder, errorCallback) {
	var server;
	var connectionHandler;

	Object.defineProperty(this, 'port', {
		value: port
	});
	Object.defineProperty(this, 'rootFolder', {
		value: rootFolder
	});

	connectionHandler = new hujinet.connectionHandler(this);
	server = net.createServer(connectionHandler.onConnection);
	server.on('error', errorCallback);
	server.listen(port, errorCallback);
}

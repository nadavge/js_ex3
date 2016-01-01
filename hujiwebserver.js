var hujinet = require('./hujinet');

module.exports.start = function(port, rootFolder, callback) {
	return new serverObj(port, rootFolder, callback);
}

function serverObj(port, rootFolder, callback) {
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

	// Create the server
	// Set listen on port, put the callback as the callback
}

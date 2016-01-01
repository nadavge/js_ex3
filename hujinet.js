var net = require('net');

module.exports.connectionHandler = function(server) {

    this.onConnection = function(connection) {
        c.on('data', function(data) {
            console.log(data.toString('ascii', 0, data.length));
        });
    }

    this.handleRequest = function() {
        response = compose(13, Body);
        response.pipe(connection);
    }
}


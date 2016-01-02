var net = require('net');
var requestparser = require('./hujirequestparser');

module.exports.connectionHandler = function(server) {

    this.onConnection = function(conn) {
        conn.on(
            'data',
            function(data) {
                var request;
                // TODO maybe handle the data differently, since this is
                // a stream, we might get it by chunks.. Need to check
                data = data.toString('ascii', 0, data.length)

                try {
                    request = requestparser.parse(data);
                    this.handleRequest(request);
                } catch (e) {
                    // TODO handle exception
                }
            });
    }

    this.handleRequest = function(request) {
        //response.pipe(connection);
    }
}


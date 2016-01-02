var net = require('net');
var requestparser = require('./hujirequestparser');
var path = require('path');
var fs = require('fs');

module.exports.connectionHandler = function(server) {
    var myServer = server;
    var that = this;

    this.onConnection = function(conn) {
        console.log('Connection!'); //TODO remove
        conn.on(
            'data',
            function(data) {
                var request;
                // TODO maybe handle the data differently, since this is
                // a stream, we might get it by chunks.. Need to check
                data = data.toString('ascii', 0, data.length)
                console.log('Incoming request:\n\n' + data);
                try {
                    request = requestparser.parse(data);
                    console.log(request);
                    that.handleRequest(conn, request);
                } catch (e) {
                    console.log(e);
                    // TODO handle exception
                }
            });
    }

    this.handleRequest = function(conn, request) {
        var filepath;

        if (! path.isAbsolute(request.uri)) {
            //TODO handle access denied / 404
            console.log('File is going to be out');
        }

        filepath = path.join(myServer.rootFolder, request.uri);
        fs.stat(filepath, function(err, stats) {
            if (err) {
                // TODO return 404
                console.log('File isnt available');
                return;
            }
            if (! stats.isFile()) {
                console.log('Isn\'t file');
                return;
            }

            console.log(stats.size);
        });
        //response.pipe(connection);

        // Close connection of necessary
    }
}


var net = require('net');
var requestparser = require('./hujirequestparser');
var path = require('path');
var fs = require('fs');

var mimetypes = {
    'js': 'application/javascript',
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'jpg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png'
    };

module.exports.connectionHandler = function(server) {
    var myServer = server;
    var that = this;

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
            var response;
            var filesize;
            var filestream;
            var extension;

            if (err) {
                // TODO return 404
                console.log('File isnt available');
                return;
            }
            if (! stats.isFile()) {
                console.log('Isn\'t file');
                return;
            }

            filesize = stats.size;
            extension = path.extname(filepath);
            filestream = fs.createReadStream(filepath);

            response = requestparser.compose(
                request.version,
                '200 OK',
                mimetypes[extension],
                filesize
            );

            conn.write(response);
            filestream.pipe(conn);
        });
        //response.pipe(connection);

        // Close connection of necessary
    }
}


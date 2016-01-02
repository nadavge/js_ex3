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

var CONNECTION_TIMEOUT = 2000;

module.exports.connectionHandler = function(server) {
    var myServer = server;
    var that = this;

    this.onConnection = function(conn) {
        var timer = setTimeout(function() { conn.end(); }, CONNECTION_TIMEOUT);
        conn.on(
            'data',
            function(data) {
                clearTimeout(timer);
                timer = setTimeout(function() { conn.end(); }, CONNECTION_TIMEOUT);

                var request;
                data = data.toString('ascii', 0, data.length)

                try {
                    request = requestparser.parse(data);
                    that.handleRequest(conn, request);
                } catch (e) {
                    conn.end();
                }
            }
        );

        conn.on(
            'end',
            function() {
                clearTimeout(timer);
            }
        );
    }

    this.handleRequest = function(conn, request) {
        var filepath;

        // Avoid access from outside the rootFolder
        if (! path.isAbsolute(request.uri)) {
            response = requestparser.compose(
                request.version,
                '403 Bad Request',
                mimetypes['html'],
                0);

            conn.write(response);
        }

        filepath = path.join(myServer.rootFolder, request.uri);
        fs.stat(filepath, function(err, stats) {
            var response;
            var filesize;
            var filestream;
            var extension;

            if (err) {
                response = requestparser.compose(
                    request.version,
                    '404 Not Found',
                    mimetypes['html'],
                    0);

                conn.write(response);
                return;
            }
            if (! stats.isFile()) {
                response = requestparser.compose(
                    request.version,
                    '403 Forbidden',
                    mimetypes['html'],
                    0);

                conn.write(response);
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

            if ((request.headers['Connection'] !== 'keep-alive' &&
                request.version === 'HTTP/1.0') ||
                request.headers['Connection'] === 'close')
            {
                conn.end();
            }
        });
    }
}


var net = require('net');
function connectionListener(c) { //'connection' listener
  console.log('server connected');
  c.on('end', function() {
	  console.log('server disconnected');
  });
  c.on('data', function(data) {
	console.log(data.toString('ascii', 0, data.length));
  });
  c.write('hello\r\n');
  setTimeout( function() {
	c.end();
  }, 2000);
}
var server = net.createServer(connectionListener);
server.listen(8124, function() { //'listening' listener
  console.log('server bound');
});


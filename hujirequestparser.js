module.exports.parse = function(request) {

}

// HttpRequest:
//  uri?
//  version?
//  headers (dictionary)
//  body (text? binary data?)

module.exports.compose = function(bodyLength, bodyStream) {
	// Returns a stream
	var responseStream = new Readable();
	responseStream.push(....);
	responseStream.push(bodyStream);
	responseStream.push(null);
	return responseStream;
}

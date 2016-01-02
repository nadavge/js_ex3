function HttpRequest()
{
    this.method = null;
    this.uri = null;
    this.version = null;
    this.headers = null;
    this.body = null;
}

function parseFirstHeader(header) {
    var headerParts = header.split(' ');
    var headerPartsDivided = {};
    headerPartsDivided['method'] = headerParts[0];
    headerPartsDivided['uri'] = headerParts[1];
    headerPartsDivided['version'] = headerParts[2];
    return headerPartsDivided;
}

var REQUEST_FORMAT_INVALID = new Error("The provided HTTP request format was invalid!");

module.exports.parse = function(request) {

    //split by lines, remove first useless line
    var request = new HttpRequest();
    var requestLines = request.split('\r\n');
    requestLines.splice(0,1);

    //parse first request line
    var firstHeaderParts = parseFirstHeader(requestLines[0]);
    request.method = firstHeaderParts['method'];
    request.uri = firstHeaderParts['uri'];
    request.version = firstHeaderParts['version'];
    requestLines.splice(0,1);

    //build the headers dictionary
    var headerLines = [];

    var headerLine = requestLines.shift();
    var headerLineParts = null;
    var headerLineKey = null;
    var headerLineBody = null;

    //that should be the divider btw the headers and the body.
    if(headerLine == "")
    {
        throw REQUEST_FORMAT_INVALID;
    }

    //go through all the header lines, add them to dict.
    do
    {
        headerLineParts = headerLine.split(':');
        headerLineKey = headerLine.shift();
        headerLineBody = headerLine.join(':').trim();
        headerLines[headerLineKey] = headerLineBody;

        headerLine = requestLines.shift();
    }while ((requestLines.length > 0) && (headerLine != ""));

    request.headers = headerLines;

    //all the remaining lines in requestLines are the request body.

    request.body = requestLines.join("\r\n");

    return request;
}

module.exports.compose = function(bodyLength, bodyStream) {
	// Returns a stream
	var responseStream = new Readable();
	responseStream.push(....);
	responseStream.push(bodyStream);
	responseStream.push(null);
	return responseStream;
}

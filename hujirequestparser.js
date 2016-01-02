var HTTP_METHOD = 'method';
var METHOD_INDEX = 0;
var HTTP_URI = 'uri';
var URI_INDEX = 1;
var HTTP_VERSION = 'version';
var VERSION_INDEX = 2;
var SPACE_SEPARATOR = ' ';
var COLON_SEPARATOR = ':';
var LINE_SEPARATOR = '\r\n';

var GET_REQUEST_METHOD = "GET";
var BODY_TYPE_STR = "Content-Type";
var BODY_LENGTH_STR = "Content-Length";

var REQUEST_METHOD_RESTRICTION = new Error("This server only accepts GET requests!");
var REQUEST_FORMAT_INVALID = new Error("The provided HTTP request format was invalid!");

function HttpRequest()
{
    this.method = null;
    this.uri = null;
    this.params = '';
    this.version = null;
    this.headers = [];
    this.body = null;
}

function parseFirstHeader(header) {
    var headerParts = header.split(SPACE_SEPARATOR);
    var headerPartsDivided = {};
    headerPartsDivided[HTTP_METHOD] = headerParts[METHOD_INDEX];
    headerPartsDivided[HTTP_URI] = headerParts[URI_INDEX];
    headerPartsDivided[HTTP_VERSION] = headerParts[VERSION_INDEX];
    return headerPartsDivided;
}

module.exports.parse = function(requestString) {

    //split by lines, remove first useless line
    var request = new HttpRequest();
    var requestLines = requestString.split(LINE_SEPARATOR);
    var header;
	var headerKey;
	var headerBody;

    //parse first request line
    var firstHeaderParts = parseFirstHeader(requestLines[0]);
    request.method = firstHeaderParts[HTTP_METHOD];

    if(isMethodValid(request.method) == false)
    {
        throw REQUEST_METHOD_RESTRICTION;
    }

    request.uri = firstHeaderParts[HTTP_URI].split('?');
    if (request.uri[1] !== undefined) {
        request.params = request.uri[1];
    }
    request.uri = request.uri[0];
    console.log(request.uri);
    console.log(request.params);
    request.version = firstHeaderParts[HTTP_VERSION];
    requestLines.splice(0,1);

    while ((header = requestLines.shift()) !== undefined && header !== '')
    {
		header = header.split(COLON_SEPARATOR);
		// Headers must have a key and a body
		if (header.length < 2) {
            throw REQUEST_FORMAT_INVALID;
		}
        headerKey = header.shift();
        headerBody = header.join(COLON_SEPARATOR).trim();
        request.headers[headerKey] = headerBody;
    }

    //all the remaining lines in requestLines are the request body.
    request.body = requestLines.join(LINE_SEPARATOR);
    return request;
}

function isMethodValid(method)
{
    return (method == GET_REQUEST_METHOD);
}

module.exports.compose = function(version, statusCode, bodyType, bodyLength) {
    var response = '';
    // add the first response header to the stream
    response += version.concat(SPACE_SEPARATOR, statusCode, LINE_SEPARATOR);

    //build both headers that describe the response body
    response += BODY_TYPE_STR.concat(bodyType, LINE_SEPARATOR);
    response += BODY_LENGTH_STR.concat(bodyLength, LINE_SEPARATOR);
    //writing the body content to the stream
    response += LINE_SEPARATOR;

    return response;
}

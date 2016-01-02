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
    this.version = null;
    this.headers = null;
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

    //parse first request line
    var firstHeaderParts = parseFirstHeader(requestLines[0]);
    request.method = firstHeaderParts[HTTP_METHOD];
	console.log(request.method);
    if(isMethodValid(request.method) == false)
    {
        throw REQUEST_METHOD_RESTRICTION;
    }

    request.uri = firstHeaderParts[HTTP_URI];
    request.version = firstHeaderParts[HTTP_VERSION];
    requestLines.splice(0,1);

    //build the headers dictionary
    request.headers = [];

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
        headerLineParts = headerLine.split(COLON_SEPARATOR);
        headerLineKey = headerLine.shift();
        headerLineBody = headerLine.join(COLON_SEPARATOR).trim();
        request.headers[headerLineKey] = headerLineBody;

        headerLine = requestLines.shift();
    }while ((requestLines.length > 0) && (headerLine != ""));

    //all the remaining lines in requestLines are the request body.
    request.body = requestLines.join(LINE_SEPARATOR);
    return request;
}

function isMethodValid(method)
{
    return (method == GET_REQUEST_METHOD);
}

module.exports.compose = function(version, statusCode, bodyType, bodyLength, bodyStream) {
    // create the response stream
    var responseStream = new Readable();
    // add the first response header to the stream
    var responseFirstHeader = version.concat(SPACE_SEPARATOR, statusCode, LINE_SEPARATOR);
    responseStream.push(responseFirstHeader);

    //build both headers that describe the response body
    var bodyTypeHeader = BODY_TYPE_STR.concat(bodyType, LINE_SEPARATOR);
    var bodyLengthHeader = BODY_LENGTH_STR.concat(bodyLength, LINE_SEPARATOR);
    responseStream.push(bodyTypeHeader);
    responseStream.push(bodyLengthHeader);

    //writing the body content to the stream
    responseStream.push(LINE_SEPARATOR);
    responseStream.push(bodyStream);

    //terminate the stream, and return it.
    responseStream.push(null);
    return responseStream;
}

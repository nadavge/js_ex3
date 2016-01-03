var serverObj;
var http = require('http');
var hujiServer = require('./hujiwebserver');
var servPort = 1337;
//var filePath = '/index.html';
var rootFolder = './ex2';
//var fileUri = 'http://localhost:' + servPort + filePath;
var NUM_OF_CONCURRENT = 1000;
var SUCCESS_STATUS_CODE = 200;

//function errorHandler(getError)
//{
//    console.log('Woops! something happend: ' + getError.message);
//}
//
//function getHandler(getResult)
//{
//    if(getResult.statusCode != SUCCESS_STATUS_CODE)
//    {
//        console.log('A request has gone bad! Error Code:' + getResult.statusCode);
//    }
//
//    else
//    {
//        console.log('requested successfully!');
//    }
//
//    getResult.resume();
//}

serverObj = hujiServer.start(servPort, rootFolder, function(e){

    if(e) {
        console.log(e)
    } else {
        console.log('server is up. port ' + servPort);
        runTests();
        setTimeout(function() {
            serverObj.stop();
			// Print statistics or something
        }, 5000);
    }
});


function runTests()
{
    //var tempGetResponse;

    for(var i = 0; i < NUM_OF_CONCURRENT; i++)
    {
		var req = http.get({
				port: servPort,
				path: '/index.html'
			},
			function (response) {
				// Count if success
			}
		).on('error', function(error) {
			// Count if error
			
		});
    }

    console.log("Finished Load Testing!");

}

function testOk() {
    http.get({
            port: servPort,
            path: '/index.html'
        },
        function (response) {
            console.log('testOk result:');
            console.log((response.statusCode === SUCCESS_STATUS_CODE) ? 'Success' : 'Failed');
        }
    );
}

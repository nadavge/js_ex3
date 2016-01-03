var serverObj;
var http = require('http');
var hujiServer = require('./hujiwebserver');
var servPort = 1337;
//var filePath = '/index.html';
var rootFolder = './ex2';
//var fileUri = 'http://localhost:' + servPort + filePath;
var NUM_OF_CONCURRENT = 1000;
var SUCCESS_STATUS_CODE = 200;

var numOfSuccess = 0;
var numOfFails = 0;

serverObj = hujiServer.start(servPort, rootFolder, function(e){

    if(e) {
        console.log(e)
    } else {
        console.log('server is up. port ' + servPort);
        runTests();
        setTimeout(function() {
            serverObj.stop();
			console.log('Successes: ' + numOfSuccess +', Fails: ' + numOfFails);
        }, 5000);
    }
});


function runTests()
{
    for(var i = 0; i < NUM_OF_CONCURRENT; i++)
    {
		var req = http.get({
				port: servPort,
				path: '/index.html'
			},
			function (response) {
				if(response.statusCode == SUCCESS_STATUS_CODE)
                {
                    numOfSuccess++;
                }

                else
                {
                    numOfFails++;
                }
			}
		);
    }

    console.log("Finished Load Testing!");
}

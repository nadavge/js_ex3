var serverObj;
var httpModule = require('http');
var hujiServer = require('./hujiwebserver');
var servPort = 1337;
var filePath = '/index.html';
var rootFolder = './ex2';
var fileUri = 'http://localhost:' + servPort + filePath;
var NUM_OF_CONCURRENT = 1;
var SUCCESS_STATUS_CODE = 200;

function errorHandler(getError)
{
    console.log('Woops! something happend: ' + getError.message);
}

function getHandler(getResult)
{
    if(getResult.statusCode != SUCCESS_STATUS_CODE)
    {
        console.log('A request has gone bad! Error Code:' + getResult.statusCode);
    }

    else
    {
        console.log('requested successfully!');
    }

    getResult.resume();
}

serverObj = hujiServer.start(servPort, rootFolder, function(e){

    if(e) {
        console.log(e)
    } else {
        console.log('server is up. port ' + servPort);
        runTests();
        setTimeout(function() {
            serverObj.stop();
        }, 1500);
    }
});


function runTests()
{
    var tempGetResponse;

    for(var i = 0; i < NUM_OF_CONCURRENT; i++)
    {
        console.log('Starting request num: ' + (i+1));
        tempGetResponse = httpModule.get(fileUri, getHandler).on('error',errorHandler);
    }

    console.log("Finished Load Testing!");

}

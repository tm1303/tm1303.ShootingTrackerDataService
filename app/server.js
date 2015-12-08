var http = require('http');
var requestImport = require('request');
var url = require('url');

var xpath = require('xpath')
var dom = require('xmldom').DOMParser

var Converter = require("csvtojson").Converter;

const PORT=8090; 

var year2013 = "http://shootingtracker.com/tracker/2013MASTER.csv";
var year2014 = "http://shootingtracker.com/tracker/2014MASTER.csv";
var year2015 = "http://shootingtracker.com/tracker/2015CURRENT.csv";


//We need a function which handles requests and send response
function handleRequest(request, response){
		
	if( request.url.indexOf('favicon.ico') > -1)
	{
		console.log('facicon request cancelled');
		response.end();
		return;
	}
		
	var queryData = url.parse(request.url, true).query;	
	var queryYear = queryData.year;
	
	console.log('queryYear:' + queryYear);
	
	var dataUrl="";
	
	if(queryYear==="2015")
		dataUrl = year2015;
	else if(queryYear==="2014")
		dataUrl = year2014;
	else if(queryYear==="2013")
		dataUrl = year2013;
	
	if(dataUrl===""){
		response.end("no year found");
		return;
	}
	
	console.log('request: ' + dataUrl);
	
	requestImport(dataUrl, function (error, innerResponse, body)
	{		
		if (!error && innerResponse.statusCode === 200)
		{
			console.log('download complete');
			
			var converter = new Converter({});
				converter.fromString(body, function(err,result){
					
					console.log(result);
				response.end(JSON.stringify(result) );
			});
		}
	});		
	
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, "127.0.0.1", function(){   
	console.log("Server listening on port: %s", PORT);
	console.log("Server listening ip: %s", server.address().address);
});	



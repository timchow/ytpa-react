var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require("path");
var https = require('https');
var pug = require('pug');

var ACCESS_TOKEN = "";

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function(req, res, next) {
	var html = pug.renderFile(__dirname + '/index.pug'); 
	res.send(html);
});

app.get('/user/*', function (req, res){
	var html = pug.renderFile(__dirname + '/index.pug'); 
	res.send(html);
})

// Creating own Instagram wrapper for user info
// Couldn't bypass the cross domain origin issue - this is the alternative
app.get('/userInfo', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');		
	var response = res;
	var user_name = req.query.user_name;

	var reqUrl = "https://www.instagram.com/"+user_name+"/?__a=1";

	RequestAndRespond(reqUrl, response);
});

app.get('/media', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	var response = res;
	var user_id = req.query.user_id,
		max_id = req.query.max_id

	var reqUrl = "https://api.instagram.com/v1/users/"+user_id+"/media/recent/?access_token="+ACCESS_TOKEN+"&max_id="+max_id;
	
	RequestAndRespond(reqUrl, response);
});

// grabs 150 comments at most
app.get('/comments', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	var response = res;
	var media_id = req.query.media_id;

	var reqUrl = "https://api.instagram.com/v1/media/"+media_id+"/comments?access_token="+ACCESS_TOKEN;
	
	RequestAndRespond(reqUrl, response);
});

app.get('/likes', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	var response = res;
	var media_id = req.query.media_id;

	var reqUrl = "https://api.instagram.com/v1/media/"+media_id+"/likes?access_token="+ACCESS_TOKEN;
	
	RequestAndRespond(reqUrl, response);
});

function RequestAndRespond(url, serverResponse) {
	var body = "";
	https.get(url, function(res) {
		if (res.statusCode == 404) return serverResponse.send(404);
		res.on('data', function (data) {
			body += data;
		});
		res.on('end', function(){
			serverResponse.send(body);
		})
	}).on('error', function(e) {
		serverResponse.send(404);
	});
};

var port = process.env.PORT || 8000;
app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
})

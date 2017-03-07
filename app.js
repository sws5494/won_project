var express = require('express');
var app = express();
app.get('/', function(req, res){
	res.send('hello home page');
});
app.get('/login', function(req, res){
	res.send('login please');
});
app.listen(3000, function(){
	console.log('connected 3000 port!');
});
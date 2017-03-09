var express = require('express');
var app = express();
app.use(express.static('public'));
app.get('/', function(req, res){
	res.send('hello home page');
});
app.get('/topic/:id', function(req, res){
	var topics = [
		'javascript',
		'nodejs',
		'express'
	];
	var output = `
	<a href="/topic?id=0">javascript</a><br>
	<a href="/topic?id=1">nodejs</a><br>
	<a href="/topic?id=2">express</a><br><br>
	${topics[req.params.id]}
	`
	res.send(output);
});
app.get('/topic/:id/:mode', function(req, res){
	res.send(req.params.id+','+req.params.mode);
});
app.get('/dynamic', function(req, res){
	var lis = '';
	for(var i=0;i<5;i++){
		lis = lis + '<li>coding</li>';
	}
	var time = Date();
	var output = `<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
Hello, dynamic!
<ul>
${lis}
</ul>
${time}
</body>
</html>`
	res.send(output);
});
app.get('/login', function(req, res){
	res.send('login please');
});
app.listen(3000, function(){
	console.log('connected 3000 port!');
});

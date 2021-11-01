var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var socket = require("socket.io");
var io = socket(server);

app.use(express.static(path.join(__dirname, 'Public')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'Index.html'));
})

server.listen(8080, function() {});

io.on('connection', function (socket) {
	console.log('a user connected');
    socket.on('disconnect', function () {
		console.log('user disconnected');
    });
});
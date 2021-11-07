var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var socket = require("socket.io");
var passport  = require('passport');
var session   = require('express-session');
var io = socket(server);

app.set('view engine', 'ejs');
app.use(session({secret:'MySecret', resave: false, saveUninitialized:true}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./Public/main'));
app.use('/auth', require('./Public/auth'));




app.use(express.static(path.join(__dirname, 'Public')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'Index.html'));
})

server.listen(3000, function() {});

io.on('connection', function (socket) {
	console.log('a user connected');
    socket.on('disconnect', function () {
		console.log('user disconnected');
    });
});
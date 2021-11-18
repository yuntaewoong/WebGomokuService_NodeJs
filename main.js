var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var socket = require("socket.io");
var passport  = require('passport');
var session   = require('express-session');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var room = require("./Room.js");
const Room = require('./Room.js');
var io = socket(server);

var RoomNum = 0;
var Rooms = [];
app.set('view engine', 'ejs');
app.use(session({secret:'MySecret', resave: false, saveUninitialized:true}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./Public/main'));
app.use('/auth', require('./Public/auth'));


app.use(express.static(path.join(__dirname, 'Public')));
server.listen(3000, function() {});

app.post('/game',urlencodedParser, function(req, res) {//로그인한 유저가 게임입장을 요청
  res.sendFile(path.join(__dirname, 'Index.html'));
});


io.on('connection', function (socket) {//게임입장한 유저들은 IO로 관리됨
	console.log('io connected');
  socket.on('JoinRoom', () => {
    socket.join(RoomNum);
    if(Rooms.length == RoomNum)//아직 RoomNum에 해당하는 Room이 존재하지 않는다면
    {
      Rooms.push(new Room(RoomNum));//방정보 생성
      Rooms.blackID = socket.id;
    }
    else//이미 RoomNum해당하는 Room이 존재한다면
    {
      Rooms.whiteID = socket.id;
      io.sockets.in(RoomNum).emit('GameReady');//게임 준비가 되었음을 전달
      RoomNum++;
    }
    });
  
  
  
  socket.on('disconnect', function () {
		  console.log('user disconnected');
  });
});
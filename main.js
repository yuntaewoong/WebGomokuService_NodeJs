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
      Rooms[RoomNum].blackID = socket.id;
    }
    else//이미 RoomNum해당하는 Room이 존재한다면
    {
      Rooms[RoomNum].whiteID = socket.id;
      io.to(Rooms[RoomNum].whiteID).emit('GameReady', 'white',RoomNum);
      io.to(Rooms[RoomNum].blackID).emit('GameReady', 'black',RoomNum);//플레이어에게 게임이 준비되었고 자신의 돌이 흑,백중 무엇인지 전달
      RoomNum++;
    }
  });
  socket.on("PutBlackStone",function(blackXIndex,blackYIndex,roomNum){//흑색 플레이어가 착수요청
    console.log("PutBlackRequest x : " + blackXIndex + "y : " + blackYIndex + " roomNum : " + roomNum );
    if(Rooms[roomNum].IsBlackWin(blackXIndex,blackYIndex))//오목 완성했을때
    {
      Rooms[roomNum].board[blackYIndex][blackXIndex] = 1;//흑돌 착수
      io.in(roomNum).emit("GameEnd",1);//흑이 이겼다고 해당 방에 전달
    }
    else//완성못했을때
    {
      Rooms[roomNum].board[blackYIndex][blackXIndex] = 1;//흑돌 착수
      Rooms[roomNum].currentTurn = 2;//백색턴으로 전환
      io.in(roomNum).emit("GameUpdate",2,blackXIndex,blackYIndex);//착수한 결과를 해당 방에 전달
    }
  });
  socket.on("PutWhiteStone",function(whiteXIndex,whiteYIndex,roomNum){//백색 플레이어가 착수요청
    console.log("PutWhiteRequest");
    if(Rooms[roomNum].IsWhiteWin(whiteXIndex,whiteYIndex))//오목 완성했을때
    {
      Rooms[roomNum].board[whiteYIndex][whiteXIndex] = 2;//백돌 착수
      io.in(roomNum).emit("GameEnd",2);//백이 이겼다고 해당 방에 전달
    }
    else//오목 완성못했을때
    {
      Rooms[roomNum].board[whiteYIndex][whiteXIndex] = 2;//백돌 착수
      Rooms[roomNum].currentTurn = 1;//흑색턴으로 전환
      io.in(roomNum).emit("GameUpdate",1,whiteXIndex,whiteYIndex);//착수한 결과를 해당 방에 전달
    }
  });
  socket.on('disconnect', function () {
		  console.log('user disconnected');
  });
});
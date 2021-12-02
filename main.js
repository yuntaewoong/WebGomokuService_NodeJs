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
const { json } = require('body-parser');
const { emit } = require('process');
var io = socket(server);
var RoomNum = 0;
var Rooms = [];
var Users = [];
var tempUserId = 0;
var tempUserDisplayName = '';
//DB
const sqlite3 = require("sqlite3").verbose();
const db_name = path.join(__dirname, "DB", "UserInfo.db");
const db = new sqlite3.Database(db_name, err => {
  if(err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'apptest.db'");
});
var sql_create = "CREATE TABLE Users (id text, displayName text, winCount integer, loseCount integer, rating integer);"
db.run(sql_create, err => {
  if( err ) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'Users' table!");
});

app.set('view engine', 'ejs');
app.use(session({secret:'MySecret', resave: false, saveUninitialized:true}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./Public/main'));
app.use('/auth', require('./Public/auth'));


app.use(express.static(path.join(__dirname, 'Public')));
server.listen(3000, function() {});

app.post('/game',urlencodedParser, function(req, res) {//로그인한 유저가 게임입장을 요청
  tempUserId = parseInt(req.body.id);
  tempUserDisplayName = req.body.displayName;
  // for(let i  =0;i<Users.length;i++)
  //   if(Users[i] == tempUserId)
  //     res.sendFile(path.join(__dirname, 'error.html'));
  Users.push(tempUserId);
  res.sendFile(path.join(__dirname, 'Index.html'));
});
app.get('/gameData',function(req,res){
  let findQuery = "SELECT * FROM Users";
  db.all(findQuery,(err,row)=>{
    res.render('data.ejs',{'data' : row});
  });
  
});

io.on('connection', function (socket) {//게임입장한 유저들은 IO로 관리됨
	console.log('io connected');
  socket.emit("GetId",tempUserId,tempUserDisplayName);
  socket.on('JoinRoom', (id,displayName) => {
    console.log(displayName);
    
    let findQuery = "SELECT * FROM Users WHERE id = ?";
    db.get(findQuery,id,(err,row)=>{//먼저 이 id의 플레이어가 db에 있는지 검색
        if(!row)//해당 id가 존재하지 않음
        {
          let insertQuery = "INSERT INTO Users(id, displayName,winCount,loseCount,rating) VALUES(?,?,?,?,?)";
          db.run(insertQuery,id,displayName,0,0,0, function (err) {
          if (err) {//이미 존재하는 id
            isInsertFinishedCollectly = false;
            errorMessage = "이미 존재하는 id";
          }
        });
        console.log("Insert New User to DB");
        }
      });
      
    
    if(Rooms.length == RoomNum)//아직 RoomNum에 해당하는 Room이 존재하지 않는다면
    {
      socket.join(RoomNum);
      Rooms.push(new Room(RoomNum));//방정보 생성
      Rooms[RoomNum].blackSocketId = socket.id;
      Rooms[RoomNum].blackId = id;
    }
    else//이미 RoomNum해당하는 Room이 존재한다면
    {
      if(Rooms[RoomNum].isValid)//유효한 방이라면
      {
        socket.join(RoomNum);
        Rooms[RoomNum].whiteSocketId = socket.id;
        Rooms[RoomNum].whiteId = id;
        io.to(Rooms[RoomNum].whiteSocketId).emit('GameReady', 'white',RoomNum);
        io.to(Rooms[RoomNum].blackSocketId).emit('GameReady', 'black',RoomNum);//플레이어에게 게임이 준비되었고 자신의 돌이 흑,백중 무엇인지 전달
        RoomNum++;
      }
      else
      {
        RoomNum++;
        socket.join(RoomNum);
        Rooms.push(new Room(RoomNum));//방정보 생성
        Rooms[RoomNum].blackSocketId = socket.id;
        Rooms[RoomNum].blackId = id;
      }
    }
  });
  socket.on("PutBlackStone",function(blackXIndex,blackYIndex,roomNum){//흑색 플레이어가 착수요청
    console.log("PutBlackRequest x : " + blackXIndex + "y : " + blackYIndex + " roomNum : " + roomNum );
    if(Rooms[roomNum].IsBlackWin(blackXIndex,blackYIndex))//오목 완성했을때
    {
      Rooms[roomNum].board[blackYIndex][blackXIndex] = 1;//흑돌 착수
      //흑색 승리결과 DB반영
      let findQuery = "SELECT * FROM Users WHERE id = ?";
      db.get(findQuery,Rooms[roomNum].blackId,(err,row)=>{//먼저 이 id의 플레이어가 db에 있는지 검색
        let sql = "UPDATE Users SET winCount = (?) WHERE id = (?)";
        db.run(sql,row.winCount+1,Rooms[roomNum].blackId, function (err) {
          if (err) {
              return console.error(err.message);
          }
          console.log("Users Update");
        });
      });
      //백색 패배결과 DB반영
      findQuery = "SELECT * FROM Users WHERE id = ?";
      db.get(findQuery,Rooms[roomNum].whiteId,(err,row)=>{//먼저 이 id의 플레이어가 db에 있는지 검색
        let sql = "UPDATE Users SET loseCount = (?) WHERE id = (?)";
        db.run(sql,row.loseCount+1,Rooms[roomNum].whiteId, function (err) {
          if (err) {
              return console.error(err.message);
          }
          console.log("Users Update");
        });
      });
      io.in(roomNum).emit("GameUpdate",2,blackXIndex,blackYIndex);//착수한 결과를 해당 방에 전달
      io.in(roomNum).emit("GameEnd",'black');//흑이 이겼다고 해당 방에 전달
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
      //백색 승리결과 DB반영
      let findQuery = "SELECT * FROM Users WHERE id = ?";
      db.get(findQuery,Rooms[roomNum].whiteId,(err,row)=>{//먼저 이 id의 플레이어가 db에 있는지 검색
        let sql = "UPDATE Users SET winCount = (?) WHERE id = (?)";
        db.run(sql,row.winCount+1,Rooms[roomNum].whiteId, function (err) {
          if (err) {
              return console.error(err.message);
          }
          console.log("Users Update");
        });
      });
      //흑색 패배결과 DB반영
      findQuery = "SELECT * FROM Users WHERE id = ?";
      db.get(findQuery,Rooms[roomNum].blackId,(err,row)=>{//먼저 이 id의 플레이어가 db에 있는지 검색
        let sql = "UPDATE Users SET loseCount = (?) WHERE id = (?)";
        db.run(sql,row.loseCount+1,Rooms[roomNum].blackId, function (err) {
          if (err) {
              return console.error(err.message);
          }
          console.log("Users Update");
        });
      });
      io.in(roomNum).emit("GameUpdate",1,whiteXIndex,whiteYIndex);//착수한 결과를 해당 방에 전달
      io.in(roomNum).emit("GameEnd",'white');//백이 이겼다고 해당 방에 전달
    }
    else//오목 완성못했을때
    {
      Rooms[roomNum].board[whiteYIndex][whiteXIndex] = 2;//백돌 착수
      Rooms[roomNum].currentTurn = 1;//흑색턴으로 전환
      io.in(roomNum).emit("GameUpdate",1,whiteXIndex,whiteYIndex);//착수한 결과를 해당 방에 전달
    }
  });
  socket.on("GetScreenInfo",function(){
    for(let i = 0;i<Rooms.length;i++)
    {
      if(Rooms[i].blackSocketId == socket.id)
      {
        let findQuery = "SELECT * FROM Users WHERE id = ?";
        db.get(findQuery,Rooms[i].blackId,(err,row)=>{
          if(row)
            io.to(Rooms[i].blackSocketId).emit("GetMyInfo",row.displayName,row.winCount,row.loseCount);
        });
        findQuery = "SELECT * FROM Users WHERE id = ?";
        db.get(findQuery,Rooms[i].whiteId,(err,row)=>{
          if(row)
            io.to(Rooms[i].blackSocketId).emit("GetOpponentInfo",row.displayName,row.winCount,row.loseCount);
        });
      }
      if(Rooms[i].whiteSocketId == socket.id)
      {
        let findQuery = "SELECT * FROM Users WHERE id = ?";
        db.get(findQuery,Rooms[i].whiteId,(err,row)=>{
          if(row)
            io.to(Rooms[i].whiteSocketId).emit("GetMyInfo",row.displayName,row.winCount,row.loseCount);
        });
        findQuery = "SELECT * FROM Users WHERE id = ?";
        db.get(findQuery,Rooms[i].blackId,(err,row)=>{
          if(row)
            io.to(Rooms[i].whiteSocketId).emit("GetOpponentInfo",row.displayName,row.winCount,row.loseCount);
        });
      }
    }
  });
  socket.on('disconnect', function () {
    for(let i = 0;i<Rooms.length;i++)
    {
      if(Rooms[i].blackSocketId == socket.id)
      {
        io.in(Rooms[i].roomName).emit("GameEnd",'white');//검정이 나가면 흰색승
        io.in(Rooms[i].roomName).emit("SomeoneLeft");//상대가 나가서 이겼음을 알림
        Rooms[i].isValid = false;
      }
      else if(Rooms[i].whiteSocketId == socket.id)
      {
        io.in(Rooms[i].roomName).emit("GameEnd",'black');//흰색이 나가면 검정승
        io.in(Rooms[i].roomName).emit("SomeoneLeft");//상대가 나가서 이겼음을 알림
        Rooms[i].isValid = false;
      }
    }
		console.log('user disconnected');
  });
});
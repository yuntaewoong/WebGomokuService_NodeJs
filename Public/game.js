
var socket = io();
var MyId = 0;
var MyDisplayName = '?';
var MyWinCount = -1;
var MyLoseCount = -1;
var OpponentDisplayName = '?';
var OpponentWinCount = -1;
var OpponentLoseCount = -1;
var board = new Board();
setInterval(function() {
    socket.emit("GetScreenInfo");
  }, 1000);
socket.on("GetId",function(id,displayName){
    console.log("get id");
    MyId = id;
    MyDisplayName = displayName;
    socket.emit('JoinRoom',MyId,MyDisplayName);//방 입장요청
});
socket.on("GetMyInfo",function(displayName,winCount,loseCount){
    MyDisplayName = displayName;
    MyWinCount = winCount;
    MyLoseCount = loseCount;
});
socket.on("GetOpponentInfo",function(displayName,winCount,loseCount){
    OpponentDisplayName = displayName;
    OpponentWinCount = winCount;
    OpponentLoseCount = loseCount;
});
socket.on("SomeoneLeft",function(){
    board.ui.isOpponentLeft = true;
});
socket.on("GameReady",function(stoneColor,roomNum) {//서버로부터 게임준비가 완료되었다고 전달받음
    socket.emit("GetScreenInfo");
    console.log("GameReady My stone color is" +  stoneColor);
    board.myColor = stoneColor;//내 돌색깔 설정
    board.ui.myColor = stoneColor;
    board.gameState = GameState.BLACKTURN;//선공은 흑
    board.ui.gameState = GameState.BLACKTURN;
    board.roomNum = roomNum;//게임이 관리되는 room번호
});
socket.on("GameUpdate",function(nextTurn,xIndex,yIndex){//서버로부터 게임상태 갱신
    console.log("GameUpdateCall");
    if(nextTurn == 1)//백돌을 놓아서 흑턴이 됨
    {
        console.log("Change to black turn");
        board.PutWhiteStone(xIndex,yIndex);
        board.gameState = GameState.BLACKTURN;
        board.ui.gameState = GameState.BLACKTURN;
    }
    else if(nextTurn == 2)//흑돌을 놓아서 백턴이 됨
    {
        console.log("Change to white turn");
        board.PutBlackStone(xIndex,yIndex);
        board.gameState = GameState.WHITETURN;
        board.ui.gameState = GameState.WHITETURN;
    }
});
socket.on("GameEnd",function(color){//서버로부터 게임종료 통보받음,color가 이김
    socket.emit("GetScreenInfo");
    console.log("GameEnd winner : " + color);
    if(color == "black")
        board.ui.isBlackWin = true;
    else if(color == 'white')
        board.ui.isWhiteWin = true;
    board.gameState = GameState.GAMEEND;
    board.ui.gameState = GameState.GAMEEND;
    addEventListener("mousedown",function(e){
        if(e.clientX >= board.ui.returnHomeButtonX && e.clientX <= board.ui.returnHomeButtonX + board.ui.returnHomeButtonWidth &&
            e.clientY >= board.ui.returnHomeButtonY && e.clientY <= board.ui.returnHomeButtonY + board.ui.returnHomeButtonHeight)//return home 버튼클릭이벤트 등록
        {
            this.location.replace("/");
            console.log("go home");
        }
    });
});
addEventListener("click",function(e){//클릭 이벤트
    if(board.gameState == GameState.BLACKTURN && board.myColor == 'black')
    {
        if(board.PutBlackStoneByMousePosition(e.clientX,e.clientY))
        {
            let blackXIndex = board.ParseMouseToBoard(e.clientX);
            let blackYIndex = board.ParseMouseToBoard(e.clientY);
            socket.emit("PutBlackStone",blackXIndex,blackYIndex,board.roomNum);
        }
    }
    else if(board.gameState == GameState.WHITETURN && board.myColor == 'white')
    {
        if(board.PutWhiteStoneByMousePosition(e.clientX,e.clientY))
        {
            let whiteXIndex = board.ParseMouseToBoard(e.clientX);
            let whiteYIndex = board.ParseMouseToBoard(e.clientY);
            socket.emit("PutWhiteStone",whiteXIndex,whiteYIndex,board.roomNum);
        }
    }
});

function update()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    board.Update();
	requestAnimationFrame(update);
}
update();
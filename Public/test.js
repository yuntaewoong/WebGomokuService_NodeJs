
var socket = io();
socket.emit('JoinRoom');//방 입장요청
socket.on("GameReady",function() {
    console.log("GameReady");
});

var board = new Board();
board.gameState = GameState.BLACKTURN;
function update()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    board.Update();
	requestAnimationFrame(update);
}
update();
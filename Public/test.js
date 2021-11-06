
//var socket = io();

var board = new Board();
board.gameState = GameState.BLACKTURN;
function update()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    board.Update();
	requestAnimationFrame(update);
}
update();
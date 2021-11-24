var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var GameState = Object.freeze({"BLACKTURN":1,"WHITETURN":2});
class UI
{
    winUIX = 1000;
    winUIY = 400;
    waitingUIX = 400;
    waitingUIY = 50;
    gameState = GameState.BLACKTURN;
    myColor;
    isBlackWin = false;
    isWhiteWin = false;
    constructor()
    {
    }
    Update()
	{
		this.DrawWinUI();
        this.DrawWaitingUI();
        console.log("this.gameState: " + this.gameState);
    }
	DrawWinUI()
	{
		if(this.isBlackWin)//흑색이 이길때
        {
            ctx.font = '30px serif';
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText("Winner is Black",this.winUIX,this.winUIY);
            ctx.closePath();
        }
        if(this.isWhiteWin)//흰색이 이길때
		{
            ctx.font = '30px serif';
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText("Winner is White",this.winUIX,this.winUIY);
            ctx.closePath();
        }
	}
	DrawWaitingUI()
	{
        if((this.myColor == 'black' && this.gameState == GameState.WHITETURN) ||
        (this.myColor == 'white' && this.gameState == GameState.BLACKTURN))//내턴이 아닐때
        {
            ctx.font = '30px serif';
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText("The opponent is thinking...",this.waitingUIX,this.waitingUIY);
            ctx.closePath();
        }
	}
}
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var GameState = Object.freeze({"BLACKTURN":1,"WHITETURN":2,"GAMEEND":3});
class UI
{
    winUIX = 1000;
    winUIY = 400;
    returnHomeButtonX = 1000;
    returnHomeButtonY = 500;
    returnHomeButtonWidth = 100;
    returnHomeButtonHeight = 100;
    MyInfoX = 0;
    MyInfoY = 0;
    OpponentInfoX = 900;
    OpponentInfoY = 0;
    InfoWidth = 100;
    InfoHeight = 100;
    InfoTextXOffset = 50;
    InfoTextYOffset = 20;
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
        this.DrawInfo();
    }
	DrawWinUI()
	{
        if(!(this.isBlackWin || this.isWhiteWin))
            return;
		if(this.isBlackWin)//흑색이 이길때
        {
            ctx.font = '30px serif';
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText("Winner is Black",this.winUIX,this.winUIY);
        }
        if(this.isWhiteWin)//흰색이 이길때
		{
            ctx.font = '30px serif';
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText("Winner is White",this.winUIX,this.winUIY);
        }
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(this.returnHomeButtonX,this.returnHomeButtonY,this.returnHomeButtonWidth,this.returnHomeButtonHeight);
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
    DrawInfo()
    {
        this.DrawMyInfo();
        this.DrawOpponentInfo();
    }
    DrawMyInfo()
    {
        ctx.strokeRect(this.MyInfoX,this.MyInfoY,this.InfoWidth,this.InfoHeight);
        ctx.font = '18px serif';
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillText(MyDisplayName,this.MyInfoX ,this.MyInfoY + this.InfoTextYOffset);
        ctx.fillText("win : " + MyWinCount,this.MyInfoX ,this.MyInfoY + 2 * this.InfoTextYOffset);
        ctx.fillText("lose : " + MyLoseCount,this.MyInfoX ,this.MyInfoY + 3 * this.InfoTextYOffset);
        ctx.fillText(board.myColor == "white" ? "white" : "black",this.MyInfoX ,this.MyInfoY + 4 * this.InfoTextYOffset);
    }
    DrawOpponentInfo()
    {
        ctx.strokeRect(this.OpponentInfoX,this.OpponentInfoY,this.InfoWidth,this.InfoHeight);
        ctx.font = '18px serif';
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillText(OpponentDisplayName,this.OpponentInfoX  ,this.OpponentInfoY + this.InfoTextYOffset);
        ctx.fillText("win : " + OpponentWinCount,this.OpponentInfoX  ,this.OpponentInfoY + 2 * this.InfoTextYOffset);
        ctx.fillText("lose : " + OpponentLoseCount,this.OpponentInfoX ,this.OpponentInfoY + 3 * this.InfoTextYOffset);
        ctx.fillText(board.myColor == "white" ? "black" : "white",this.OpponentInfoX ,this.OpponentInfoY + 4 * this.InfoTextYOffset);
    
    }
}
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
    isOpponentLeft = false;
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
        if(!(this.gameState == GameState.GAMEEND))
            return;
        if(this.isOpponentLeft)//상대방이 나갔으면
        {
            ctx.font = '30px serif';
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText("Opponent Left The Game",this.winUIX,this.winUIY-30);
        }
		if(this.isBlackWin)//흑색이 이길때
        {
            ctx.font = '30px serif';
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText("Winner Is Black",this.winUIX,this.winUIY);
        }
        else if(this.isWhiteWin)//흰색이 이길때
		{
            ctx.font = '30px serif';
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText("Winner Is White",this.winUIX,this.winUIY);
        }
        ctx.strokeRect(this.returnHomeButtonX,this.returnHomeButtonY,this.returnHomeButtonWidth,this.returnHomeButtonHeight);
        ctx.font = '35px serif';
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillText("Home",this.returnHomeButtonX + 3,this.returnHomeButtonY + this.returnHomeButtonHeight/2 +10);
	}
	DrawWaitingUI()
	{
        let today = new Date();  
        if(OpponentWinCount == -1)//상대가 아직 접속 안했을때
        {
            if(Math.sin(today.getMilliseconds() /100 *Math.PI + Math.PI/2) >= 0)//
            {
                ctx.font = '30px serif';
                ctx.fillStyle = "rgba(0,0,0,1)";
                ctx.fillText("Waiting opponent...",this.waitingUIX,this.waitingUIY);
                ctx.closePath();
            }
        }
        if((this.myColor == 'black' && this.gameState == GameState.WHITETURN) ||
        (this.myColor == 'white' && this.gameState == GameState.BLACKTURN))//내턴이 아닐때
        {  
            if(Math.sin(today.getMilliseconds() /100 *Math.PI + Math.PI/2) >= 0)//
            {
                ctx.font = '30px serif';
                ctx.fillStyle = "rgba(0,0,0,1)";
                ctx.fillText("The Opponent Is Thinking...",this.waitingUIX,this.waitingUIY);
                ctx.closePath();
            }
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
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var GameState = Object.freeze({"BLACKTURN":1,"WHITETURN":2});

class Board
{
	size = 800;
	blank = (canvas.width -this.size)/2;
	grids = 19;
	gridSize = this.size/(this.grids-1);
	infos;
	mouseX;
	mouseY;
	mouseOnRectSize = 20;
	gameState;
	constructor()
	{
		let self = this;
		addEventListener("mousemove",function(e){
			self.mouseX = e.clientX;
			self.mouseY = e.clientY;
		});
		this.infos = new Array(this.grids);
		for(let i = 0;i<this.grids;i++)
		{
			this.infos[i] = new Array(this.grids);
		}
		for(let i = 0;i<this.grids;i++)
		{
			for(let j = 0;j<this.grids;j++)
			{
				this.infos[i][j] = 0;
			}
		}
	}
	PutBlackStoneByMousePosition(mouseX,mouseY)
	{
		let tempX = this.ParseMouseToBoard(mouseX);
		let tempY = this.ParseMouseToBoard(mouseY);
		return this.PutBlackStone(tempX,tempY);
	}
	PutWhiteStoneByMousePosition(mouseX,mouseY)
	{
		let tempX = this.ParseMouseToBoard(mouseX);
		let tempY = this.ParseMouseToBoard(mouseY);
		return this.PutWhiteStone(tempX,tempY);
	}
	PutBlackStone(x,y)
	{
		if(this.infos[x][y] != 0)//비어있을때만
			return false;
		this.infos[x][y] = 1;
		return true;
	}
	PutWhiteStone(x,y)
	{
		if(this.infos[x][y] != 0)//비어있을때만
			return false;
		this.infos[x][y] = 2;
		return true;
	}
	Update()
	{
		this.DrawBoard();
	}
	DrawBoard()//0:빈칸 1:흑돌 2:백돌
	{
		this.DrawGrid();
		this.DrawStone();
		this.DrawMouseOnRect();
	}
	DrawGrid()
	{
		for(let i = 0;i<this.grids;i++)
		{
			ctx.beginPath();
			ctx.moveTo(this.blank,i * this.gridSize+this.blank);
			ctx.lineTo(this.size+this.blank,i * this.gridSize+this.blank);
			ctx.closePath();
			ctx.stroke();
		}
		for(let i = 0;i<this.grids;i++)
		{
			ctx.beginPath();
			ctx.moveTo(i * this.gridSize+this.blank,this.blank);
			ctx.lineTo(i * this.gridSize+this.blank,this.size+this.blank);
			ctx.closePath();
			ctx.stroke();
		}
	}
	DrawStone()
	{
		for(let i = 0;i<this.grids;i++)
		{
			for(let j = 0;j<this.grids;j++)
			{
				if(this.infos[i][j] == 1)
				{
					ctx.fillStyle = "#000000";
					ctx.beginPath();
					ctx.arc((i) * this.gridSize + this.blank,(j) * this.gridSize+this.blank,this.gridSize/2,0,2*Math.PI);
					ctx.closePath();
					ctx.fill();
				}
				else if(this.infos[i][j] == 2)
				{
					ctx.fillStyle = "#ffffff";
					ctx.beginPath();
					ctx.arc((i) * this.gridSize+this.blank,(j) * this.gridSize+this.blank,this.gridSize/2,0,2*Math.PI);
					ctx.closePath();
					ctx.stroke();
					ctx.beginPath();
					ctx.arc((i) * this.gridSize+this.blank,(j) * this.gridSize+this.blank,this.gridSize/2,0,2*Math.PI);
					ctx.closePath();
					ctx.fill();
				}
			}
		}
	}
	DrawMouseOnRect()
	{
		if(this.gameState == GameState.BLACKTURN)
		{
			ctx.beginPath();
			ctx.fillStyle = "#000000";
			ctx.rect(this.ParseMouseToBoard(this.mouseX) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.ParseMouseToBoard(this.mouseY) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.mouseOnRectSize,this.mouseOnRectSize);
			ctx.closePath();
			ctx.fill();
		}
		else if(this.gameState == GameState.WHITETURN)
		{
			ctx.strokeRect(this.ParseMouseToBoard(this.mouseX) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.ParseMouseToBoard(this.mouseY) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.mouseOnRectSize,this.mouseOnRectSize);
			ctx.beginPath();
			ctx.fillStyle = "#ffffff";
			ctx.rect(this.ParseMouseToBoard(this.mouseX) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.ParseMouseToBoard(this.mouseY) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.mouseOnRectSize,this.mouseOnRectSize);
			ctx.closePath();
			ctx.fill();
		}
	}
	ParseMouseToBoard(mouse)
	{
		console.log(parseInt((mouse - this.blank)/this.gridSize));
		return parseInt((mouse - this.blank)/this.gridSize);
	}
}
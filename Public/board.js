
class Board
{
	size = 800;
	blank = 100;
	grids = 19;
	gridSize = this.size/(this.grids-1);
	infos;
	mouseX;
	mouseY;
	mouseOnRectSize = 20;
	gameState;
	myColor;
	roomNum;
	ui;
	constructor()
	{
		this.ui = new UI();
		let self = this;
		addEventListener("mousemove",function(e){//mouse on rect를 출력
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
		this.ui.Update();
	}
	DrawBoard()//0:빈칸 1:흑돌 2:백돌
	{
		this.DrawGrid();
		this.DrawStone();
		this.DrawMouseOnRect();
		this.DrawBackGround();
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
			if(this.myColor == "white")
				return;//백색 플레이어는 흑색턴에는 무반응
			ctx.beginPath();
			ctx.fillStyle = "#000000";
			ctx.rect(this.ParseMouseToBoard(this.mouseX) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.ParseMouseToBoard(this.mouseY) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.mouseOnRectSize,this.mouseOnRectSize);
			ctx.closePath();
			ctx.fill();
		}
		else if(this.gameState == GameState.WHITETURN)
		{
			if(this.myColor == "black")
				return;//흑색 플레이어는 백색턴에는 무반응
			ctx.strokeRect(this.ParseMouseToBoard(this.mouseX) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.ParseMouseToBoard(this.mouseY) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.mouseOnRectSize,this.mouseOnRectSize);
			ctx.beginPath();
			ctx.fillStyle = "#ffffff";
			ctx.rect(this.ParseMouseToBoard(this.mouseX) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.ParseMouseToBoard(this.mouseY) * this.gridSize + this.blank-this.mouseOnRectSize/2,this.mouseOnRectSize,this.mouseOnRectSize);
			ctx.closePath();
			ctx.fill();
		}
	}
	DrawBackGround()
	{
		ctx.globalCompositeOperation = 'destination-over';
		ctx.fillStyle = "#FF9933";
		ctx.fillRect(this.blank,this.blank,this.size,this.size);
		ctx.globalCompositeOperation = 'source-over';
	}
	ParseMouseToBoard(mouse)
	{
		if(parseInt((mouse - this.blank)/this.gridSize) < 0)
			return 0;
		else if(parseInt((mouse - this.blank)/this.gridSize) >= this.grids)
			return this.grids-1;
		else
			return parseInt((mouse - this.blank)/this.gridSize);
	}
}
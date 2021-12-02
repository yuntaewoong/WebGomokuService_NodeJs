class Room//2명이서 진행되는 오목 게임정보를 관리하는 클래스
{
    roomName;
    blackId = 0;
    whiteId = 0;
    blackSocketId = 0;
    whiteSocketId = 0;
    currentTurn = 1;//1:흑색턴 2:백색턴
    isValid=true;
    board = [//room별로 관리되는 판정보 0:빈칸 1:흑 2:백
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    constructor(roomName)
    {
        this.roomName = roomName;
        this.currentTurn = 1;//항상 시작은 흑색부터
    }
    IsBlackWin(x,y)//(x,y)에 흑돌 두었을때 흑색 돌이 연속 5칸있는지 판단
    {
        return this.IsFive(x, y, 1, 1) || this.IsFive(x, y, 1, 2) || this.IsFive(x, y, 1, 3) || this.IsFive(x, y, 1, 4);
    }
    IsWhiteWin(x,y)//(x,y)에 흰돌 두었을때 흰색 돌이 연속 5칸있는지 판단
    {
        return this.IsFive(x, y, 2, 1) || this.IsFive(x, y, 2, 2) || this.IsFive(x, y, 2, 3) || this.IsFive(x, y, 2, 4);
    }
    IsFive(x,y,color,dir)//(x,y)에 돌을 두었을때 오목이 완성되는지 리턴
    {
        if (this.board[y][x] != 0)
		    return false;
        this.board[y][x] = color;
        let i
        let j;
        let nLine;
        switch (dir)
        {
        case 1:		// horizontal direction
            nLine = 1;
            i = x-1;
            while (i >= 0)
            {
                if (this.board[y][i--] == color)
                    nLine++;
                else
                    break;
            }
            i = x + 1;
        
            while (i < this.board.length)
            {
                if (this.board[y][i++] == color)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.board[y][x] = 0;
                return true;
            }
            else
            {
                this.board[y][x] = 0;
                return false;
            }
            break;
        case 2:		// vertial direction
            nLine = 1;
            i = y-1;
            while (i >= 0)
            {
                if (this.board[i--][x] == color)
                    nLine++;
                else
                    break;
            }
            i = y + 1;
            while (i < this.board.length)
            {
                if (this.board[i++][x] == color)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.board[y][x] = 0;
                return true;
            }
            else
            {
                this.board[y][x] = 0;
                return false;
            }
            break;
        case 3:		// diagonal direction - '/'
            nLine = 1;
            i = x-1;
            j = y-1;
            while ((i >= 0) && (j >= 0))
            {
                if (this.board[j--][i--] == color)
                    nLine++;
                else
                    break;
            }
            i = x + 1;
            j = y + 1;
            while ((i < this.board.length) && (j < this.board.length))
            {
                if (this.board[j++][i++] == color)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.board[y][x] = 0;
                return true;
            }
            else
            {
                this.board[y][x] = 0;
                return false;
            }
            break;
        case 4:		// diagonal direction - '\'
            nLine = 1;
            i = x-1;
            j = y + 1;
            while ((i >= 0) && (j < this.board.length))
            {
                if (this.board[j++][i--] == color)
                    nLine++;
                else
                    break;
            }
            i = x + 1;
            j = y - 1;
            while ((i < this.board.length) && (j >= 0))
            {
                if (this.board[j--][i++] == color)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.board[y][x] = 0;
                return true;
            }
            else
            {
                this.board[y][x] = 0;
                return false;
            }
            break;
        default:
            this.board[y][x] = 0;
            return false;
            break;
        }

    }
}
module.exports = Room;
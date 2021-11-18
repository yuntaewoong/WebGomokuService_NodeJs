class Room//2명이서 진행되는 오목 게임정보를 관리하는 클래스
{
    roomName;
    blackID = 0;
    whiteID = 0;
    constructor(roomName)
    {
        this.roomName = roomName;
    }
}
module.exports = Room;
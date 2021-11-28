const MessageType = Object.freeze({
  REGISTER: 'register',
  CHAT: 'chat',
  GAMEUPDATE: 'gameupdate',
  GAMESTART: 'gamestart',
  GAMESTOP: 'gamestop',
  SHOT: 'shot'
});


// Message :
// {
//    messageType: messageType,
//    value: value,
//    playerId: playerId,
//    playerName: playerName,
//    timestamp: timestamp
// }

class Message {
  constructor(messageType = MessageType.CHAT, value = "", playerID = 4419, playerName = 'Server') {
    this.messageType = messageType;
    this.value = value;
    this.playerID = playerID;
    this.playerName = playerName;
    this.timestamp = new Date();
  }
  fromJSON(stream) {
    var data = JSON.parse(stream);
    this.messageType = data.messageType;
    this.value = data.value;
    this.playerID = data.playerID;
    this.playerName = data.playerName;
    this.timestamp = new Date();
  }
  getMessageType() {
    return this.messageType;
  }
  getValue() {
    return this.value;
  }
  getPlayerId() {
    return this.playerID;
  }
  getPlayerName() {
    return this.playerName;
  }
  toJSON() {
    return JSON.stringify(
      {
        messageType: this.messageType,
        value: this.value,
        playerID: this.playerID,
        playerName: this.playerName,
        timestamp: this.timestamp
      });
  }
  getObject() {
    let object = {
      messageType: this.messageType,
      value: this.value,
      playerID: this.playerID,
      playerName: this.playerName,
      timestamp: this.timestamp
    }
    return object;
  }
  getMessageType() {
    return this.messageType;
  }
}

module.exports = {
  Message, MessageType
}
const Message = require('../Message')

class ChatMessage extends Message.Message
{
    constructor(text)
    {
        super(window.messageType.CHAT)
        this.text = text;
    }

    fromStream(stream)
    {
        this.stream = stream;
        var data = JSON.parse(stream);
        this.text = data.text;
    }

    toStream() {
        var data = {};
        data.messageType = this.messageType;
        data.text = this.text;
        data.playerName = 'Server';
        return JSON.stringify(data);
    }

    getText() {
        return this.text;
    }
}

module.exports = {
    ChatMessage : ChatMessage
}
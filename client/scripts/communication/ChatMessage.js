class ChatMessage extends window.Message
{
    constructor(text) {
        super(window.messageType.CHAT);
        this.text = text;
    }
    fromStream(stream) {
        this.stream = stream;
        var data = JSON.parse(stream);
        this.playerIdentifier = data.identifier;
        this.text = data.text;
    }
    toStream() {
        var data = {};
        data.objecttype = this.objectType;
        data.identifier = this.playerIdentifier;
        data.text = this.text;
        return JSON.stringify(data);
    }
}
window.ChatMessage = ChatMessage;
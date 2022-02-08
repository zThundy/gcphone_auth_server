const fs = require("fs");

class AutoResponder {
    constructor() {
        this.values = {};
        this.min = 0;
        this.channels = new Map();
    }

    _update() {
        var responder = fs.readFileSync('./responder.json', 'utf8');
        if (typeof responder === "string") responder = JSON.parse(responder);
        this.values = responder.values;
        this.min = responder.min_score;
    }

    _calculateScore(message) {
        let score = 0;
        message = message.toLowerCase();
        for (var i in this.values)
            if (message.includes(i.toLowerCase()))
                score += this.values[i];
        return score;
    }

    run(message) {
        var channelId = message.channel.id;
        if (!this.channels.has(channelId)) {
            var content = message.content;
            this._update();
            let score = this._calculateScore(content);
            if (score >= this.min) {
                this.channels.set(channelId, true);
                return true;
            }
            return false;
        }
    }
}

module.exports = AutoResponder;
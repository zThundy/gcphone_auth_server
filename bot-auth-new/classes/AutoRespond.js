const fs = require("fs");

class AutoResponder {
    constructor() {
        this.values = {};
        this.min = 0;
    }

    _update() {
        var responder = fs.readFileSync('../responder.json', 'utf8');
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
        this._update();
        let score = this._calculateScore(message);
        if (score >= this.min)
            return true;
        return false;
    }
}

module.exports = AutoResponder;
class AutoResponder {
    constructor(config) {
        this.values = config.values;
        this.config = config;
        this.min = config.min_score;
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
        let score = this._calculateScore(message);
        if (score >= this.min)
            return true;
        return false;
    }
}

module.exports = AutoResponder;
class ContextCommandBuilder {
    constructor(name) {
        if (!name) { throw "Non è possibile inizializzare un ContextCommand senza un nome!" }
        this.name = name;
        this.type = 3;
    }

    toJSON() {
        var json = JSON.parse("{}");
        json["name"] = this.name;
        json["type"] = this.type;
        return json;
    }
}

module.exports = ContextCommandBuilder
const fs = require("fs");

class Logger {
    constructor(config) {
        this.fusoOrario = config.fusoOrario;
        this.fileSuffix = "";
        this.logDateFormat = "";
    }

    log(type, data) {
        this._update();
        if (typeof type === "string") {
            switch(type) {
                case "error":
                    this._logError(data);
                    break;
                default:
                    this._logGeneral(data);
                    break;
            }
        } else {
            this._logGeneral(type);
        }
    }

    _update() {
        this.currentDate = new Date(Date.now() + (this.fusoOrario * (60 * 60 * 1000)));
        this.fileSuffix = (this.currentDate.getDate() + "-" + this.currentDate.getMonth() + 1) + "-" + this.currentDate.getFullYear();
        this.logDateFormat = this.currentDate.getHours() + ":" + this.currentDate.getMinutes() + ":" + this.currentDate.getSeconds();
    }

    _logGeneral(data) {
        const string = ("[" + this.logDateFormat + "]") + " > " + data.action + ": " + data.content + "\n";
        console.log(string);
        fs.appendFileSync("./logs/logs_" + this.fileSuffix + ".txt", string, 'utf8');
    }

    _logError(data) {
        const string = ("[" + this.logDateFormat + "]") + " > " + data.action + ": " + data.content + "\n";
        console.error(string);
        fs.appendFileSync("./logs/error_" + this.fileSuffix + ".txt", string, 'utf8');
    }
}

module.exports = Logger;
const mysql = require("mysql");

class MySQL {
    constructor(config) {
        this.config = config;
        this.connection = mysql.createConnection(this.config);
        
        this.connection.connect(err => {
            if (err) throw err;
            console.log("Connessione al database stabilita!");
            this.startKeepAlive();
        });
    }

    startKeepAlive() {
        setInterval(this.startKeepAlive, 600000);
        this.connection.query("SELECT NULL");
        console.log("Fired Keep-Alive");
    }
}

module.exports = MySQL;
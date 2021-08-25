const LangManager = require('./LangManager');
const mySQL = require('mysql');

class MySQLManager {

    constructor(data) {
        this.eventEmitter = data.eventEmitter;
        this.langManager = new LangManager("mysql");
        this.init(data.mysqlConnectionParams);
    }

    init(mysqlConnectionParams) {
        this.connection = new mySQL.createConnection({ host: mysqlConnectionParams.host, port: mysqlConnectionParams.port || 3306, database: mysqlConnectionParams.database, user: mysqlConnectionParams.user, password: mysqlConnectionParams.password, charset : "utf8mb4" });
        this.connection.connect(function(err) {
            if (err) throw err;
            this.eventEmitter.emit('mysql_connection_ready', { host: mysqlConnectionParams.host, database: mysqlConnectionParams.database, user: mysqlConnectionParams.user});
            this.keepAlive();
        }.bind(this));
    }

    getRooms(cb) {
        if (this.connection == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.connection.query("SELECT * FROM licenses", function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) { cb(result); } else { cb([]); }
        });
    }

    getRoomByUserId(user_id, cb) {
        if (this.connection == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.connection.query(this.getPreparedStatement("SELECT * FROM licenses WHERE user_id = ?", [user_id]), function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) { cb(result[0]); } else { cb([]); }
        });
    }

    addRoom(data) {
        if (this.connection == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.connection.query(this.getPreparedStatement("INSERT IGNORE INTO licenses (user_id, license, settings) values (?,?,?)", [data.user_id, data.license, data.settings]), function (err, result, fields) {
            if (err) throw err;
        });
    }

    removeRoomByUserId(user_id) {
        if (this.connection == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.connection.query(this.getPreparedStatement("DELETE FROM licenses WHERE user_id = ?", [user_id]), function (err, result, fields) {
            if (err) throw err;
        });
    }

    getSettingsByUserId(user_id, cb) {
        if (this.connection == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.connection.query(this.getPreparedStatement("SELECT * FROM licenses WHERE user_id = ?", [user_id]), function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) { cb(result[0]); } else { cb([]); }
        });
    }

    updateSettingsByUserId(user_id, settings) {
        if (this.connection == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.connection.query(this.getPreparedStatement("UPDATE licenses SET settings = ? WHERE user_id = ?", [settings, user_id]), function (err, result, fields) {
            if (err) throw err;
        });
    }

    getPreparedStatement(queryString, values) {
        var valuesToReplace = 0;
        if ((valuesToReplace = queryString.split('?').length - 1) < 1) { throw this.langManager.getString("BAD_QUERY_SYNTAX"); }
        if (valuesToReplace != values.length) { throw this.langManager.getString("QUERY_PASSED_VALUES_MISMATCH", valuesToReplace, values.length); }
        for (var i = 0; i < valuesToReplace; i++) {
            values[i] = "'" + values[i].replaceAll("'", "\\\'") + "'"
            queryString = queryString.replace(queryString.charAt(queryString.indexOf('?')), values[i])
        }
        return queryString;
    }

    keepAlive() {
        if (this.connection == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.connection.query("SELECT 1", function (err, result, fields) { setTimeout(() => this.keepAlive(), 14400000); }.bind(this)); // 4 Ore
    }
}

module.exports = MySQLManager

const LangManager = require('./LangManager');
const sqlite3 = require('sqlite3');
const Colors = require('../colors');
const colors = new Colors();

class SQLiteManager {
    constructor(data) {
        this.eventEmitter = data.eventEmitter;
        this.langManager = new LangManager("mysql");
        this.init();
    }

    init() {
        try {
            this.db = new sqlite3.Database("./database.db");
            this.db.run("CREATE TABLE IF NOT EXISTS licenses (user_id VARCHAR, room_id VARCHAR, license VARCHAR, settings TEXT)");
            this.eventEmitter.emit("mysql_connection_ready", { data: "something" });
        } catch(e) {
            console.log(colors.changeColor("red", "SQLite error: " + e));
            this.init();
        }
    }

    getRooms(cb) {
        if (!this.db) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.db.all("SELECT * FROM licenses", {}, function (err, result) {
            if (err) console.error(err);
            if (result && result.length > 0) { cb(result); } else { cb([]); }
        });
    }

    getRoomByUserId(user_id, cb) {
        if (!this.db) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.db.all("SELECT * FROM licenses WHERE user_id = ?", [
            user_id
        ], function (err, result) {
            if (err) console.error(err);
            if (result && result.length > 0) { cb(result[0]); } else { cb([]); }
        });
    }

    addRoom(data) {
        if (!this.db) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.db.run("INSERT INTO licenses (user_id, room_id, license, settings) VALUES (?, ?, ?, ?)", [
            data.user_id,
            data.room_id,
            data.license,
            data.settings
        ], function (err, result) {
            if (err) console.error(err);
        });
    }

    removeRoomByUserId(user_id) {
        if (!this.db) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.db.run("DELETE FROM licenses WHERE user_id = ?", [
            user_id
        ], function (err, result) {
            if (err) console.error(err);
        });
    }

    getSettingsByUserId(user_id, cb) {
        if (!this.db) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.db.all("SELECT * FROM licenses WHERE user_id = ?", [
            user_id
        ], function (err, result) {
            if (err) console.error(err);
            if (result && result.length > 0) { cb(result[0]); } else { cb([]); }
        });
    }

    updateSettingsByUserId(user_id, settings) {
        if (!this.db) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.db.all("UPDATE licenses SET settings = ? WHERE user_id = ?", [
            settings,
            user_id
        ], function (err, result) {
            if (err) console.error(err);
        });
    }

    updateRoom(data) {
        if (!this.db) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.db.run("UPDATE licenses SET license = ?, room_id = ? WHERE user_id = ?", [
            data.license,
            data.room_id,
            data.user_id
        ], function (err, result) {
            if (err) console.error(err);
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
}

module.exports = SQLiteManager;
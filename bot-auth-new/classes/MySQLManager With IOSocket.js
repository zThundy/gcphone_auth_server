const LangManager = require('./LangManager');
const mySQL = require('mysql');

class MySQLManager {

    constructor(data) {
        this.eventEmitter = data.eventEmitter;
        this.IOSocket = data.IOSocket;
        this.langManager = new LangManager("mysql");
        if (data.server) {
            this.init(data.mysqlConnectionParams);
            this.IOSocket.on('mysql_query', (query, cb) => {
                var builtQuery = query.queryData != undefined && query.queryData.length > 0 ? this.getPreparedStatement(query.queryString, query.queryData) : query.queryString;
                this.connection.query(builtQuery, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length > 0) { cb(result); } else { cb([]); }
                });
            });
        } else {
            this.eventEmitter.emit('mysql_connection_ready', {} );
        }
    }

    init(mysqlConnectionParams) {
        this.connection = new mySQL.createConnection({ host: mysqlConnectionParams.host, port: mysqlConnectionParams.port || 3306, database: mysqlConnectionParams.database, user: mysqlConnectionParams.user, password: mysqlConnectionParams.password, charset : "utf8mb4" });
        this.connection.connect(function(err) {
            if (err) throw err;
            this.eventEmitter.emit('mysql_connection_ready', { host: mysqlConnectionParams.host, database: mysqlConnectionParams.database, user: mysqlConnectionParams.user});
        }.bind(this));
    }

    getRooms(cb) {
        if (this.IOSocket == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.IOSocket.emit('mysql_query', { queryString: "SELECT * FROM licenses" }, function (result) { cb(result); });
    }

    getRoomByUserId(user_id, cb) {
        if (this.IOSocket == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.IOSocket.emit('mysql_query', { queryString: "SELECT * FROM licenses WHERE user_id = ?", queryData: [user_id] }, function (result) { cb(result); });
    }

    addRoom(data) {
        if (this.IOSocket == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.IOSocket.emit('mysql_query', { queryString: "INSERT IGNORE INTO licenses (user_id, license, settings) values (?,?,?)", queryData: [data.user_id, data.license, data.settings] }, function (result) {});
    }

    removeRoomByUserId(user_id) {
        if (this.IOSocket == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.IOSocket.emit('mysql_query', { queryString: "DELETE FROM licenses WHERE user_id = ?", queryData: [user_id] }, function (result) {});
    }

    getSettingsByUserId(user_id, cb) {
        if (this.IOSocket == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.IOSocket.emit('mysql_query', { queryString: "SELECT * FROM licenses WHERE user_id = ?", queryData: [user_id] }, function (result) { cb(result); });
    }

    updateSettingsByUserId(user_id, settings) {
        if (this.IOSocket == undefined) { throw this.langManager.getString("CONNECTION_NOT_AVAILABLE"); }
        this.IOSocket.emit('mysql_query', { queryString: "UPDATE licenses SET settings = ? WHERE user_id = ?", queryData: [settings, user_id] }, function (result) {});
    }

    getPreparedStatement(queryString, values) {
        var valuesToReplace = 0;
        if ((valuesToReplace = queryString.split('?').length - 1) < 1) { throw this.langManager.getString("BAD_QUERY_SYNTAX"); }
        if (valuesToReplace != values.length) { throw this.langManager.getString("QUERY_PASSED_VALUES_MISMATCH", valuesToReplace, values.length); }
        for (var i = 0; i < valuesToReplace; i++) {
            values[i] = "'" + values[i] + "'"
            queryString = queryString.replace(queryString.charAt(queryString.indexOf('?')), values[i])
        }
        return queryString;
    }
}

module.exports = MySQLManager
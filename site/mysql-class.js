// import mysql from 'mysql'
const mysql = require("mysql")

class MySQLConnection {
    constructor() {
        this.connection = mysql.createConnection({
            host: '51.91.91.226',
            user: 'remote',
            password: 'Anto-13062000',
            database: 'auth-server'
        });

        this.connection.connect(err => {
            if (err) throw err
            console.log("Connection to mysql enstablished")
        })

        this.createMysqlTimeout()
    }

    createMysqlTimeout() {
        setTimeout(() => {
            console.log("Database awakened")
            this.connection.query("SELECT NULL")
            this.createMysqlTimeout()
        }, 600 * 1000)
    }

    makeQuery(query, args, cb) {
        for (var i in args) {
            args[i] = this.connection.escape(args[i]);
            if (args[i].indexOf('\'') == 0) {
                args[i] = args[i].split("'")
                args[i] = args[i][1]
            }
        }
        // console.log(args)
        this.connection.query(query, args, cb) 
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }
}

/* eslint-disable */
(async function () {
})()

module.exports = MySQLConnection
// export default MySQLConnection
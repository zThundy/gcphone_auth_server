import mysql from 'mysql'

class MySQLConnection {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'remote',
            password: 'Anto-13062000',
            database: 'auth-server'
        });

        this.connection.connect(err => {
            if (err) throw err
            console.log("Connection to mysql enstablished")
        })
    }

    makeQuery(query, args, cb) {
        for (var i in args) {
            args[i] = this.connection.escape(args[i]);
        }
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

export default MySQLConnection
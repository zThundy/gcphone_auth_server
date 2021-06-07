import mysql from 'mysql'

class MySQLConnection {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Anto-13062000',
            database: 'auth-server'
        });

        this.connection.connect(err => {
            if (err) throw err
            console.log("Connection to mysql enstablished")
        })
    }

    makeQuery(query, cb) {
        this.connection.query(query, cb)
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
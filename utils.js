import fs from 'fs'

class utils {
    constructor() {
        this.blacklisted = []
        fs.readFile("./blacklist.txt", 'utf8', (err, data) => {
            // console.log(err)
            // console.log(data)
            this.blacklisted = JSON.parse(data)
        })
    }

    log(message) {
        fs.readFile("log.txt", 'utf8', (err, data) => {
            var currentdate = new Date(); 
            var datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth() + 1)  + "/"
                    + currentdate.getFullYear() + " | "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds() + " @"
            message = datetime + " " + message
            data = data + "\n" + message
            console.log(message)
    
            fs.writeFile("log.txt", data, (err) => {
                if (err) throw err;
            })
        })
    }
    
    autoBlacklist(ip) {
        try {
            if (blacklisted.includes(ip)) return;
            blacklisted.push(ip)
    
            fs.writeFile("./blacklist.txt", JSON.stringify(blacklisted), (err) => {
                if (err) throw err;
            })
        } catch(err) {
            console.error(err)
        }
    }
}

/* eslint-disable */
(async function () {
})()

export default utils
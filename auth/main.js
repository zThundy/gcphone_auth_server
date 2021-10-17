const express = require("express")
const fs = require("fs")
const aes256 = require("aes256")
const io = require("socket.io-client")

const app = express()

const port = 5000
const socketPort = 6969
const socketIp = "http://phoneauth.it:" + socketPort
var licenses = {}

const socket = io.connect(socketIp)
log(`Trying connecting to ${socketIp}`)
const token = "HGx3YmgEkoPMpGh9q6LSSKPTECxoCtCd4moLMme5"

socket.on('updateIPTables', jsonString => {
    if (jsonString == undefined || jsonString == "") {
        log("Error retreiving licenses from database: jsonString is undefined or empty; using cached ones")
        licenses = require("./cached_licenses.json")
        return
    }
    try {
        var authServerIPs = JSON.parse(aes256.decrypt(token, jsonString))
        if (Object.keys(authServerIPs).length > 0) {
            licenses = authServerIPs
            log("Got licenses from the database")
            fs.writeFile("./cached_licenses.json", JSON.stringify(authServerIPs, null, 2), (err) => {
                if (err) throw err;
            })
        }
    } catch(error) {
        log("Error retreiving licenses from database: " + error + "; using cached ones")
        licenses = require("./cached_licenses.json")
    }
})

var blacklisted = []
fs.readFile("./blacklist.txt", 'utf8', (err, data) => {
    blacklisted = JSON.parse(data)
})

app.get('/', (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split(":")
    ip = ip[3]
    let args = req.query

    if (!args.type) {
        res.status(403).send("CUNT")
        log(ip + ' tryed authing without any query params')
        autoBlacklist(ip)
        res.end();
        return
    }

    if (blacklisted.includes(ip) && !licenses[ip]) {
        log(ip + " his blacklisted OMEGALUL")
        res.status(403).send("Bye bye nigger")
        res.end();
        return
    } else if (blacklisted.includes(ip) && licenses[ip]) {
        log(ip + " was blacklisted, bot now is no more :)")
        var index = blacklisted.indexOf(ip)
        blacklisted.splice(index, 1)
        fs.writeFile("blacklist.txt", JSON.stringify(blacklisted), (err) => {
            if (err) throw err;
        })
    }

    args = args.type
    if (args.indexOf("startup:") == -1 && args.indexOf("auth") == -1) {
        res.status(403).send("CUNT")
        log(ip + ' no correct arguments where given')
        autoBlacklist(ip)
        res.end();
        return
    }

    if (licenses[ip]) {
        if (args.indexOf("startup:") == 0) {
            if (licenses[ip][1] == args.split(":")[1]) {
                res.status(200).send("Correct auth :)")
                log(ip + ' started successfully | ' + licenses[ip][0])
                res.end();
            } else {
                res.status(403).send("CUNT")
                log(ip + ' has been blocked because of startup failure')
                autoBlacklist(ip)
                res.end();
            }
        }

        if (args.indexOf("auth") == 0) {
            var string = {
                license: licenses[ip][1],
                servername: licenses[ip][0],
                text: "STATUS_OK",
                random_id: makeid(50)
            }
            string = JSON.stringify(string);
            var encrypted = aes256.encrypt(licenses[ip][1], string);
            res.status(200).send(encrypted);
            res.end();
            log(ip + ' authed successfully | ' + licenses[ip][0]);
        }
    } else {
        res.status(403).send("CUNT");
        res.end();
        log(ip + ' has been blocked because not present in the ip whitelist');
        autoBlacklist(ip);
    }
})

function log(message) {
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

function autoBlacklist(ip) {
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

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

app.listen(port, () => {
    log(`Listening on port ${port}`);
});

socket.on('connect', () => {
    log(`Socket connected on port ${socketPort}`);
});
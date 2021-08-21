const express = require("express")
// const session = require("cookie-session")
const fs = require("fs")
const aes256 = require("aes256")
const io = require("socket.io-client")
// const favicon = require("serve-favicon")
// const path = require("path")
// const http = require("http")
// const https = require("https")

const app = express()

// var privateKey = fs.readFileSync('//etc/letsencrypt/archive/phoneauth.it/privkey1.pem');
// var certificate = fs.readFileSync('//etc/letsencrypt/archive/phoneauth.it/cert1.pem');
// var credentials = { key: privateKey, cert: certificate }

// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);
// console.log(privateKey,certificate)

// httpServer.listen(80);
// httpsServer.listen(443);
// const io = require("io")
// const nodemailer = require("nodemailer")

// const site = require("./routes/site.js")
// const dashboard = require("./routes/dashboard.js")

// import express from 'express'
// import session from 'cookie-session'
// import fs from 'fs'
// import aes256 from 'aes256'
// import favicon from 'serve-favicon'
// import path from 'path'

// import site from './routes/site.js'
// import dashboard from './routes/dashboard.js'
// const http = require('http')
// const server = http.createServer(app)
// const _io = io.listen(server);
// const port = 80
const port = 5000
// app.set('trust proxy', 1);
// app.set('view engine', 'ejs');
// app.use(session({
// 	secret: 'Yum6IiVGvC5%lguToVH4U6FaLr5PE0t7i3k5JU8RVZZFKeWEX1a8r$SNZvEzf#CLUcZ%4G1E2r9',
//     cookieName: 'session',
//     maxAge: 30 * 60 * 1000,
//     // maxAge: 1000,
//     // cookie: { secure: true },
//     httpOnly: false,
//     signed: true,
//     overwrite: false
//     // path: '/site/'
// }));
// app.use("/site", site)
// app.use("/dashboard", dashboard)
// app.use(favicon(path.join("html", 'assets', 'phone_logo.png')));
// app.use(express.favicon("./html/assets/phone_logo.ico")); 

// const secureKey = "0&l8vUP4zU&8bdgzte3M7zTjFbd&ANkAG@EJWfJ%o1Dt!*&!jZP3wjLUhT*g2o9AKL5FZx&hRql2!piXrz5xs@4idS"

/*
var licenses = {
    '37.183.248.215': ['localhost', 'po82TPxrwlsiEW1GRLMpD6BHfpAmpcUVT3Eb2j2P'],
    '87.5.67.183': ["gasaferic", "dioporco"],
    '185.229.237.255': ['Server di Il_bomber98', 'wciLUG2p35HlylU18IZ0vK5Q6aK9jXmR62NAvzuJ'],
    '51.178.68.203': ['Server di Leo', 'P7xD1gGDWVduYCb7LRuJvvd07EMCnzN2lTYkg5YN'],
    '5.181.31.154': ["Server di Leo Test", "P7xD1gGDWVduYCb7LRuJvvd07EMCnzN2lTYkg5YN"],
    '185.229.237.23': ['Server Mariex', 'xq2sO6BMkC6D52fEG2S5wL1PyfnSun1IYIc7luTf'],
    '185.229.237.118': ['Server Mariex Test', 'xq2sO6BMkC6D52fEG2S5wL1PyfnSun1IYIc7luTf'],
    '2.32.22.100': ['Server Don Samuele Test', 'kc6rjUL815yf1uwDH2j8N1qwYzhEqxMq0VCWhDbN'],
    '5.181.31.145': ['Server Don Samuele', 'kc6rjUL815yf1uwDH2j8N1qwYzhEqxMq0VCWhDbN'],
    '5.181.31.120': ['Server Fabryy', 'DTyaIN44iwM8JWX3Xa78TXIWkjNMF1Zsri9jmdMh'],
    '5.181.31.226': ['Server Fabryy Test', 'DTyaIN44iwM8JWX3Xa78TXIWkjNMF1Zsri9jmdMh'],
    '185.25.204.107': ['Impero Main', 'owDfEWgmJTp8LFQWN2PL4QkFg3Ej8mywhA97obdU'],
    '185.25.206.161': ['Impero Test', 'owDfEWgmJTp8LFQWN2PL4QkFg3Ej8mywhA97obdU'],
    '5.181.31.214': ['ItsRobeez Server', 'I772zEdgEjiETyIkJ4eTY8LZhCNbjA5ZMxvs6jRg'],
    '5.181.31.115': ['Loupass69 Server', 'rV168bEWsy82Q8fFDxojNhYxbpWJ2XBQ61IkBHMf'],
    '5.181.31.108': ['Loupass69 Server Test', 'rV168bEWsy82Q8fFDxojNhYxbpWJ2XBQ61IkBHMf'],
    '185.229.237.239': ['Vanquest Server Test', 'oIW37tjgJ9fTeiXxQW4ME3blaXBs9T4j1ZDn6Ipk'],
    '5.181.31.142': ['Vanquest Server Main', 'oIW37tjgJ9fTeiXxQW4ME3blaXBs9T4j1ZDn6Ipk'],
    '45.14.185.23': ['ExplicitCode Main', 'Ek0RvWP0iMlkf9EivfiXgibiOCUBf8QGhzF5Xw4x'],
    '5.181.31.152': ['ExplicitCode Test', 'Ek0RvWP0iMlkf9EivfiXgibiOCUBf8QGhzF5Xw4x'],
    '164.132.203.223': ['SaToX Main', '2BdnylZb6HvXHfj2rC6PWMLVCJFIM0WgbXNbS1i3'],
    '5.181.31.121': ['SaToX Test', '2BdnylZb6HvXHfj2rC6PWMLVCJFIM0WgbXNbS1i3'],
    '164.132.207.215': ["Scheggia Main Server", "Y1LRopaEycRrGVXVuGewU9TyBblZ4U7ZTs4KHxdP"],
    '5.181.31.90': ["Server Fil_52", "W8OlREdk8UrWvjgy7MwW016ZLRrFXiUpT7pxJyUo"],
    '185.25.205.96': ["Server Fil_52 Test", "W8OlREdk8UrWvjgy7MwW016ZLRrFXiUpT7pxJyUo"],
    '149.202.89.29': ["Doc Server", "JiuIP4haI39YGDNo4YlFdMjqGPC37ntZJs4J5n4c"],
    '5.181.31.218': ["Server Packy Anderson", "JfJpQC5YVTrfVbLE429N29FVjQkHK1I9JxcsL3mO"],
    '5.181.31.236': ["Spino Server", "4Rxa7TmKO8xaQXa5fHUqr0xZ6KaQjH8nGWHGGHiU"],
    '185.229.237.182': ["Crast Game Server", "iJEMPIWjyD5qC2guHaxt4F1HB2qUAJ7jpW7OU8YA"],
    '37.183.105.30': ["Malik test server", "stca8mKtP22dfmeB9SRT59DTX4Sp6Nyqm4w3zk3a"],
    '5.181.31.122': ["Malik main Server", "stca8mKtP22dfmeB9SRT59DTX4Sp6Nyqm4w3zk3a"],
    '5.181.31.146': ["ImClod server", "qScuvrAePm2VDY7Q7T2WXkvjqcsfNU3CSy6FTyQz"],
    '93.70.80.140': ["MattkLaurence server", "g5pwuxQPaf7krRTQ7BwPcxmCABn2WDja3rz7TbDr"],
    '79.12.145.35': ["LordXenaroth server test", "Mqu0O4TlnRucXdx9ojZBTyDU20t1cbRxzwtES25L"],
    '5.181.31.229': ["LordXenaroth server main", "Mqu0O4TlnRucXdx9ojZBTyDU20t1cbRxzwtES25L"],
    '5.181.31.103': ["Filoceste server main", "DaVgkHrjQP9uLVlFOTAOq4ZJmG1y5U0ba8zloDFj"],
    '5.181.31.66': ["Edo server", "p6QD38fe1tDOPnmv4qccGjh2N4E0tFtPjVnwvElF"],
    '138.201.255.68': ["Vuitton Server", "gcMLa7mgfJ7q8oK4NdRkB7KLnxSEjBbJ7n6yQsyy"],
    '193.70.1.58': ["Samu Evos Server", "7PXfdR4XeHY3ExXcyi6YBQFraTrJFLdeAMxemFBE"],
    '5.181.31.162': ["Samu Evos Test Server", "7PXfdR4XeHY3ExXcyi6YBQFraTrJFLdeAMxemFBE"],
    '164.132.203.150': ["Marco-Ombra Server", "6yN6oJsrRBYPH9nz3ejks7jiqMH4sNNjL3xTc37s"],
    '45.14.185.68': ["Mistero4k Server", "ASNyJQoFE7JM9QpQBbJbhPiL6Cd8gCYpgELCSD5G"]
}
*/
var licenses = {}

// ca: fs.readFileSync('./cert.pem', 'utf8')
const socket = io("http://phoneauth.it:6969")
const token = "HGx3YmgEkoPMpGh9q6LSSKPTECxoCtCd4moLMme5"

socket.on('updateIPTables', jsonString => {
    // console.log(jsonString)
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
        // console.log(error)
        log("Error retreiving licenses from database: " + error + "; using cached ones")
        licenses = require("./cached_licenses.json")
    }
})



var blacklisted = []
fs.readFile("./blacklist.txt", 'utf8', (err, data) => {
    // console.log(err)
    // console.log(data)
    blacklisted = JSON.parse(data)
})

// app.get("/site", (req, res) => {
//     res.redirect("/site/login")
// })

app.get('/', (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split(":")
    ip = ip[3]
    // console.log(ip)
    let args = req.query
    // console.log(req)
    // args = args.split("=")
    // console.log(args)
    // console.log(licenses[ip])
    // args = args[1]

    // console.log(args.indexOf("startup:") == -1 && args.indexOf("auth") == -1)
    if (!args.type) {
        res.status(403).send("CUNT")
        // res.sendFile('./index.html', { root: '/home/auth-server/' });
        // res.redirect("/site/login")
        log(ip + ' tryed authing without any query params')
        autoBlacklist(ip)
        return
    }

    if (blacklisted.includes(ip) && !licenses[ip]) {
        log(ip + " his blacklisted OMEGALUL")
        res.status(403).send("Bye bye nigger")
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
        return
    }

    if (licenses[ip]) {
        if (args.indexOf("startup:") == 0) {
            if (licenses[ip][1] == args.split(":")[1]) {
                res.status(200).send("Correct auth :)")
                log(ip + ' started successfully | ' + licenses[ip][0])
            } else {
                res.status(403).send("CUNT")
                log(ip + ' has been blocked because of startup failure')
                autoBlacklist(ip)
            }
        }

        if (args.indexOf("auth") == 0) {
            var string = {
                license: licenses[ip][1],
                servername: licenses[ip][0],
                text: "STATUS_OK",
                random_id: makeid(50)
            }
            string = JSON.stringify(string)
            // console.log(string)
            var encrypted = aes256.encrypt(licenses[ip][1], string)
            // console.log(encrypted)
            res.status(200).send(encrypted)
            log(ip + ' authed successfully | ' + licenses[ip][0])
            // console.log(ip)
            // console.log(args)
            // console.log(licenses[ip])
        }
    } else {
        res.status(403).send("CUNT")
        log(ip + ' has been blocked because not present in the ip whitelist')
        autoBlacklist(ip)
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
        // console.log(this.blacklisted)
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

// http.get("http://phoneauth.it", {
//     lookup: function() {
//         console.log("lookup func")
//     }
// });

app.listen(port, () => {
    log(`Listening on port ${port}`)
})

import express from 'express'
import session from 'cookie-session'
import fs from 'fs'
import aes256 from 'aes256'
import favicon from 'serve-favicon'
import path from 'path'

import site from './routes/site.js'
import dashboard from './routes/dashboard.js'

const app = express()
const port = 80
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.use(session({
	secret: 'Yum6IiVGvC5%lguToVH4U6FaLr5PE0t7i3k5JU8RVZZFKeWEX1a8r$SNZvEzf#CLUcZ%4G1E2r9',
    cookieName: 'session',
    maxAge: 30 * 60 * 1000,
    // cookie: { secure: true },
    httpOnly: true,
    signed: true,
    overwrite: false
    // path: '/site/'
}));
app.use("/site", site)
app.use("/dashboard", dashboard)
app.use(favicon(path.join("html", 'assets', 'phone_logo.png')));
// app.use(express.favicon("./html/assets/phone_logo.ico")); 

// const secureKey = "0&l8vUP4zU&8bdgzte3M7zTjFbd&ANkAG@EJWfJ%o1Dt!*&!jZP3wjLUhT*g2o9AKL5FZx&hRql2!piXrz5xs@4idS"

const licenses = {
    '185.229.237.255': ['Server di Leo', 'P7xD1gGDWVduYCb7LRuJvvd07EMCnzN2lTYkg5YN'],
    '185.229.237.23': ['Server Mariex', 'xq2sO6BMkC6D52fEG2S5wL1PyfnSun1IYIc7luTf'],
    '185.229.237.118': ['Server Mariex Test', 'xq2sO6BMkC6D52fEG2S5wL1PyfnSun1IYIc7luTf'],
    '62.171.133.183': ['Server Don Samuele', 'kc6rjUL815yf1uwDH2j8N1qwYzhEqxMq0VCWhDbN'],
    '5.181.31.145': ['Server Don Samuele Test', 'kc6rjUL815yf1uwDH2j8N1qwYzhEqxMq0VCWhDbN'],
    // '109.116.199.145': ['localhost', 'po82TPxrwlsiEW1GRLMpD6BHfpAmpcUVT3Eb2j2P'],
    '5.181.31.120': ['Server Fabryy', 'DTyaIN44iwM8JWX3Xa78TXIWkjNMF1Zsri9jmdMh'],
    '185.25.204.107': ['Impero Main', 'owDfEWgmJTp8LFQWN2PL4QkFg3Ej8mywhA97obdU'],
    '185.25.206.161': ['Impero Test', 'owDfEWgmJTp8LFQWN2PL4QkFg3Ej8mywhA97obdU'],
    '5.181.31.114': ['ItsRobeez Server', 'I772zEdgEjiETyIkJ4eTY8LZhCNbjA5ZMxvs6jRg'],
    '5.181.31.115': ['Loupass69 Server', 'rV168bEWsy82Q8fFDxojNhYxbpWJ2XBQ61IkBHMf'],
    '185.229.237.239': ['Vanquest Server Test', 'oIW37tjgJ9fTeiXxQW4ME3blaXBs9T4j1ZDn6Ipk'],
    '45.14.185.23': ['ExplicitCode Main', 'Ek0RvWP0iMlkf9EivfiXgibiOCUBf8QGhzF5Xw4x'],
    '5.181.31.152': ['ExplicitCode Test', 'Ek0RvWP0iMlkf9EivfiXgibiOCUBf8QGhzF5Xw4x'],
    '185.229.237.209': ['Simone.exe Main', '2BdnylZb6HvXHfj2rC6PWMLVCJFIM0WgbXNbS1i3'],
    '5.181.31.121': ['Simone.exe Test', '2BdnylZb6HvXHfj2rC6PWMLVCJFIM0WgbXNbS1i3']
}

var blacklisted = []
fs.readFile("./blacklist.txt", 'utf8', (err, data) => {
    // console.log(err)
    // console.log(data)
    blacklisted = JSON.parse(data)
})

app.get("/site", (req, res) => {
    res.redirect("/site/login")
})

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
        // res.status(403).send("CUNT")
        // res.sendFile('./index.html', { root: '/home/auth-server/' });
        res.redirect("/site/login")
        log(ip + ' tryed authing without any query params, so sending index page')
        // autoBlacklist(ip)
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
                log(ip + ' started successfully')
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
            log(ip + ' authed successfully')
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

app.listen(port, () => {
    log(`Listening on port ${port}`)
})
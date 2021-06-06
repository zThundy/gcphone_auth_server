import express from 'express'
import fs from 'fs'
import aes256 from 'aes256'
const app = express()
const port = 80

const licenses = {
    '185.229.237.255': ['Server di Leo', 'P7xD1gGDWVduYCb7LRuJvvd07EMCnzN2lTYkg5YN'],
    '185.229.237.23': ['Server Mariex', 'xq2sO6BMkC6D52fEG2S5wL1PyfnSun1IYIc7luTf'],
    '185.229.237.118': ['Server Mariex Test', 'xq2sO6BMkC6D52fEG2S5wL1PyfnSun1IYIc7luTf'],
    '62.171.133.183': ['Server Don Samuele', 'kc6rjUL815yf1uwDH2j8N1qwYzhEqxMq0VCWhDbN'],
    '5.181.31.145': ['Server Don Samuele Test', 'kc6rjUL815yf1uwDH2j8N1qwYzhEqxMq0VCWhDbN'],
    '109.116.199.145': ['localhost', 'po82TPxrwlsiEW1GRLMpD6BHfpAmpcUVT3Eb2j2P'],
    '5.181.31.120': ['Server Fabryy', 'DTyaIN44iwM8JWX3Xa78TXIWkjNMF1Zsri9jmdMh'],
    '185.25.204.107': ['Impero Main', 'owDfEWgmJTp8LFQWN2PL4QkFg3Ej8mywhA97obdU'],
    '185.25.206.161': ['Impero Test', 'owDfEWgmJTp8LFQWN2PL4QkFg3Ej8mywhA97obdU'],
    '5.181.31.114': ['ItsRobeez Server', 'I772zEdgEjiETyIkJ4eTY8LZhCNbjA5ZMxvs6jRg'],
    '5.181.31.115': ['Loupass69 Server', 'rV168bEWsy82Q8fFDxojNhYxbpWJ2XBQ61IkBHMf'],
    '185.229.237.239': ['Vanquest Server Test', 'oIW37tjgJ9fTeiXxQW4ME3blaXBs9T4j1ZDn6Ipk']
}

var blacklisted = []
fs.readFile("./blacklist.txt", 'utf8', (err, data) => {
    // console.log(err)
    // console.log(data)
    blacklisted = JSON.parse(data)
})

app.get('/', (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split(":")
    ip = ip[3]
    console.log(ip)
    let args = req.url
    args = args.split("=")
    // console.log(args)
    // console.log(licenses[ip])
    args = args[1]

    if (blacklisted.includes(ip) && !licenses[ip]) {
        res.status(403).send("Bye bye nigger")
        return
    } else if (blacklisted.includes(ip) && licenses[ip]) {
        var index = blacklisted.indexOf(ip)
        blacklisted.splice(index, 1)
        fs.writeFile("blacklist.txt", JSON.stringify(blacklisted), (err) => {
            if (err) throw err;
        })
    }

    // console.log(args.indexOf("startup:") == -1 && args.indexOf("auth") == -1)
    if (!args) {
        res.status(403).send("CUNT")
        log(ip + ' no correct arguments where given')
        autoBlacklist(ip)
        return
    }

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
                text: "STATUS_OK"
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

app.listen(port, () => {
    log(`Listening on port ${port}`)
})

function log(message) {
    fs.readFile("log.txt", 'utf8', (err, data) => {
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
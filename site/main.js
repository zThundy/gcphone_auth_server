const express = require("express");
const session = require("cookie-session");
const fs = require("fs");
// const aes256 = require("aes256");
const favicon = require("serve-favicon");
const path = require("path");
// const http = require("http");
const https = require("https");
// const nodemailer = require("nodemailer");
// const smtpTransport = require('nodemailer-smtp-transport');

const port = 80;
const app = express();

var privateKey = fs.readFileSync('/etc/letsencrypt/archive/phoneauth.it/privkey1.pem');
var certificate = fs.readFileSync('/etc/letsencrypt/archive/phoneauth.it/cert1.pem');
var credentials = { key: privateKey, cert: certificate }

// var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
// console.log(privateKey,certificate)

app.listen(port, () => {
    log(`Listening on port ${port}`)
})

// httpServer.listen(80);
httpsServer.listen(443);
// const io = require("io")

const site = require("./routes/site.js")
const dashboard = require("./routes/dashboard.js")

// const http = require('http')
// const server = http.createServer(app)
// const _io = io.listen(server);
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.use(session({
	secret: 'Yum6IiVGvC5%lguToVH4U6FaLr5PE0t7i3k5JU8RVZZFKeWEX1a8r$SNZvEzf#CLUcZ%4G1E2r9',
    cookieName: 'session',
    maxAge: 30 * 60 * 1000,
    // maxAge: 1000,
    // cookie: { secure: true },
    httpOnly: false,
    signed: true,
    overwrite: false
    // path: '/site/'
}));
app.use("/", site)
app.use("/dashboard", dashboard)
app.use(favicon(path.join("html", 'assets', 'phone_logo.png')));
// app.use(express.favicon("./html/assets/phone_logo.ico")); 

// const secureKey = "0&l8vUP4zU&8bdgzte3M7zTjFbd&ANkAG@EJWfJ%o1Dt!*&!jZP3wjLUhT*g2o9AKL5FZx&hRql2!piXrz5xs@4idS" 

app.get('*', (req, res) => {
    // res.redirect("/login")
    res.redirect('https://' + req.headers.host + req.url + "login");
})

// app.get("/.well-known/acme-challenge/nGFxpwWa5RAfy9GV_3RMr-sxHl3VKZ9NglM30CGJ7Ek", (req, res) => {
//     res.sendFile("./.well-known/acme-challenge/nGFxpwWa5RAfy9GV_3RMr-sxHl3VKZ9NglM30CGJ7Ek", { root: '/home/auth-server/' })
// })

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

// http.get("http://phoneauth.it", {
//     lookup: function() {
//         console.log("lookup func")
//     }
// });
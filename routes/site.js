/* SITE */
const express = require("express")
const bodyParser = require("body-parser")
const MySQLConnection = require("../mysql-class.js")
const path = require("path")
const bcrypt = require("bcrypt")
const request = require("request")

// import express from 'express'
// import bodyParser from 'body-parser'
// import MySQLConnection from '../mysql-class.js'
// import path from 'path'
// import bcrypt from 'bcrypt'

const saltRounds = 15
const router = express.Router()
const mysql = new MySQLConnection()
const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const catcha_secretKey = "6LelZiUbAAAAAO4zt1KU3wz0rop97IzYxE0_nAl7";

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join("./html", 'assets')));

// router.set('view engine', 'pug');
// router.set("views", path.join("/"));

router.get('/login', (req, res) => {
    // console.log(req.session)
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        // res.redirect('/dashboard/');
        res.redirect("/dashboard/");
        // res.redirect('/dashboard/?username=' + req.session.username);
    } else {
        res.render("login", { display: "", notification: "none", message: "none" })
        // res.sendFile('./login.html', { root: '/home/auth-server/html/' })
    }
});

router.get("/button_press/:variable", (req, res) => {
    // console.log("got post")
    // console.log(req)
    // console.log(req.params)
    if (req.params) {
        // console.log(req.body)
        if (req.params.variable == ":recover") {
            // console.log('rerender recover')
            // res.redirect("./site/recover")
            // res.send("Loading")
            // res.render("recover", { display: "none", notification: "none", message: "none" });
            // res.sendFile('./recover.ejs', { root: '/home/auth-server/views/' })
            res.json({ display: "none" })
        } else if (req.params.variable == ":login") {
            // console.log('rerender login')
            // res.redirect("./site/login")
            // res.send("Loading")
            // res.render("login.ejs", { display: "none", notification: "none", message: "none" });
            res.json({ display: "none" })
        } else if (req.params.variable == ":register") {
            // console.log('rerender register')
            // res.redirect("./site/register")
            // res.send("Loading")
            // res.render("register", { display: "none", notification: "none", message: "none" });
            res.json({ display: "none" })
        }
    }
    // console.log('got get')
});

router.get('/register', (req, res) => {
    // console.log(req.session)
    res.render("register", { display: "", notification: "none", message: "none" });
    // res.sendFile('./register.html', { root: '/home/auth-server/html/' })
});

router.get('/recover', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        // res.redirect('/dashboard/');
        // res.render('home', { username: req.session.username, email: req.session.email })
        // res.redirect('/dashboard/?username=' + req.session.username);
        res.redirect("/dashboard/");
    } else {
        res.render("recover", { display: "", notification: "none", message: "none" });
        // res.render("recover", { message: "test message" })
        // res.sendFile('./recover.html', { root: '/home/auth-server/html/' })
    }
});

router.post('/login', (req, res) => {
    // if (req.body["g-recaptcha-response"] === undefined || req.body["g-recaptcha-response"] === '' || req.body["g-recaptcha-response"] === null) {
    //     res.render("login", { display: "", notification: "error", message: "Can't validate reCAPTCHA. Please try again." });
    //     return
    // }
    // console.log(req.body)
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + catcha_secretKey + "&response=" + req.body["g-recaptcha-response"] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationURL, function(error, response, body) {
        // body = JSON.parse(body);
        // if (body.success !== undefined && !body.success) {
        //     res.render("login", { display: "", notification: "error", message: "Can't validate reCAPTCHA. Please try again." });
        //     return
        // }
        // Insert Login Code Here
        let username = req.body.username;
        let password = req.body.password;
        if (username && password) {
            let tb = {username: username}
            if (re.test(String(username).toLowerCase())) {
                tb = {email: username}
            }
            mysql.makeQuery('SELECT * FROM accounts WHERE ?', tb, function(error, results, fields) {
                if (error) {
                    res.render("register", { display: "", notification: "error", message: "There was an error getting the username" });
                    return
                }
                if (results[0] && results.length > 0) {
                    // console.log(results[0])
                    bcrypt.compare(password, results[0].password)
                        .then(pass => {
                            if (pass) {
                                req.session.loggedin = true;
                                req.session.username = results[0].username;
                                req.session.email = results[0].email;
                                req.session.userId = results[0].id;
                                // console.log("started a new session");
                                // console.log(req.session)
                                // res.redirect('/dashboard/');
                                // res.redirect('/dashboard/?username=' + req.session.username);
                                res.redirect("/dashboard/");
                                // update lastlogin
                                mysql.makeQuery("UPDATE accounts SET last_login = CURRENT_DATE()", {});
                            } else {
                                res.render("login", { display: "", notification: "error", message: "Wrong password" })
                                // res.redirect('/site/login?success=false');
                            }
                        });
                } else {
                    res.render("login", { display: "", notification: "error", message: "User not found" })
                    // res.redirect('/site/login?success=false');
                }
            });
        } else {
            res.render("login", { display: "", notification: "error", message: "Username and password required" })
            // res.redirect('/site/login?success=false');
        }
    });
});

router.post("/register", (req, res) => {
    if (req.body["g-recaptcha-response"] === undefined || req.body["g-recaptcha-response"] === '' || req.body["g-recaptcha-response"] === null) {
        res.render("register", { display: "", notification: "error", message: "Can't validate reCAPTCHA. Please try again." });
        return
    }
    // console.log(req.body)
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + catcha_secretKey + "&response=" + req.body["g-recaptcha-response"] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationURL, function(error, response, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            res.render("register", { display: "", notification: "error", message: "Can't validate reCAPTCHA. Please try again." });
            return
        }
        let username = req.body.username;
        let password = req.body.password;
        let r_password = req.body.r_password;
        let email = req.body.email;
        if (password == r_password) {
            // console.log('password matches')
            // console.log(password.length, username.length)
            if (password.length > 0) {
                if (re.test(String(email).toLowerCase())) {
                    if (username.length > 0) {
                        if (email.length > 0) {
                            // console.log('fields are not empty')
                            // var hpassword = md5.update(password).digest('hex'); 
                            // console.log(hpassword)
                            bcrypt.hash(password, saltRounds)
                                .then(hash => {
                                    mysql.makeQuery("INSERT INTO accounts(`username`, `password`, `email`) VALUES(?, ?, ?)", [username, hash, email], function(error, result, fields) {
                                        if (error) {
                                            res.render("register", { display: "", notification: "error", message: "Email already exists" });
                                            return
                                        }
                                        res.render("register", { display: "", notification: "success", message: "User " + username + " [" + email + "] registered succesfully" });
                                    });
                                    // res.sendFile('./login.html', { root: '/home/auth-server/html/' })
                                    // res.redirect('/site/register?success=true');
                                    // res.cookie('success', true, { maxAge: 8000 });
                                    // res.redirect("/register")
                                    // res.end();
                                    // res.send(`Username: ${username} Password: hidden`);
                                    // console.log(hash);
                                });
                        } else {
                            res.render("register", { display: "", notification: "error", message: "Email field cannot be empty" });
                            // res.render("partial/notification.ejs", { notification: "email", message: "Email field cannot be empty" });
                        }
                    } else {
                        res.render("register", { display: "", notification: "error", message: "Username field cannot be empty" });
                        // res.render("partial/notification.ejs", { notification: "error", message: "Username field cannot be empty" });
                    }
                } else {
                    res.render("register", { display: "", notification: "error", message: "Email not valid" });
                    // res.render("partial/notification.ejs", { notification: "error", message: "Username field cannot be empty" });
                }
            } else {
                res.render("register", { display: "", notification: "error", message: "Password field cannot be empty" });
                // res.render("partial/notification.ejs", { notification: "error", message: "Password field cannot be empty" });
                // res.redirect('/site/register?success=false');
            }
        } else {
            // console.log('should sending false header')
            // res.render("index", { success: false })
            // res.json({ success: false });
            // res.set('success', 'false');
            // res.sendFile('./register.html', { root: '/home/auth-server/html/' })
            // res.set('success', 'false');
            // res.cookie('success', false, { maxAge: 8000 });
            // res.end()
            res.render("register", { display: "", notification: "error", message: "Passwords does not match" });
            // res.render("partial/notification.ejs", { notification: "error", message: "Passwords does not match" });
            // res.redirect('/site/register?success=false');
        }
    });
});

router.post("/recover", (req, res) => {
    let email = req.body.username
    if (email.length > 0) {
        if (re.test(String(email).toLowerCase())) {
            res.render("recover", { display: "", notification: "error", message: "This function is not implemented (yet)" });
        } else {
            res.render("recover", { display: "", notification: "error", message: "Please submit a valid email" });
        }
    } else {
        res.render("recover", { display: "", notification: "error", message: "Please submit a valid email" });
    }
    // res.redirect('/site/recover?success=false');
});

module.exports = router;
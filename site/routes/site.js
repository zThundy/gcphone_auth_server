/* SITE */
const express = require("express");
const bodyParser = require("body-parser");
const MySQLConnection = require("../mysql-class.js");
const getEmail = require("../email.js");
const path = require("path");
const bcrypt = require("bcrypt");
const request = require("request");

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
    host: "ssl0.ovh.net",
    port: "587",
    secureConnection: true,
    auth: {
        user: "registration@phoneauth.it",
        pass: "Anto-13062000"
    }
}));

var mailOptions = {
    from: "registration@phoneauth.it",
    to: "",
    subject: "Confirm your email address",
    html: "there is no content. this is a test email"
};

// import express from 'express'
// import bodyParser from 'body-parser'
// import MySQLConnection from '../mysql-class.js'
// import path from 'path'
// import bcrypt from 'bcrypt'

const saltRounds = 5
const router = express.Router()
const mysql = new MySQLConnection()
const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const catcha_secretKey = "6LfiIjEbAAAAAIAJ_yiRBN08sGO2YjX81y0Noqf8";

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join("./html", 'assets')));

// router.set('view engine', 'pug');
// router.set("views", path.join("/"));

router.get('/login', (req, res) => {
    // console.log(req.session)
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId && req.session.isConfirmed) {
        // res.redirect('/dashboard/');
        if (req.session.isConfirmed == 0) {
            res.render('login', { display: "", notification: "warning", message: "Your accout is not confirmed yet" });
            req.session = null;
        } else {
            res.redirect("/dashboard/");
        }
        // res.redirect('/dashboard/?username=' + req.session.username);
    } else {
        res.render("login", { display: "", notification: "none", message: "none", captcha: res.recaptcha })
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
        if (req.session.isConfirmed == 0) {
            res.render('recover', { display: "", notification: "warning", message: "Your accout is not confirmed yet" });
            req.session = null;
        } else {
            res.redirect("/dashboard/");
        }
    } else {
        res.render("recover", { display: "", notification: "none", message: "none" });
        // res.render("recover", { message: "test message" })
        // res.sendFile('./recover.html', { root: '/home/auth-server/html/' })
    }
});

router.post('/login', (req, res) => {
    // console.log(req.body["g-recaptcha-response"])
    if (req.body["g-recaptcha-response"] === undefined || req.body["g-recaptcha-response"] === '' || req.body["g-recaptcha-response"] === null) {
        // console.log("porimo cant validate")
        res.render("login", { display: "", notification: "error", message: "Can't validate reCAPTCHA. Please try again." });
        return
    }
    // console.log(req.body)
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + catcha_secretKey + "&response=" + req.body["g-recaptcha-response"] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationURL, function(error, response, body) {
        body = JSON.parse(body);
        // console.log(body)
        if (body.success !== undefined && !body.success) {
            // console.log("secondo cant validate")
            res.render("login", { display: "", notification: "error", message: "Can't validate reCAPTCHA. Please try again." });
            return
        }
        let username = req.body.username;
        let password = req.body.password;
        if (username && password) {
            let tb = {username: username}
            if (re.test(String(username).toLowerCase())) {
                // console.log(username)
                tb = {email: username}
            }
            mysql.makeQuery('SELECT * FROM accounts WHERE ?', tb, function(error, results, fields) {
                if (error) {
                    res.render("register", { display: "", notification: "error", message: "There was an error getting the username" });
                    return
                }
                if (results[0] && results.length > 0) {
                    // console.log(results[0])
                    if (bcrypt.compareSync(password, results[0].password)) {
                    // bcrypt.compare(password, results[0].password)
                    //     .then(pass => {
                    //         if (pass) {
                        req.session.loggedin = true;
                        req.session.username = results[0].username;
                        req.session.email = results[0].email;
                        req.session.userId = results[0].id;
                        // console.log(results[0].is_confirmed)
                        req.session.isConfirmed = results[0].is_confirmed;
                        req.session.isBuyer = results[0].is_buyer;
                        req.session.admin = results[0].admin;
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
                        // });
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
                                            res.render("register", { display: "", notification: "error", message: "An username or email addreas already exists." });
                                            return
                                        }
                                        // console.log(result[0].insertId)
                                        mysql.makeQuery("INSERT INTO licenses(account_id) VALUES(?)", [result.insertId], function(err, _, _) {
                                            if (err) throw err;
                                            mysql.makeQuery("INSERT INTO licenses(account_id) VALUES(?)", [result.insertId], function(err, _, _) {
                                                if (err) throw err;

                                                const verification_id = makeid(100)
                                                mailOptions.to = email
                                                mailOptions.html = getEmail(verification_id)
                                                transporter.sendMail(mailOptions, (err, info) => {
                                                    transporter.close();
                                                    if (err) {
                                                        res.render("register", { display: "", notification: "error", message: "There was an error on sending the verification email." });
                                                        // console.log("there was and error", err)
                                                    } else {
                                                        res.render("login", { display: "", notification: "success", message: "A verification email has been sent to you email account." });

                                                        mysql.makeQuery("INSERT INTO registration(account_id, registration_code) VALUES(?, ?)", [result.insertId, verification_id], function(err, result, _) {
                                                            if (err) {
                                                                res.render("register", { display: "", notification: "error", message: "There was an error generating the registration code. Please contant an admin" });
                                                                return
                                                            }
                                                        })
                                                        // console.log("everything went ok!", info)
                                                    }
                                                });
                                            })
                                        })
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

router.get("/c", (req, res) => {
    res.redirect("https://phoneauth.it/")
})

router.get("/c/:value", (req, res) => {
    // console.log("called")
    let query = req.params.value.split(":")[1];
    mysql.makeQuery("SELECT * FROM registration WHERE registration_code = ?", [query], function(err, result, fields) {
        if (result[0]) {
            // res.redirect("/login/")
            // res.render("login", { display: "", notification: "success", message: "Account verified" });
            res.redirect("https://phoneauth.it/")
            mysql.makeQuery("UPDATE accounts SET is_confirmed = ? WHERE id = ?", [1, result[0].account_id])
            mysql.makeQuery("DELETE FROM registration WHERE id = ?", [result[0].id])
        } else {
            // res.redirect("/login/")
            // res.render("login", { display: "", notification: "error", message: "Cannot verify account" });
            res.redirect("https://phoneauth.it/")
        }
        res.end()
    });
    // console.log(query)
});

router.post("/recover", (req, res) => {
    let email = req.body.username
    if (email.length > 0) {
        if (re.test(String(email).toLowerCase())) {
            res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            // res.render("recover", { display: "", notification: "error", message: "This function is not implemented (yet)" });
        } else {
            res.render("recover", { display: "", notification: "error", message: "Please submit a valid email" });
        }
    } else {
        res.render("recover", { display: "", notification: "error", message: "Please submit a valid email" });
    }
    // res.redirect('/site/recover?success=false');
});

/*
mysql.makeQuery("SELECT * FROM accounts", {}, (err, result) => {
    for (var i in result) {
        let email = result[i].email
        let account_id = result[i].id
        const verification_id = makeid(100)
        mailOptions.to = email
        mailOptions.html = getEmail(verification_id)
        transporter.sendMail(mailOptions, (err, info) => {
            transporter.close();
            if (err) {
                console.log("there was and error", err)
            } else {
                console.log("email ok", info)

                mysql.makeQuery("INSERT INTO registration(account_id, registration_code) VALUES(?, ?)", [account_id, verification_id], function(err, result, _) {
                    if (err) {
                        console.log(err)
                        return
                    }
                })
            }
        });
    }
})
*/

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

module.exports = router;
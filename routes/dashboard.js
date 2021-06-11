/* SITE */
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const MySQLConnection = require("../mysql-class.js")
// import express from 'express'
// import bodyParser from 'body-parser'
// import path from 'path'

const router = express.Router()
const mysql = new MySQLConnection()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join("./html", 'assets')));
// router.set("views", "./dashboard")

router.get('/', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        // console.log(req.session.username, req.query.username)
        res.render('home', { username: req.session.username, email: req.session.email })
    } else {
        res.redirect('/site/login')
    }
})

router.get('/licenses', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        // console.log(req.session.username, req.query.username)
        mysql.makeQuery('SELECT * FROM accounts WHERE ?', { id: req.session.userId }, function(error, results, fields) {
            if (error) {
                res.render("login", { display: "", notification: "error", message: "There was an error restoring the session" });
                req.session = null;
                return
            }
            res.render('licenses', { username: req.session.username, email: req.session.email });
        });
    } else {
        res.redirect('/site/login')
    }
});

router.get('/account', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        // console.log(req.session.username, req.query.username)
        res.render('account', { username: req.session.username, email: req.session.email })
    } else {
        res.redirect('/site/login')
    }
});

router.get('/dashboard', (req, res) => {
})

router.post('/sidebar', (req, res) => {
    // console.log(req.body.logout)
    // console.log(req.body.action)
    if (req.body.action == "logout" && req.session) {
        req.session = null
        // res.redirect("/site/login")
        res.render("login", { display: "", notification: "success", message: "Logged out from the dashboard" });
    }
    if (req.body.action == "delete" && req.session) {
        mysql.makeQuery("DELETE FROM accounts WHERE id = ?", [req.session.userId], function(error, results, fields) {
            req.session = null
            if (error) {
                res.render("login", { display: "", notification: "error", message: "Unable to delete account, Logging you out" });
                return
            }
            res.render("login", { display: "", notification: "success", message: "Account successfully deleted" });
        })
    }
    // console.log('logout')
});

router.post("/register", (req, res) => {
});

module.exports = router;
/* SITE */
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
// import express from 'express'
// import bodyParser from 'body-parser'
// import path from 'path'

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join("./html", 'assets')));
// router.set("views", "./dashboard")

router.get('/', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email) {
        // console.log(req.session.username, req.query.username)
        res.render('home', { username: req.session.username, email: req.session.email })
    } else {
        res.redirect('/site/login')
    }
})

router.get('/licenses', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email) {
        // console.log(req.session.username, req.query.username)
        res.render('licenses', { username: req.session.username, email: req.session.email })
    } else {
        res.redirect('/site/login')
    }
});

router.get('/account', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email) {
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
        res.redirect("/site/login")
    }
    // console.log('logout')
});

router.post("/register", (req, res) => {
});

module.exports = router;
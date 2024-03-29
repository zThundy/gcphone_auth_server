/* SITE */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const MySQLConnection = require("../mysql-class.js");
// import express from 'express'
// import bodyParser from 'body-parser'
// import path from 'path'

const router = express.Router()
const mysql = new MySQLConnection()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join("./html", 'assets')));
const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;  
// router.set("views", "./dashboard")

router.get('/', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        // console.log(req.session.username, req.query.username)
        if (req.session.isConfirmed == 0) {
            res.render('login', { display: "", notification: "warning", message: "Your accout is not confirmed yet" });
            req.session = null;
        } else {
            res.render('home', {
                account: {
                    confirmed: req.session.isBuyer || req.session.admin,
                    username: req.session.username,
                    email: req.session.email,
                    admin: req.session.admin
                }, notification: "none", message: "none" }
            );
        }
    } else {
        res.render('login', { display: "", notification: "warning", message: "The session expired" });
        // res.redirect('/site/login')
    }
})

router.get('/licenses', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        // console.log(req.session.username, req.query.username)
        if (req.session.isConfirmed == 0) {
            res.render('login', { display: "", notification: "warning", message: "Your accout is not confirmed yet" });
            req.session = null;
        } else {
            mysql.makeQuery('SELECT * FROM accounts WHERE ?', { id: req.session.userId }, function(error, _, _) {
                if (error) {
                    res.render("login", { display: "", notification: "error", message: "There was an error restoring the session" });
                    req.session = null;
                    return
                }
                // console.log("sono qui :)")
                mysql.makeQuery("SELECT * FROM licenses WHERE ?", { account_id: req.session.userId }, function(error, results, _) {
                    if (error) {
                        // notifica di errore da fare per questa pagina
                        return
                    }
                    // let licenses = []
                    // for (var i in results) {
                    //     licenses.push({
                    //         id: results[i].id,
                    //         account_id: results[i].account_id,
                    //         ip: results[i].id,
                    //         license: results[i].license,
                    //         last_update: results[i].last_update
                    //     })
                    // }
                    // console.log(account)
                    req.session.licenses = results
                    res.render('licenses', {
                        account: {
                            confirmed: req.session.isBuyer || req.session.admin,
                            username: req.session.username,
                            email: req.session.email,
                            licenses: results,
                            admin: req.session.admin
                        }, notification: "none", message: "none" }
                    );
                })
            });
        }
    } else {
        res.render('login', { display: "", notification: "warning", message: "The session expired" });
        // res.redirect('/site/login')
    }
});

router.get('/account', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        // console.log(req.session.username, req.query.username)
        if (req.session.isConfirmed == 0) {
            res.render('login', { display: "", notification: "warning", message: "Your accout is not confirmed yet" });
            req.session = null;
        } else {
            res.render('account', {
                account: {
                    username: req.session.username,
                    email: req.session.email,
                    admin: req.session.admin
                }, notification: "none", message: "none" }
            );
        }
    } else {
        res.render('login', { display: "", notification: "warning", message: "The session expired" });
        // res.redirect('/site/login')
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
        mysql.makeQuery("DELETE FROM accounts WHERE ?", { id: req.session.userId }, function(error, results, fields) {
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

router.post("/change_license:value", (req, res) => {
    // console.log(req.params.value)
    // console.log(id)
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        if (req.session.isConfirmed == 0) {
            res.render('login', { display: "", notification: "warning", message: "Your accout is not confirmed yet" });
            req.session = null;
        } else {
            let id = req.params.value.split(":")[1];
            if (req.session.licenses && req.session.licenses[id]) {
                let query_id = req.session.licenses[id].id;
                let new_ip = req.body["ip_" + id];
                if (new_ip.match(ipformat)) {
                    // mysql.makeQuery("UPDATE licenses SET ip = ? WHERE id = ?", [new_ip, query_id])
                    mysql.makeQuery("INSERT INTO pending_requests(`index`, `old_ip`, `new_ip`, `account_id`) VALUES(?, ?, ?, ?)", [query_id, req.session.licenses[id].ip, new_ip, req.session.userId])
                    // req.session.licenses[id].ip = new_ip;
                    res.render('licenses', {
                        account: {
                            confirmed: req.session.isBuyer || req.session.admin,
                            username: req.session.username,
                            email: req.session.email,
                            licenses: req.session.licenses,
                            admin: req.session.admin
                        }, notification: "success", message: "IP change has been requested to the admins!" }
                    );
                } else {
                    res.render('licenses', {
                        account: {
                            confirmed: req.session.isBuyer || req.session.admin,
                            username: req.session.username,
                            email: req.session.email,
                            licenses: req.session.licenses,
                            admin: req.session.admin
                        }, notification: "error", message: "Plase type a valid ip address" }
                    );
                    // res.redirect("/dashboard")
                }
            } else {
                res.render('licenses', {
                    account: {
                        confirmed: req.session.isBuyer || req.session.admin,
                        username: req.session.username,
                        email: req.session.email,
                        licenses: req.session.licenses,
                        admin: req.session.admin
                    }, notification: "error", message: "There was an error on updating this entry. Please try again" }
                );
                // res.redirect("/dashboard")
            }
        }
    } else {
        res.render('login', { display: "", notification: "warning", message: "The session expired" });
        // res.redirect('/site/login')
    }
})

router.post("/regen_license", (req, res) => {
    var newLicense = makeid(40);
    let errored = false
    let date = new Date()
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        if (req.session.isConfirmed == 0) {
            res.render('login', { display: "", notification: "warning", message: "Your accout is not confirmed yet" });
            req.session = null;
        } else {
            if (req.session.licenses) {
                for (var i in req.session.licenses) {
                    let license = req.session.licenses[i];
                    // console.log(license)
                    if (license) {
                        let license_date = new Date(license.last_update)
                        let s_diff = (date - license_date) / 1000
                        if (s_diff > 86400) {
                            license.license = newLicense;
                            license.last_update = new Date();
                            req.session.licenses[i] = license;
                            // console.log("i'm here!")
                            mysql.makeQuery("UPDATE licenses SET license = ?, last_update = CURRENT_TIME() WHERE id = ?", [license.license, license.id], function(err, _, _) {
                                if (err && !errored) {
                                    // console.log(err)
                                    res.render('licenses', {
                                        account: {
                                            confirmed: req.session.isBuyer || req.session.admin,
                                            username: req.session.username,
                                            email: req.session.email,
                                            licenses: req.session.licenses,
                                            admin: req.session.admin
                                        }, notification: "error", message: "There was an error on updating your license. Please try again" }
                                    );
                                    // console.log("i'm here in error!")
                                    errored = true
                                    return
                                }
                            });

                            if (errored) { return }
                        } else {
                            res.render('licenses', {
                                account: {
                                    confirmed: req.session.isBuyer || req.session.admin,
                                    username: req.session.username,
                                    email: req.session.email,
                                    licenses: req.session.licenses,
                                    admin: req.session.admin
                                }, notification: "error", message: "Please wait a day to regenerate your license key" }
                            );
                            return
                        }
                    } else {
                        // console.log("license does not exists")
                        res.render('licenses', {
                            account: {
                                confirmed: req.session.isBuyer || req.session.admin,
                                username: req.session.username,
                                email: req.session.email,
                                licenses: req.session.licenses,
                                admin: req.session.admin
                            }, notification: "error", message: "There was an error on updating your license. Please try again" }
                        );
                        return
                    }
                }
                // console.log("sending sucess :)")
                res.render('licenses', {
                    account: {
                        confirmed: req.session.isBuyer || req.session.admin,
                        username: req.session.username,
                        email: req.session.email,
                        licenses: req.session.licenses,
                        admin: req.session.admin
                    }, notification: "success", message: "Licenses updated successfully"
                });
                // console.log("success sent")
            } else {
                res.render('licenses', {
                    account: {
                        confirmed: req.session.isBuyer || req.session.admin,
                        username: req.session.username,
                        email: req.session.email,
                        licenses: req.session.licenses,
                        admin: req.session.admin
                    }, notification: "error", message: "There was an error on updating your license. Please try again" }
                );
                // res.redirect("/dashboard")
            }
        }
    } else {
        res.render('login', { display: "", notification: "warning", message: "The session expired" });
        // res.redirect('/site/login')
    }
})

router.post("/account/update_account", (req, res) => {

})

router.get("/admin", (req, res) => {
    if (req.session && req.session.loggedin && req.session.username && req.session.email && req.session.userId) {
        if (req.session.isConfirmed == 0) {
            res.render('login', { display: "", notification: "warning", message: "Your accout is not confirmed yet" });
            req.session = null;
        } else {
            mysql.makeQuery("SELECT * FROM pending_requests", {}, function(err, result, _) {
                if (err) {
                    res.render('admin', {
                        account: {
                            confirmed: req.session.isBuyer || req.session.admin,
                            username: req.session.username,
                            email: req.session.email,
                            admin: req.session.admin
                        }, notification: "error", message: "There was an error getting the requests" }
                    );
                    return
                }
                res.render('admin', {
                    account: {
                        confirmed: req.session.isBuyer || req.session.admin,
                        username: req.session.username,
                        email: req.session.email,
                        admin: req.session.admin,
                        requests: result
                    }, notification: "none", message: "none" }
                );
            });
        }
    } else {
        res.render('login', { display: "", notification: "warning", message: "The session expired" });
    }
})

router.post("/accept_request:value", (req, res) => {
    // console.log("cazzi miei")
    // console.log(req.params)
    // console.log(req.body)
    let id = req.params.value.split(":")[1]
    if (req.body.button_value == "accept") {
        // console.log(req.body["old_ip_" + id], req.body["new_ip_" + id])
        mysql.makeQuery("DELETE FROM pending_requests WHERE old_ip = ? AND new_ip = ?", [req.body["old_ip_" + id], req.body["new_ip_" + id]], function(err, result, _) {
            if (err) throw err;
            // console.log("ok")
            mysql.makeQuery("UPDATE licenses SET ip = ? WHERE id = ?", [req.body["new_ip_" + id], req.body["index_" + id]], function(_, _, _) {
                if (err) throw err;
                res.redirect("https://phoneauth.it/dashboard/admin")
                // console.log("ok 2")
            })
        })
    }
    if (req.body.button_value == "deny") {
        mysql.makeQuery("DELETE FROM pending_requests WHERE old_ip = ? AND new_ip = ?", [req.body["old_ip_" + id], req.body["new_ip_" + id]], function(err, result, _) {
            if (err) throw err;
        // console.log("ok")
            res.redirect("https://phoneauth.it/dashboard/admin")
            // console.log("ok 2")
        })
    }
    // console.log(req)
})

router.get("/button_press/:variable", (req, res) => {
    // console.log("ok man")
    // console.log("got post")
    // console.log(req)
    // console.log(req.params)
    if (req.params) {
        // console.log(req.body)
        if (req.params.variable == ":licenses") {
            // console.log('rerender recover')
            // res.redirect("./site/recover")
            // res.send("Loading")
            // res.render("recover", { display: "none", notification: "none", message: "none" });
            // res.sendFile('./recover.ejs', { root: '/home/auth-server/views/' })
            res.json({ display: "none" })
        }
    }
    // console.log('got get')
});

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// UPDATE liceses SET `ip` = '12.12.12.12', `id` = '1' WHERE ?

module.exports = router;
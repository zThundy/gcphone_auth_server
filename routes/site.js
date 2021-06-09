/* SITE */
import express from 'express'
import bodyParser from 'body-parser'
import MySQLConnection from '../mysql-class.js'
import path from 'path'
import bcrypt from 'bcrypt'

const saltRounds = 15
const router = express.Router()
const mysql = new MySQLConnection()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join("./html", 'assets')));
// router.set('view engine', 'pug');
// router.set("views", path.join("/"));

router.get('/login', (req, res) => {
    // console.log(req.session)
    if (req.session && req.session.loggedin && req.session.username) {
        // res.redirect('/dashboard/');
        res.render("dashboard", { })
        // res.redirect('/dashboard/?username=' + req.session.username);
    } else {
        res.render("login", { notification: "none", message: "none" })
        // res.sendFile('./login.html', { root: '/home/auth-server/html/' })
    }
});

router.post("/button_press/register", (req, res) => {
    console.log("got post")
    res.render("partial/notification.ejs", { notification: "none", message: "none" });
});

router.get('/register', (req, res) => {
    // console.log(req.session)
    res.render("register", { notification: "none", message: "none" });
    // res.sendFile('./register.html', { root: '/home/auth-server/html/' })
});

router.get('/recover', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username) {
        // res.redirect('/dashboard/');
        res.render("dashboard", { })
        // res.redirect('/dashboard/?username=' + req.session.username);
    } else {
        res.render("recover", { message: "test message" })
        // res.sendFile('./recover.html', { root: '/home/auth-server/html/' })
    }
});

router.post('/login', (req, res) => {
    // Insert Login Code Here
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        mysql.makeQuery('SELECT * FROM accounts WHERE ?', {username: username}, function(error, results, fields) {
            if (results[0] && results.length > 0) {
                // console.log(results[0])
                bcrypt.compare(password, results[0].password)
                    .then(pass => {
                        if (pass) {
                            req.session.loggedin = true;
                            req.session.username = username;
                            // console.log("started a new session");
                            // console.log(req.session)
                            // res.redirect('/dashboard/');
                            res.redirect('/dashboard/?username=' + req.session.username);
                        } else {
                            res.redirect('/site/login?success=false');
                        }
                    });
            } else {
                res.redirect('/site/login?success=false');
            }
        });
	} else {
        res.redirect('/site/login?success=false');
	}
});

router.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let r_password = req.body.r_password;
    let email = req.body.email;
    if (password == r_password) {
        // console.log('password matches')
        // console.log(password.length, username.length)
        if (password.length > 0) {
            if (username.length > 0) {
                if (email.length > 0) {
                    // console.log('fields are not empty')
                    // var hpassword = md5.update(password).digest('hex'); 
                    // console.log(hpassword)
                    bcrypt.hash(password, saltRounds)
                        .then(hash => {
                            mysql.makeQuery("INSERT INTO accounts(`username`, `password`) VALUES(?, ?)", [username, hash]);
                            // res.sendFile('./login.html', { root: '/home/auth-server/html/' })
                            res.redirect('/site/register?success=true');
                            // res.cookie('success', true, { maxAge: 8000 });
                            // res.redirect("/register")
                            // res.end();
                            // res.send(`Username: ${username} Password: hidden`);
                            // console.log(hash);
                        });
                } else {
                    res.render("register", { notification: "error", message: "Email field cannot be empty" })
                }
            } else {
                res.render("register", { notification: "error", message: "Username field cannot be empty" })
            }
        } else {
            res.render("register", { notification: "error", message: "Password field cannot be empty" })
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
        res.render("register", { notification: "error", message: "Passwords does not match" })
        // res.redirect('/site/register?success=false');
    }
});

router.post("/recover", (req, res) => {
    res.redirect('/site/recover?success=false');
});

export default router
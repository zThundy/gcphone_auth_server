/* SITE */
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join("./html", 'assets')));

router.get('/', (req, res) => {
    if (req.session && req.session.loggedin && req.session.username) {
        // console.log(req.session.username, req.query.username)
        if (req.session.username != req.query.username) {
            req.session = null
            res.redirect("/site/login")
        } else {
            res.sendFile('./home.html', { root: '/home/auth-server/html/dashboard' })
        }
    } else {
        res.redirect('/site/login')
    }
})

router.get('/login', (req, res) => {
});

router.get('/register', (req, res) => {
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

export default router
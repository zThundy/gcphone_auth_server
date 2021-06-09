/* SITE */
import express from 'express'
import bodyParser from 'body-parser'
import MySQLConnection from './mysql-class.js'
import path from 'path'

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join("./html", 'assets')));

router.get('/', (req, res) => {
    // if (req.session.loggedin) {
    res.sendFile('./home.html', { root: '/home/auth-server/html/dashboard' })
    // } else {
    //     res.redirect('/site/login')
    // }
    res.end();
})

router.get('/login', (req, res) => {
});

router.get('/register', (req, res) => {
});

router.get('/dashboard',
)

router.post('/login', (req, res) => {
});

router.post("/register", (req, res) => {
})

export default router
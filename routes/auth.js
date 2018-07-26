const express = require('express')
const route = express.Router()
const session = require('express-session')
const bodyParser = require('body-parser')
const sha256 = require('sha256')
const salt = 'efef$%#^#'
const FileStore = require('session-file-store')(session)


const user = {
    username: 'byhoson',
    password: sha256('111' + salt)
}

route.use(bodyParser.urlencoded({ extended: false }))

route.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}))

route.get('/', (req, res) => {
    res.render('auth.ejs')
})

route.post('/', (req, res) => {
    const uname = req.body.username
    const pw = sha256(req.body.password + salt)
    if (uname == user.username && pw == user.password) req.session.signed_in = true
    res.redirect('/')
})



route.get('/signout', (req, res) => {
    //console.log(req.session)
    delete req.session.signed_in
    res.redirect('/')
})



route.get('/signup', (req, res) => {
    res.render('signup.ejs')
})

route.post('/signup', (req, res) => {
    res.send('sign up done!')
})



module.exports = route
const express = require('express')
const route = express.Router()
const session = require('express-session')
const bodyParser = require('body-parser')
const sha256 = require('sha256')
const salt = 'efef$%#^#'
const FileStore = require('session-file-store')(session)
const MongoClient = require('mongodb').MongoClient
const dbpw = require('../db').pw

let db

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

MongoClient.connect(`mongodb://user1:${dbpw}@ds137601.mlab.com:37601/wut2do`, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('wut2do')
})

route.get('/', (req, res) => {
    res.render('auth.ejs')
})

route.post('/', (req, res) => {
    const uname = req.body.username
    const pw = sha256(req.body.password + salt)
    db.collection('users').findOne({ username: uname }, (err, result) => {
        if (err) return console.log(err)
        if (uname == result.username && pw == result.password) req.session.signed_in = true
        res.redirect('/')
    })

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
    const uname = req.body.username
    const pw = sha256(req.body.password + salt)
    const pw2 = sha256(req.body.password2 + salt)

    db.collection('users').findOne({ username: uname }, (err, result) => {
        if (err) return console.log(err)
        if (!result && pw == pw2) {
            db.collection('users').insertOne({ username: uname, password: pw }, (err, result) => {
                if (err) return console.log(err)
                res.send('sign up done!')
            })
        } else res.send('Do it again!')
    })
})



module.exports = route
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const pw = require('./db').pw

let db

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs')

MongoClient.connect(`mongodb://user1:${pw}@ds137601.mlab.com:37601/wut2do`, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('wut2do')

    app.listen(process.env.PORT || 3000, () => {
        console.log('server listening..')
    })
})

/*
db.collection('todos').insertOne({ test: 'hello' }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
        })
*/


app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/add', (req, res) => {
    res.render('index', { what: req.body.what })
})
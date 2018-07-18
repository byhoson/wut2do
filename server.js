const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId;
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
    db.collection('todos').find().toArray((err, todos) => {
        if (err) return console.log(err)
        //console.log(todos)
        res.render('index.ejs', { todos: todos })
    })
})

app.get('/todo/:_id', (req, res) => {

    let _id = req.params._id
    db.collection('todos').findOne({ _id: ObjectId(_id) }, (err, todo) => {
        if (err) return console.log(err)
        console.log("success!")
    })

    res.send(_id)


})

app.post('/add', (req, res) => {
    db.collection('todos').insertOne({
        what: req.body.what,
        due: req.body.due,
        des: req.body.des,
        done: 0
    }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
    })
    //console.log(req.body)
    res.redirect('/')
})
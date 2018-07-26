const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId;
const pw = require('./db').pw
const session = require('express-session')
const auth = require('./routes/auth')
const FileStore = require('session-file-store')(session)

let db

app.use('/auth', auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}))

MongoClient.connect(`mongodb://user1:${pw}@ds137601.mlab.com:37601/wut2do`, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('wut2do')

    app.listen(process.env.PORT || 3000, () => {
        console.log('server listening..')
    })
})

app.get('/', (req, res) => {
    db.collection('todos').find().toArray((err, todos) => {
        if (err) return console.log(err)
        //console.log(req.session.greeting)
        res.render('index.ejs', { todos: todos, signed_in: req.session.signed_in })
    })
})

app.get('/todo/:_id', (req, res) => {

    const _id = req.params._id
    db.collection('todos').findOne({ _id: ObjectId(_id) }, (err, todo) => {
        if (err) return console.log(err)
        res.render('detail.ejs', {
            what: todo.what,
            due: todo.due,
            des: todo.des,
            _id: _id
        })
    })


})

app.post('/done/:_id', (req, res) => {
    const _id = req.params._id

    db.collection('todos').updateOne(
        { _id: ObjectId(_id) },
        {
            $set: {
                done: 1
            }
        },
        (err, result) => {
            if (err) return console.log(err)
            console.log("updated done")

        }
    )
    res.redirect('/')
})

app.post('/undone/:_id', (req, res) => {
    const _id = req.params._id

    db.collection('todos').updateOne(
        { _id: ObjectId(_id) },
        {
            $set: {
                done: 0
            }
        },
        (err, result) => {
            if (err) return console.log(err)
            console.log("updated done")

        }
    )
    res.redirect('/')
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
    res.redirect('/')
})

app.post('/update/:_id', (req, res) => {
    const _id = req.params._id

    db.collection('todos').updateOne(
        { _id: ObjectId(_id) },
        {
            $set: {
                due: req.body.due,
                des: req.body.des
            }
        },
        (err, result) => {
            if (err) return console.log(err)
            //console.log(result)
        }
    )
    res.redirect(`/todo/${_id}`)
})

app.post('/delete/:_id', (req, res) => {
    const _id = req.params._id

    db.collection('todos').findOneAndDelete({ _id: ObjectId(_id) }, (err, result) => {
        if (err) return console.log(err)
        console.log('deleted')
    })

    res.redirect(`/`)
})

app.post('/empty', (req, res) => {
    db.collection('todos').deleteMany({ done: 1 }, (err, result) => {
        if (err) return console.log(err)
        console.log("deleted")
        res.redirect('/')
    })
})
const express = require('express')
const route = express.Router()

route.get('/', (req, res) => {
    db.collection('todos').find().toArray((err, todos) => {
        if (err) return console.log(err)
        //console.log(todos)
        res.render('index.ejs', { todos: todos })
    })
})

module.exports = route
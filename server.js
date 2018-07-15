const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.listen(3000, () => {
    console.log('server listening..')
})

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/add', (req, res) => {
    res.render('index', { what: req.body.what })
    //console.log(req.body.what)
    //res.redirect('/')
})
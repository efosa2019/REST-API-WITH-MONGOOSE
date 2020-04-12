const express = require('express')
const bodyParser = require('body-parser')
var mongoose = require('mongoose')
const logger = require('morgan')
const error = require('errorhandler')

let app = express()

app.use(logger('dev'))
app.use(bodyParser.json())

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/bank')

const Accounts = mongoose.model(
  'Accounts', //uppercase is model , lower case is the object
  { name: String, balance: Number, age: String, location: String }
)

let accounts = new Accounts({
  name: 'Mike Ross',
  balance: 5500,
  age: '50',
  location: 'Texas',
})

accounts.save(function (error) {
  if (error) {
    console.log(error)
  } else {
    console.log('The post is saved: ', accounts.toJSON())
  }
})

app.get('/accounts', (req, res) => {
  Accounts.find({}, function (err, accounts) {
    var userMap = {}

    accounts.forEach(function (user) {
      userMap[user._id] = user
    })

    res.send(userMap)
  })
})

app.post('/accounts', (req, res) => {
  var account = new Accounts(req.body)

  account.save(function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('The post is saved: ', accounts.toJSON())
      res.send('Post is ok')
    }
  })
})

app.put('/accounts/:id', (req, res) => {
  Accounts.findByIdAndUpdate(
    req.params.id,
    req.body,

    function (error, results) {
      if (error) {
        console.log('there is an error')
      } else {
        console.log('The account was updates:', accounts.toJSON())
        res.send('Put is ok')
      }
    }
  )
})

app.delete('/accounts/:id', (req, res) => {
  Accounts.findByIdAndRemove(
    req.params.id,

    function (error, results) {
      if (error) {
        console.log('there is an error')
      } else {
        console.log('The account was updates:', accounts.toJSON())
        res.send('DELETED!')
      }
    }
  )
  app.use(errorhandler())
})

app.listen(3000)

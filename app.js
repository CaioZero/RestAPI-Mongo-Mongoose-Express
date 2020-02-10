var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
/**Edit just for Git */
/**Morgan it's for logger that appers into cmd */
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var dishRouter = require('./routes/dishRouter')
var promoRouter = require('./routes/promoRouter')
var leaderRouter = require('./routes/leaderRouter')

/**Importing mongoose module */
const mongoose = require('mongoose');

/**Import model of dishes */
const Dishes = require(`./models/dishes`)

/**Setting the connection */
const port = 27017
const hostname = 'localhost'
const dbName = `conFusion`
const url = `mongodb://${hostname}:${port}/${dbName}`

/**Connecting to mongoDB */
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

connect.then((db) => {
  console.log(`Connected correctly to the server`)
}, (err) => {
  console.log(err)
})



var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
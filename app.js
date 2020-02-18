var createError = require('http-errors')
var express = require('express')
var path = require('path')

/**Cookie parser to use cookies */
var cookieParser = require('cookie-parser')


/**Morgan it's for logger that appers into cmd */
var logger = require('morgan')

var session = require('express-session')
var FileStore = require('session-file-store')(session)

var passport = require('passport')
var authenticate = require('./authenticate')
var config = require('./config')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var dishRouter = require('./routes/dishRouter')
var promoRouter = require('./routes/promoRouter')
var leaderRouter = require('./routes/leaderRouter')

/**Importing mongoose module */
const mongoose = require('mongoose');

/**Import model of dishes, promotions and leaders */
const Dishes = require(`./models/dishes`)
const Promo = require('./models/promo')
const Leader = require('./models/leader')



/**The url comes from the config.js file */
const url = config.mongoUrl

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


/**to log in with passport */
app.use(passport.initialize())


app.use('/', indexRouter)
app.use('/users', usersRouter)


/**Need to add an authentication badge to the client only acess before a login */
app.use(express.static(path.join(__dirname, 'public')))

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
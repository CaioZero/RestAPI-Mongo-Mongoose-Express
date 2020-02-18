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

/**Using secret key to parser a cookie */
//app.use(cookieParser(`12345-67890-09876-54321`))

/**Session created for cookies */
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()

}))

/**to log in with passport */
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/users', usersRouter)

/**Putting a client firt need authorization to do something */
function auth(req, res, next) {
  /**This conditional means that if the user does not have a signedCookie, in other way,
   * he does not have permission to login or property on it*/
  if (!req.user) {
    /**So we look for the authorization */
    /**If authHeader does not exists (the user it's not logged) */
    var err = new Error('You are not authenticated!')
    err.status = 403
    return next(err)
  }
  /**If the user already have a signed cookie,if its valid and if contais the user property */
  else {
    next()
  }
}

app.use(auth);

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
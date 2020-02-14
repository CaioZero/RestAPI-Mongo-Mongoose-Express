var express = require('express');

const bodyParser = require('body-parser')
var User = require('../models/user')

var router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('Users Page');
});

/**Endpoint for sign up new users
 * /**To Signup, you will need to submit an information, that's why its used the posy */

router.post('/signup', (req, res, next) => {
  /**First, you need to check if has any user with the same username */
  User.findOne({
      username: req.body.username
    })
    .then((user) => {
      /**If the user already exists */
      if (user) {
        var err = new Error(`User ${req.body.username} already exists`)
        err.status = 403
        next(err)
      }
      /**If the user does not exists, you can create him */
      else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        })
      }
    })
    /**If the user have been created, then... */
    .then((user) => {
      res.statusCode = 200
      res.setHeader('Content-type', 'application/json')
      res.json({
        status: 'Registration Sucessful',
        user: user
      })
    }, (err) => next(err))
    .catch((err) => next(err))
})

/**To login, you will need to submit an information, that's why its used the posy */
router.post('/login', (req, res, next) => {
  /**This conditional means that if the user does not have permission to login or property on it */
  if (!req.session.user) {
    /**So we look for the authorization */
    var authHeader = req.headers.authorization

    /**If authHeader does not exists (the user it's not logged) */
    if (!authHeader) {
      var err = new Error('You are not authenticated!')
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      next(err)
      return
    }
    /**This var will receive two strings, separated by a collon, that will extract the user and the password */
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    var userLog = auth[0]
    var passLog = auth[1]

    /**To find the username into database */
    User.findOne({username:userLog})
      .then((user) => {
        /**IF the user it's null, in other words, you cant find this user */
        if (!user) {
          var err = new Error(`User ${userLog} does not exists`)
          err.status = 403 /**USername does not exists HTTP protocol*/
          return next(err)
        }
        /**The user exists, but the password its incorrect */
        else if (user.password !== passLog) {
          var err = new Error(`Your password it's incorrect`)
          err.status = 403 /**USername does not exists HTTP protocol*/
          return next(err)
        }
        /**When the username and the password are correct */
        else if (user.username === userLog && user.password === passLog) {
          req.session.user = 'authenticated'
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end('YOu are authenticated')
        }
      })
      .catch((err) => next(err))
  }
  else{
    res.statusCode = 200
    res.setHeader('Content-type','text/plain')
    res.end(`You are already authenticated`)
  }
})

/**To logout, you will not need to submit an information, that's why its used the Get */
router.get('/logout',(req,res,next)=>{
  /**If the session exists */
  if(req.session){
    /**Destroy current session  */
    req.session.destroy()

    /**Removing the cookie of the session from the client side */
    res.clearCookie('session-id')

    /**Redirecting to the homepage */
    res.redirect('/')
  }
  /**If the session does not exists */
  else{
    var err = new Error ('You are not logged in')
    err.statusCode = 403
    next(err)
  }
})

module.exports = router;
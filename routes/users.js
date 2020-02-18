var express = require('express');

const bodyParser = require('body-parser')
var User = require('../models/user')

var passport = require('passport')

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
  User.register(new User({
      username: req.body.username
    }),
    req.body.password, (err, user) => {
      /**If the user isnt registered */
      if (err) {
        res.statusCode = 500
        res.setHeader('Content-type', 'application/json')
        res.json({
          err: err
        })
      }
      /**If its ok*/
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200
          res.setHeader('Content-type', 'application/json')
          res.json({sucess:true, status: 'Registration Sucessful'})
        })
      }
    })
})

/**To login, you will need to submit an information, that's why its used the post 
 * if you get any error during the authenticate, it will return an error 
*/
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.statusCode = 200
  res.setHeader('Content-type', 'application/json')
  res.json({sucess:true, status: 'You are sucessfully logged in'})
})

/**To logout, you will not need to submit an information, that's why its used the Get */
router.get('/logout', (req, res, next) => {
  /**If the session exists */
  if (req.session) {
    /**Destroy current session  */
    req.session.destroy()

    /**Removing the cookie of the session from the client side */
    res.clearCookie('session-id')

    /**Redirecting to the homepage */
    res.redirect('/')
  }
  /**If the session does not exists */
  else {
    var err = new Error('You are not logged in')
    err.statusCode = 403
    next(err)
  }
})

module.exports = router;
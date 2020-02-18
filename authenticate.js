var passport = require(`passport`)
var LocalStrategy = require(`passport-local`).Strategy
var User = require(`./models/user`)

/**To provide a JSON Web Token for configuring passport module*/
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

/**Importing config js file */
var config = require('./config')

/**Configuring passport to authenticate an user */
exports.local = passport.use(new LocalStrategy(User.authenticate()))
/**We use serialize and serialize to support sessions */
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

/**Creating a token and getting for us */
exports.getToken = function (user) {
    /**Getting the user, the secretKey from config file 
     * expires in means that the json web token will expire in 1 hour or 3600 sec
     */
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    })
}

/**How it comes the information from Json Web Token */
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log(`JWT Payload ${jwt_payload}`)
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                /**If you get an error */
                return done(err, false)
            } else if (user) {
                /**There's no error, and the second parameter it's the user */
                return done(null, user)
            } else {
                /**Didn't find any user */
                return (null, false)
            }
        })
    }))

/**Pass the parameter and if you are using sessions */
exports.verifyUser = passport.authenticate('jwt', {
    session: false
})
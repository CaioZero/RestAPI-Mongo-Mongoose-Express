var passport = require(`passport`)
var LocalStrategy = require(`passport-local`).Strategy
var User = require(`./models/user`)

/**Configuring passport to authenticate an user */

exports.local = passport.use(new LocalStrategy(User.authenticate()))
/**We use serialize and serialize to support sessions */
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
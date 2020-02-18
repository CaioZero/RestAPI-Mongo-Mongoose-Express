const mongoose = require(`mongoose`)
const Schema = mongoose.Schema
/**For passport for user and password*/
const passportLocalMongoose = require(`passport-local-mongoose`)

/**Creating a new User to log into the system */
var User = new Schema({
     /**Admin its for  dinstinghuish for a normal user to an admin*/
    admin: {
        type:Boolean,
        default:false
    }
})

/**Using plugin passport */
User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User',User)


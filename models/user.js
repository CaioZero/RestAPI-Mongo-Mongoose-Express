const mongoose = require(`mongoose`)
const Schema = mongoose.Schema

/**Creating a new User to log into the system */
var User = new Schema({
    username:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    /**Admin its for  dinstinghuish for a normal user to an admin*/
    admin: {
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('User',User)


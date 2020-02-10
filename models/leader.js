/**Import Mongoose module to the application */
const mongoose = require('mongoose')

/**Import the Schema to define models */
const Schema = mongoose.Schema

/**Importing mongoose currency to load the new type
 * into mongoose to use the prices of the dishes
*/
require(`mongoose-currency`).loadType(mongoose)
const currency = mongoose.Types.Currency

/**Define an Object */
const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    designation:{
        type: String,
        required: true,
    },
    abbr:{
        type: currency,
        required: true,
        min: 0,
    },
    description:{
        type: String,
        required: true,
    },
    featured:{
        type: Boolean,
        required: false,
    },
}, {
    timestamps: true
})

/**Create a Var model to be avaliable to export this Schema */
var Leader = mongoose.model('Leader', leaderSchema)

module.exports = Leader
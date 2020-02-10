/**Import Mongoose module to the application */
const mongoose = require('mongoose')

/**Import the Schema to define models */
const Schema = mongoose.Schema

/**Importing mongoose currency to load the new type
 * into mongoose to use the prices of the dishes
*/
require(`mongoose-currency`).loadType(mongoose)
const currency = mongoose.Types.Currency

/**Adding a document into dish */
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

/**Define an Object */
const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    label:{
        type: String,
        default: ``,
    },
    price:{
        type: currency,
        required: true,
        min: 0,
    },
    fatured:{
        type: Boolean,
        required: false,
    },
    comments: [commentSchema]//it means that each dish can have various comments inside itself
}, {
    timestamps: true
})
/**Create a Var model to be avaliable to export this Schema */
var Dishes = mongoose.model('Dishes', dishSchema)

module.exports = Dishes
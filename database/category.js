const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

var categorySchema = new Schema({
    title:{
        type : String,
        required : true,       
    },
    description:{
        type : String,       
    },
    products: [{
        type : Schema.Types.ObjectId,
        ref : 'product',
    }],
    avatar : String
    
});

let CATEGORY_COLL = mongoose.model('category', categorySchema);
module.exports = CATEGORY_COLL;
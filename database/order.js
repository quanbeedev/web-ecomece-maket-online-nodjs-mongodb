const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var orderSchema= new Schema({
    products:[{
        type:Schema.Types.ObjectId,
        ref:'product'
    }],
    total: Number,
    address:String,
    time:String,
    note:String,
    pay:String,
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
});
var ORDER_COLL= mongoose.model('order',orderSchema)
module.exports = ORDER_COLL
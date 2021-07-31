const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const ObjectId= mongoose.Types.ObjectId;

var productSchema = new Schema({
    title:String,
    description: String, 
    slug: String,
    price:Number,
    amout:Number,
    avatar:String,
    gallery:[{
        type:String,
    }],
    like:[{
        type:Schema.Types.ObjectId,
        ref:'user'
    }],
    category:{
        type:Schema.Types.ObjectId,
        ref:'category'
    },
    tag:[{
        type:Schema.Types.ObjectId,
        ref:'tag'
    }],
    promotion:{
        type:Schema.Types.ObjectId,
        ref:'promotion'
    },
  
    status:Number
})
var PRODUCT_COLL = mongoose.model('product', productSchema)
module.exports = PRODUCT_COLL
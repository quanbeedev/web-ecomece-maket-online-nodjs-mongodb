const mongoose= require('mongoose')
const Schema= mongoose.Schema;

var promotionSchema = new Schema({
    title: {
        type:String,
    },
    content:{
        type:String,
    },
    percent: Number,
    avatar: String,
    products:[{
        type: Schema.Types.ObjectId,
        ref: 'product',
    }],
    status: Number,

})
var PROMOTION_COLL=mongoose.model('promotion',promotionSchema);
module.exports= PROMOTION_COLL
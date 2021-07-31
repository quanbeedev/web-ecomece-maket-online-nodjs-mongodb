const mongoose= require('mongoose');
const Schema= mongoose.Schema;

var tagSchema= new Schema({
    title: String,
    product:[{
        type:Schema.Types.ObjectId,
        ref:'product'
    }]
});

var TAG_COLL= mongoose.model('tag',tagSchema);
module.exports=TAG_COLL;
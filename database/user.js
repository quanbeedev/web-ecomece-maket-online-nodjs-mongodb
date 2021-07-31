const mongoose = require('mongoose');
const passport = require('passport');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    username:{
      type: String,
      unique: true,
      trim: true,
      required: true,  
    },
    name:{
         type: String,
         required: true,
    },
    password: String,
    phone: Number,
    age:Number,
    email: String,
    avatar: String,
    sex: {
        type: Number,
        //1 la nam
        //0 la nu
        default:0
    },
    seen:[{
        type:Schema.Types.ObjectId,
        ref:'product'
    }],
    role: {
        type: Number,
        //1 la admin
        //0 la custommer
        default:0,
    }
    

})

let USER_COLL = mongoose.model('user', userSchema);
module.exports = USER_COLL;
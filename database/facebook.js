const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var facebookSchema = mongoose.Schema({
    uid: String,
    token: String,
    email: String,
    name: String,
    gender: String,
    pic: String
});

let facebook = mongoose.model('facebook',facebookSchema );
module.exports = facebook
require('./db');
const mongoose = require('mongoose');
require('./userLevel');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    emailAddress:{
        type: String,
        required: true,
        unique: true,
        // trim:true
    },
    userLevel:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userLevel" 
    },],
    password: String,
    active: Boolean,
    dateAdded: Date,
    lastUpdateDate: Date
});

module.exports = mongoose.model('user', userSchema, 'user');
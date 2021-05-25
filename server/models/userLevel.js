require('./db')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userLevelSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  level: Number,
  active: Boolean,
  dateAdded: Date,
  lastUpdateDate: Date
});

module.exports = mongoose.model('userLevel', userLevelSchema, 'userLevel');
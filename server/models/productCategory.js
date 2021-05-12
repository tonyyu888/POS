require('./db')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productCategory = new Schema({
  name: String,
  description: String,
  active: Boolean,
  dateAdded: Date,
  lastUpdate: Date
});

module.exports = mongoose.model('POS', productCategory, 'productCategory');
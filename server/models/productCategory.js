require('./db')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productCategorySchema = new Schema({
  name: String,
  description: String,
  active: Boolean,
  dateAdded: Date,
  lastUpdate: Date
});

module.exports = mongoose.model('productCategory', productCategorySchema, 'productCategory');
require('./db')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address1: String,
  address2: String,
  city: String,
  province: String,
  postalCode: String,
  contactNumber: [{
    name: String,
    phoneNumber: String
  },],
  contactPerson: [{
    firstName: String,
    lastName: String
  },],
  emailAddress: String,
  active: Boolean,
  dateAdded: Date,
  lastUpdateDate: Date
});

module.exports = mongoose.model('supplier', supplierSchema, 'supplier');
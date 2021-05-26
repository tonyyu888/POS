require('./db')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address1: String,
  address2: String,
  province: String,
  city: String,
  postalCode: String,
  contactNumber:[
    {
      name: String,
      phoneNumber: String
    },
  ],
  contactPerson:[
    {
      firstName: String,
      lastName: String
    },
  ],
  emailAddress: String,
  gstRate: Number,
  pstRate: Number,
  active: Boolean,
  dateAdded: Date,
  lastUpdateDate: Date
});

module.exports = mongoose.model('customer', customerSchema, 'customer');
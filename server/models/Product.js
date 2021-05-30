require('./db');
const mongoose = require('mongoose');
require('./productCategory');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        // trim:true
    },
    description: String,
    productCategory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory"
    }],
    unitPrice: {
        type:Number,
        required: true
    },
    
    supplier:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "supplier" 
    }],
    active: Boolean,
    dateAdded: Date,
    lastUpdateDate: Date
});

module.exports = mongoose.model('Product', productSchema, 'product');
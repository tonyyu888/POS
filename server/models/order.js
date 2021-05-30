require('./db');
const mongoose = require('mongoose');
//require('./customer');
//require('./user');
//require('./Product');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNumber:{
        type: String,
        required: true,
        unique: true
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer"
    },
    orderDate: Date,
    comment: String,
    salesPerson:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },    
    orderStatus:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderStatus"
    },
    orderDetail: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: Number,
        price: Number
    },],
    dateAdded: Date,
    lastUpdateDate: Date
});

module.exports = mongoose.model('order', orderSchema, 'order');

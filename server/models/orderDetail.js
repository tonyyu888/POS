require('./db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
    orderId: mongoose.Schema.Types.ObjectId,
    orderDetailRecord: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: Number,
        price: Number
    },],
    dateAdded: Date,
    lastUpdateDate: Date
});

module.exports = mongoose.model('orderDetail', orderDetailSchema, 'orderDetail');

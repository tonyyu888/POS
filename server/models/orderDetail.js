require('./db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
    orderId: mongoose.Schema.Types.ObjectId,
    orderDetailRecord: [{
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        price: Number
    },],
    dateAdded: Date,
    lastUpdateDate: Date
});

module.exports = mongoose.model('orderDetail', orderDetailSchema, 'orderDetail');

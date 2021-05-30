require('./db');
const mongoose = require('mongoose');
require('./customer');
require('./user');
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
    dateAdded: Date,
    lastUpdateDate: Date
});

orderSchema.virtual("orderDetail", {
    ref: "orderDetail",
    localField: "_id",
    foreignField: "orderId"
})

orderSchema.set("toObject",{virtuals: true});
orderSchema.set("toJSON", {virtuals: true});

module.exports = mongoose.model('order', orderSchema, 'order');

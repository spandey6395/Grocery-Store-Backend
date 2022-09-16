const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: 'User', required: true, trim: true },
    items: [{
        productId: { type: ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true }
      
    }],

    productList: {type:[String], required:true},
    paymentInfo: { type: String, default: 'pending', trim: true, enum: ["pending", "completed", "canceled"] },
    totalPrice: { type: Number, required: true, trim: true },
   
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('order', orderSchema)
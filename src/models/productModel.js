const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    title: { type: String, required: true, unique },
    description: { type: String, required: true },
    price: { type: Number, required: true, },
    currencyId: { type: String, required: true, default: INR },
    currencyFormat: { type: String, required: true, default: "₹" },
    isFreeShipping: { boolean, default: false },
    productImage: { type: String, required: true },
    style: { type: String },
    availableSizes: [{ type: String, required: true, enum: ["S", "XS", "M", "X", "L", "XXL", "XL"] }],
    installments: { type: Number },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },

})

module.exports = mongoose.model("product", productSchema)
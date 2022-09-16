const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

   
    price: { type: Number, required: true, trim: true },
    
    productCategory: [{ type: String, required: true, trim: true, enum: ["S", "XS", "M", "X", "L", "XXL", "XL"] }],
    
    productInfo: {type:String},

    quantityAvailable : {type : Number},

    deletedAt: { type: Date ,default:null},

    isDeleted: { type: Boolean, default: false },

},
{timestamps:true})

module.exports = mongoose.model("product", productSchema)
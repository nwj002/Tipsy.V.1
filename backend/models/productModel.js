const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true,
        maxLenght: 500
    },
    createdAt: {
        type: Date,
        default: Date.now()

    }
});

const Product = mongoose.model("products", productSchema);  // to export into controller
module.exports = Product;
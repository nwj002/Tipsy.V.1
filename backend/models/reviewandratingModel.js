const mongoose = require("mongoose")

const reviewratingSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
    },
    review: {
        type: String,
        maxLenght: 500,
        default: null,
        required: false,

    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: false,

    },
}
)

const ReviewRating = mongoose.model('reviewrating', reviewratingSchema);
module.exports = ReviewRating;
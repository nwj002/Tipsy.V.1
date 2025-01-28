const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    // image: {
    //     type: String,
    //     required: false
    // },
    phone: {
        type: Number,
        required: false,
        unique: true
    },
    resetPasswordOTP: {
        type: Number,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false

    }

});
const User = mongoose.model('User', userSchema);
module.exports = User;

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
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    failedAttempts: {
        type: Number,
        default: 0
    },
    lastAttemptTime: {
        type: Date,
        default: null
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
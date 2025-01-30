const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const sendOtp = async (phone, otp) => {
    let isSend = false;

    // Get API details from .env
    const url = process.env.SMS_API_URL;
    const apiKey = process.env.SMS_API_KEY;

    // Payload to send
    const payload = {
        'apiKey': apiKey,
        'to': phone,
        'message': `Your verification code is ${otp}`
    };

    try {
        const res = await axios.post(url, payload);
        if (res.status === 200) {
            isSend = true;
        }
    } catch (error) {
        console.log('Error Sending OTP', error.message);
    }

    return isSend;
};

module.exports = sendOtp;

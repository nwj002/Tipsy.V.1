// module.exports = router;
const express = require('express');
const router = express.Router();
const shippingAddressController = require('../controllers/addressController');

// Create or Update Shipping Address
router.post('/shipping-address', shippingAddressController.createShippingAddress);
router.put('/update-shipping-address/:addressId', shippingAddressController.updateShippingAddress);

// Route to fetch shipping address with user details
router.get('/getaddress/:userId', shippingAddressController.getAllShippingAddresses);
router.delete('/deleteaddress/:addressId', shippingAddressController.deleteAddress);

module.exports = router;

const ShippingAddress = require('../models/addressModel');
const User = require('../models/userModel'); // Assuming you have a User model


// Create a new Shipping Address
exports.createShippingAddress = async (req, res) => {
    const { userId, city, address, landmark } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 'success': false, 'message': 'User not found' });
        }

        // Create a new shipping address
        const shippingAddress = new ShippingAddress({
            userId,
            city,
            address,
            landmark
        });

        // Save the shipping address
        await shippingAddress.save();

        res.status(200).json({ 'success': true, 'message': 'Shipping address created successfully', shippingAddress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'success': false, 'message': 'Server error' });
    }
};

// Update an existing Shipping Address
exports.updateShippingAddress = async (req, res) => {
    const { addressId } = req.params;
    const { city, address, landmark } = req.body;

    try {
        // Check if the address exists
        let shippingAddress = await ShippingAddress.findById(addressId);
        if (!shippingAddress) {
            return res.status(404).json({ 'success': false, 'message': 'Shipping address not found' });
        }

        // Update the existing shipping address
        shippingAddress.city = city;
        shippingAddress.address = address;
        shippingAddress.landmark = landmark;

        // Save the shipping address
        await shippingAddress.save();

        res.status(200).json({ 'success': true, 'message': 'Shipping address updated successfully', shippingAddress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'success': false, 'message': 'Server error' });
    }
};

// Fetch all Shipping Addresses for a User
exports.getAllShippingAddresses = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch all shipping addresses based on the user ID
        const shippingAddresses = await ShippingAddress.find({ userId }).populate('userId', 'fullname email username age phone');
        if (!shippingAddresses.length) {
            return res.status(404).json({ 'success': false, 'message': 'No shipping addresses found for this user' });
        }

        res.status(200).json({ success: true, addresses: shippingAddresses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'success': false, 'message': 'Server error' });
    }
};


// Delete Address by ID
exports.deleteAddress = async (req, res) => {
    const { addressId } = req.params;

    try {
        // Check if the address exists
        const address = await ShippingAddress.findById(addressId);
        if (!address) {
            return res.status(404).json({ 'success': false, 'message': 'Address not found' });
        }

        // Delete the address
        await ShippingAddress.findByIdAndDelete(addressId);

        res.status(200).json({ 'success': true, 'message': 'Address deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'success': false, 'message': 'Server error' });
    }
};
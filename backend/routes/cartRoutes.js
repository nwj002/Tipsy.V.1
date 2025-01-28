const router = require('express').Router()
const cartController = require('../controllers/cartController');
const { authGuard } = require('../middleware/authGuard');
// create favorite API
router.post('/addToCart', authGuard, cartController.addToCart)
router.post('/add', authGuard, cartController.cart)
router.get('/getCartByUserID/:id', authGuard, cartController.getCartByUserID)
router.put("/updateCart/:id", authGuard, cartController.updateCart)
router.delete("/removeFromCart/:id", authGuard, cartController.removeFromCart)
router.put("/status", authGuard, cartController.updateUserCartStatus)

module.exports = router;
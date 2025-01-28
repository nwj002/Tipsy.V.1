const router = require('express').Router()
const reviewController = require("../controllers/reviewRatingController");
const { authGuard } = require('../middleware/authGuard');

// create favorite API
router.post('/addReview', authGuard, reviewController.createRating)
router.put('/updateReview/:id', authGuard, reviewController.updateRating)
router.get('/getReviewsByUserID/:id', reviewController.getReviewsByUserID)
router.get('/getReviewsByProductID/:id', reviewController.getReviewsByProductID)
module.exports = router; 
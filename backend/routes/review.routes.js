const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const reviewController = require('../controllers/review.controller');

// @route   GET /api/reviews/product/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get('/product/:productId', reviewController.getProductReviews);

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', protect, reviewController.createReview);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', protect, reviewController.updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, reviewController.deleteReview);

// @route   PUT /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.put('/:id/helpful', protect, reviewController.markReviewHelpful);

module.exports = router;

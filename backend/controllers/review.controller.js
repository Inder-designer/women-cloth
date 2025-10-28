const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: { reviews }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { product, rating, title, comment } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user has purchased the product
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      'items.product': product,
      orderStatus: 'delivered'
    });

    // Create review
    const review = await Review.create({
      product,
      user: req.user.id,
      rating,
      title,
      comment,
      verified: hasPurchased ? true : false
    });

    await review.populate('user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user owns review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName avatar');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user owns review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
exports.markReviewHelpful = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    ).populate('user', 'firstName lastName avatar');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

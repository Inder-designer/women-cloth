const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const cartController = require('../controllers/cart.controller');

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get('/', protect, cartController.getCart);

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post('/items', protect, cartController.addToCart);

// @route   PUT /api/cart/items/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/items/:itemId', protect, cartController.updateCartItem);

// @route   DELETE /api/cart/items/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/items/:itemId', protect, cartController.removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', protect, cartController.clearCart);

module.exports = router;

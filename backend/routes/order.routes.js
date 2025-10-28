const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const orderController = require('../controllers/order.controller');

// Admin routes must come before parameterized routes
// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), orderController.getAllOrders);

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', protect, orderController.getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, orderController.getOrder);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, orderController.createOrder);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, orderController.cancelOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin)
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

module.exports = router;

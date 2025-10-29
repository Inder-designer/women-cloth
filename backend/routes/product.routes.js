const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const productController = require('../controllers/product.controller');

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', productController.getProduct);

// @route   POST /api/products
// @desc    Create product (Admin only)
// @access  Private/Admin
router.post('/add', protect, authorize('admin'), upload.array('images', 5), productController.createProduct);

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), upload.array('images', 5), productController.updateProduct);

// @route   DELETE /api/products/:id/images/:publicId
// @desc    Delete specific image from product (Admin only)
// @access  Private/Admin
router.delete('/:id/images/:publicId', protect, authorize('admin'), productController.deleteProductImage);

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

module.exports = router;

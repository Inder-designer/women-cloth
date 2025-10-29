const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const categoryController = require('../controllers/category.controller');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getAllCategories);

// @route   GET /api/categories/:slug
// @desc    Get category by slug
// @access  Public
router.get('/:slug', categoryController.getCategoryBySlug);

// @route   POST /api/categories
// @desc    Create category (Admin)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), categoryController.createCategory);

// @route   PUT /api/categories/:id
// @desc    Update category (Admin)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), categoryController.updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category (Admin)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), categoryController.deleteCategory);

module.exports = router;

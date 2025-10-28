const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const userController = require('../controllers/user.controller');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, userController.updateProfile);

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', protect, userController.changePassword);

// @route   PUT /api/users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', protect, userController.updateSettings);

// @route   POST /api/users/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), userController.uploadAvatar);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), userController.getAllUsers);

module.exports = router;

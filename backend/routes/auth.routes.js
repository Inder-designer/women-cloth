const express = require('express');
const router = express.Router();
const passport = require('passport');
const { protect } = require('../middleware/auth');
const authController = require('../controllers/auth.controller');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', passport.authenticate('local'), authController.login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, authController.logout);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, authController.getMe);

// @route   GET /api/auth/status
// @desc    Check authentication status
// @access  Public
router.get('/status', authController.checkAuth);

module.exports = router;

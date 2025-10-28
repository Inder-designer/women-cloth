const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      address: req.body.address
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
exports.updateSettings = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences: req.body.preferences },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      count: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

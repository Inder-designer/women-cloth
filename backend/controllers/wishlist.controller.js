const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate('products', 'name slug price originalPrice images rating inStock');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.json({
      success: true,
      data: { wishlist }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId]
      });
    } else {
      // Check if product already in wishlist
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Product already in wishlist'
        });
      }

      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate('products', 'name slug price originalPrice images rating inStock');

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: { wishlist }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.products = wishlist.products.filter(
      product => product.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate('products', 'name slug price originalPrice images rating inStock');

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: { wishlist }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.products = [];
    await wishlist.save();

    res.json({
      success: true,
      message: 'Wishlist cleared',
      data: { wishlist }
    });
  } catch (error) {
    next(error);
  }
};

const Product = require('../models/Product');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sort, 
      page = 1, 
      limit = 12,
      featured
    } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOptions = {};
    if (sort === 'price-asc') sortOptions.price = 1;
    else if (sort === 'price-desc') sortOptions.price = -1;
    else if (sort === 'newest') sortOptions.createdAt = -1;
    else if (sort === 'popular') sortOptions.sold = -1;
    else sortOptions.createdAt = -1;

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'firstName lastName avatar' }
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const productData = req.body;

    // Add image URLs
    if (req.files) {
      productData.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: productData.name
      }));
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

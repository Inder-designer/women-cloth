const Product = require("../models/Product");
const Category = require("../models/Category");
const { deleteImage } = require("../config/cloudinary");

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
      featured,
      sizes,
      colors,
    } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category) {
      // Check if category is a valid ObjectId
      const mongoose = require("mongoose");
      if (mongoose.Types.ObjectId.isValid(category)) {
        // It's an ObjectId, use it directly
        // But also check if this category has children
        const childCategories = await Category.find({ parent: category });
        if (childCategories.length > 0) {
          // Include parent and all child categories
          query.category = {
            $in: [category, ...childCategories.map(c => c._id)]
          };
        } else {
          query.category = category;
        }
      } else {
        // It's a name or slug, find the category first
        const categoryDoc = await Category.findOne({
          $or: [
            { slug: category.toLowerCase() },
            { name: { $regex: new RegExp(`^${category}$`, "i") } },
          ],
        });

        if (categoryDoc) {
          // Check if this category has children
          const childCategories = await Category.find({ parent: categoryDoc._id });
          if (childCategories.length > 0) {
            // Include parent and all child categories
            query.category = {
              $in: [categoryDoc._id, ...childCategories.map(c => c._id)]
            };
          } else {
            query.category = categoryDoc._id;
          }
        } else {
          // Category not found, return empty results
          return res.json({
            success: true,
            data: {
              products: [],
              pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: 0,
                pages: 0,
              },
            },
          });
        }
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by sizes
    if (sizes) {
      const sizeArray = Array.isArray(sizes) ? sizes : [sizes];
      query.sizes = { $in: sizeArray };
    }

    // Filter by colors
    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : [colors];
      query.color = { $in: colorArray };
    }

    if (featured === "true") {
      query.featured = true;
    }

    // Sorting
    let sortOptions = {};
    if (sort === "price-asc") sortOptions.price = 1;
    else if (sort === "price-desc") sortOptions.price = -1;
    else if (sort === "newest") sortOptions.createdAt = -1;
    else if (sort === "popular") sortOptions.sold = -1;
    else sortOptions.createdAt = -1;

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate({
        path: "category",
        select: "name slug",
        // populate: { path: "parent", select: "name slug" },
      })
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
          pages: Math.ceil(total / limit),
        },
      },
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
      .populate({
        path: "category",
        select: "name slug parent",
        populate: { path: "parent", select: "name slug" },
      })
      .populate({
        path: "reviews",
        populate: { path: "user", select: "firstName lastName avatar" },
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: product,
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

    // Parse JSON fields if they are strings
    if (typeof productData.sizes === "string") {
      productData.sizes = JSON.parse(productData.sizes);
    }
    if (typeof productData.colors === "string") {
      productData.colors = JSON.parse(productData.colors);
    }
    if (typeof productData.tags === "string") {
      productData.tags = JSON.parse(productData.tags);
    }
    if (typeof productData.variants === "string") {
      productData.variants = JSON.parse(productData.variants);
    }

    // Add Cloudinary image URLs
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => ({
        url: file.path, // Cloudinary URL
        publicId: file.filename, // Cloudinary public ID for deletion
        alt: productData.name,
      }));
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
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
    const productData = req.body;

    // Parse JSON fields if they are strings
    if (typeof productData.sizes === "string") {
      productData.sizes = JSON.parse(productData.sizes);
    }
    if (typeof productData.colors === "string") {
      productData.colors = JSON.parse(productData.colors);
    }
    if (typeof productData.tags === "string") {
      productData.tags = JSON.parse(productData.tags);
    }
    if (typeof productData.variants === "string") {
      productData.variants = JSON.parse(productData.variants);
    }

    // If new images are uploaded, add them
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
        alt: productData.name || "Product image",
      }));

      // If product data has existing images, append new ones
      if (productData.images) {
        const existingImages =
          typeof productData.images === "string"
            ? JSON.parse(productData.images)
            : productData.images;
        productData.images = [...existingImages, ...newImages];
      } else {
        productData.images = newImages;
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: { product },
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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.publicId) {
          await deleteImage(image.publicId);
        }
      }
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete specific image from product (Admin only)
// @route   DELETE /api/products/:id/images/:publicId
// @access  Private/Admin
exports.deleteProductImage = async (req, res, next) => {
  try {
    const { id, publicId } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find and remove the image from product
    const imageIndex = product.images.findIndex(
      (img) => img.publicId === publicId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete from Cloudinary
    await deleteImage(publicId);

    // Remove from product images array
    product.images.splice(imageIndex, 1);
    await product.save();

    res.json({
      success: true,
      message: "Image deleted successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

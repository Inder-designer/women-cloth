const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  images: [{
    url: String,
    publicId: String, // Cloudinary public ID for deletion
    alt: String
  }],
  // Legacy fields - kept for backward compatibility
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
  }],
  color: {
    type: String,
    default: 'Default'
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  // New variant system - size-based only
  variants: [{
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
      required: true
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    sku: String, // Stock Keeping Unit - unique identifier for this variant
    price: Number, // Optional: if this variant has different price
    images: [String] // Optional: specific images for this variant
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  views: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  // Update total stock from variants if variants exist
  if (this.variants && this.variants.length > 0) {
    this.stock = this.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
    this.inStock = this.stock > 0;
    
    // Update legacy sizes array from variants
    const uniqueSizes = [...new Set(this.variants.map(v => v.size))];
    this.sizes = uniqueSizes;
  }
  
  next();
});

// Method to get available variants (in stock)
productSchema.methods.getAvailableVariants = function() {
  return this.variants.filter(variant => variant.stock > 0);
};

// Method to find specific variant by size only
productSchema.methods.findVariant = function(size) {
  return this.variants.find(v => v.size === size);
};

// Method to update variant stock by size only
productSchema.methods.updateVariantStock = function(size, quantity) {
  const variant = this.findVariant(size);
  if (variant) {
    variant.stock = Math.max(0, variant.stock - quantity);
    return true;
  }
  return false;
};

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual populate reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

module.exports = mongoose.model('Product', productSchema);

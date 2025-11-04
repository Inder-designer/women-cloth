const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/women-clothing')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function seedProductsWithVariants() {
  try {
    // Get or create a category
    let category = await Category.findOne({ slug: 'dresses' });
    if (!category) {
      category = await Category.create({
        name: 'Dresses',
        slug: 'dresses',
        description: 'Beautiful dresses for every occasion'
      });
    }

    // Sample products with variants
    const productsWithVariants = [
      {
        name: 'Floral Summer Dress',
        description: 'Beautiful floral print summer dress perfect for warm weather. Features a flattering A-line silhouette and comfortable fabric.',
        price: 49.99,
        originalPrice: 79.99,
        category: category._id,
        color: 'Red',
        images: [{
          url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500',
          alt: 'Floral Summer Dress'
        }],
        variants: [
          { size: 'S', stock: 5, sku: 'FSD-S' },
          { size: 'M', stock: 10, sku: 'FSD-M' },
          { size: 'L', stock: 8, sku: 'FSD-L' },
          { size: 'XL', stock: 3, sku: 'FSD-XL' },
        ],
        featured: true,
        tags: ['summer', 'floral', 'casual']
      },
      {
        name: 'Elegant Evening Gown',
        description: 'Stunning evening gown with elegant design and premium fabric. Perfect for special occasions and formal events.',
        price: 129.99,
        originalPrice: 199.99,
        category: category._id,
        color: 'Black',
        images: [{
          url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500',
          alt: 'Elegant Evening Gown'
        }],
        variants: [
          { size: 'S', stock: 3, sku: 'EEG-S' },
          { size: 'M', stock: 5, sku: 'EEG-M' },
          { size: 'L', stock: 4, sku: 'EEG-L' },
          { size: 'XL', stock: 2, sku: 'EEG-XL' },
          { size: 'XXL', stock: 1, sku: 'EEG-XXL' },
        ],
        featured: true,
        tags: ['evening', 'formal', 'elegant']
      },
      {
        name: 'Casual Cotton Dress',
        description: 'Comfortable cotton dress for everyday wear. Breathable fabric and relaxed fit make it perfect for daily activities.',
        price: 34.99,
        originalPrice: 54.99,
        category: category._id,
        color: 'White',
        images: [{
          url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
          alt: 'Casual Cotton Dress'
        }],
        variants: [
          { size: 'XS', stock: 8, sku: 'CCD-XS' },
          { size: 'S', stock: 12, sku: 'CCD-S' },
          { size: 'M', stock: 15, sku: 'CCD-M' },
          { size: 'L', stock: 10, sku: 'CCD-L' },
          { size: 'XL', stock: 6, sku: 'CCD-XL' },
        ],
        featured: false,
        tags: ['casual', 'cotton', 'everyday']
      },
      {
        name: 'Party Cocktail Dress',
        description: 'Glamorous cocktail dress perfect for parties and night outs. Features sequin details and form-fitting design.',
        price: 89.99,
        originalPrice: 139.99,
        category: category._id,
        color: 'Gold',
        images: [{
          url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500',
          alt: 'Party Cocktail Dress'
        }],
        variants: [
          { size: 'XS', stock: 2, sku: 'PCD-XS', price: 94.99 },
          { size: 'S', stock: 4, sku: 'PCD-S', price: 94.99 },
          { size: 'M', stock: 3, sku: 'PCD-M', price: 94.99 },
          { size: 'L', stock: 2, sku: 'PCD-L', price: 94.99 },
          { size: 'XL', stock: 0, sku: 'PCD-XL', price: 94.99 }, // Out of stock
        ],
        featured: true,
        tags: ['party', 'cocktail', 'glamorous']
      },
    ];

    // Delete existing products with variants
    await Product.deleteMany({ variants: { $exists: true, $ne: [] } });
    console.log('🗑️  Cleared existing products with variants');

    // Insert products with variants
    for (const productData of productsWithVariants) {
      const product = new Product(productData);
      await product.save(); // This will trigger the pre-save hook
      console.log(`✅ Created: ${product.name} with ${product.variants.length} variants (Total stock: ${product.stock})`);
    }

    console.log('\n🎉 Successfully seeded products with variants!');
    console.log('\nVariant Features:');
    console.log('- Size-based variants only');
    console.log('- Individual stock tracking per size');
    console.log('- SKU for each variant');
    console.log('- Optional variant-specific pricing');
    console.log('- Automatic total stock calculation');
    console.log('- Single product color field');
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedProductsWithVariants();

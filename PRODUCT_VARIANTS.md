# Product Variants System

## Overview
Implemented a comprehensive product variant system that allows tracking inventory by size and color combinations. Each variant has its own stock level, SKU, and optional pricing.

## Backend Implementation

### Product Model (`backend/models/Product.js`)

#### Variant Schema
```javascript
variants: [{
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
    required: true
  },
  color: {
    name: {
      type: String,
      required: true
    },
    hexCode: {
      type: String, // e.g., "#FF0000"
      required: true
    }
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: String, // Stock Keeping Unit - unique identifier
  price: Number, // Optional: variant-specific price
  images: [String] // Optional: variant-specific images
}]
```

#### Automatic Stock Calculation
The model automatically:
- Calculates total stock from all variants
- Updates `inStock` boolean based on total stock
- Populates legacy `sizes` and `colors` arrays from variants

#### Model Methods

**getAvailableVariants()**
```javascript
product.getAvailableVariants()
// Returns: Array of variants with stock > 0
```

**findVariant(size, colorName)**
```javascript
product.findVariant('M', 'Red')
// Returns: Specific variant or undefined
```

**updateVariantStock(size, colorName, quantity)**
```javascript
product.updateVariantStock('M', 'Red', 1)
// Returns: true if successful, false if variant not found
```

### Legacy Support
The system maintains backward compatibility:
- Legacy `sizes` and `colors` arrays still exist
- Legacy `stock` field shows total stock
- Existing products without variants continue to work
- Variants are optional - products can use either system

## Frontend Implementation

### TypeScript Types (`src/types/index.ts`)

```typescript
interface ProductVariant {
  size: string;
  color: {
    name: string;
    hexCode: string;
  };
  stock: number;
  sku?: string;
  price?: number;
  images?: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  // ... other fields
  variants?: ProductVariant[];
}
```

### ProductCard Component Features

#### Grid View
- **Color Swatches Preview**: Shows up to 5 color circles below product name
- **Select Options Button**: Opens variant selector instead of direct add to cart
- **Compact Variant Selector**: 
  - Size buttons with availability indication
  - Color swatches with checkmark on selection
  - Real-time stock validation
  - Out of stock message

#### List View
- **Expanded Variant Information**: Shows all available sizes and colors
- **Full Variant Selector**: 
  - Larger size and color selection area
  - Visual feedback for unavailable combinations
  - Close button to cancel selection
  - Stock status indicator

#### Smart Variant Logic

**Available Options Filtering**
```typescript
// Get colors available for selected size
const availableColors = variants
  .filter(v => v.size === selectedSize && v.stock > 0)
  .map(v => v.color.name)

// Get sizes available for selected color  
const availableSizes = variants
  .filter(v => v.color.name === selectedColor && v.stock > 0)
  .map(v => v.size)
```

**Stock Validation**
```typescript
const getCurrentVariantStock = () => {
  const variant = variants.find(
    v => v.size === selectedSize && v.color.name === selectedColor
  )
  return variant ? variant.stock > 0 : false
}
```

**Color Hex Mapping**
- Variants with `hexCode` use the exact color
- Fallback to predefined color map for legacy products
- Default gray for unmapped colors

#### User Experience Flow

1. **Initial State**: "Select Options" button displayed
2. **Click Button**: Variant selector modal/panel appears
3. **Select Size**: Only colors available for that size are enabled
4. **Select Color**: Only sizes available for that color are enabled
5. **Stock Check**: Button disabled if selected combination is out of stock
6. **Add to Cart**: Adds specific variant to cart with size and color
7. **Success**: Variant selector closes automatically

## Cart Integration

Cart items now store specific size and color selections:

```javascript
{
  product: ObjectId,
  quantity: 1,
  size: 'M',
  color: 'Red',
  price: 49.99
}
```

This allows:
- Multiple cart items for same product but different variants
- Accurate inventory tracking
- Proper order fulfillment

## Seeding Sample Data

### Run Seed Script
```bash
cd backend
node utils/seedVariants.js
```

### Sample Products Created
1. **Floral Summer Dress** (9 variants)
   - Sizes: S, M, L
   - Colors: Red, Blue, Pink
   - Some variants out of stock

2. **Elegant Evening Gown** (8 variants)
   - Sizes: S, M, L, XL
   - Colors: Black, Navy
   - All variants in stock

3. **Casual Cotton Dress** (12 variants)
   - Sizes: XS, S, M, L
   - Colors: White, Beige, Gray
   - High stock levels

4. **Party Cocktail Dress** (12 variants)
   - Sizes: XS, S, M, L
   - Colors: Gold, Silver, Black
   - Gold/Silver have premium pricing (+$5)
   - Some Silver sizes out of stock

## API Considerations

### Product Endpoints
The existing product API endpoints automatically include variants:
```javascript
GET /api/products
GET /api/products/:id
// Both return products with populated variants array
```

### Cart Endpoints
Updated to handle size and color:
```javascript
POST /api/cart/add
{
  productId: "...",
  quantity: 1,
  size: "M",
  color: "Red"
}
```

### Inventory Updates
When orders are placed:
1. Find the specific variant by size and color
2. Decrease variant stock
3. Total stock automatically recalculates on save
4. `inStock` boolean updates automatically

## Benefits

### For Customers
✅ See exact color and size availability
✅ No confusion about what's actually in stock
✅ Visual color representation
✅ Can't add out-of-stock combinations to cart

### For Business
✅ Accurate inventory tracking per variant
✅ Better analytics (which colors/sizes sell best)
✅ Prevent overselling
✅ SKU tracking for warehouse management
✅ Variant-specific pricing flexibility

### For Developers
✅ Type-safe with TypeScript
✅ Automatic stock calculations
✅ Helper methods for common operations
✅ Backward compatible with existing products
✅ Easy to extend (add more variant properties)

## Future Enhancements

### Potential Additions
1. **Variant Images**: Show different images per color
2. **Variant-Specific Descriptions**: Different fabric for different colors
3. **Size Charts**: Display size guides based on category
4. **Low Stock Warnings**: "Only 2 left!" badges
5. **Wishlist Variants**: Save specific size/color combinations
6. **Recently Viewed Variants**: Remember last selected variant
7. **Size Recommendations**: "Customers usually buy size M"
8. **Bundle Discounts**: "Buy 2 colors, save 10%"

### Admin Features (Future)
- Bulk variant creation interface
- CSV import/export for variants
- Variant analytics dashboard
- Quick stock adjustment tools
- Variant image management

## Testing Checklist

- [ ] Products display correctly with and without variants
- [ ] Variant selector opens/closes properly
- [ ] Size selection filters available colors
- [ ] Color selection filters available sizes
- [ ] Out of stock variants are disabled
- [ ] Can add variant to cart with correct size/color
- [ ] Cart displays selected variant details
- [ ] Multiple variants of same product can be in cart
- [ ] Stock decreases when order is placed
- [ ] Total stock recalculates correctly
- [ ] Legacy products still work without variants

## Migration Strategy

### Adding Variants to Existing Products

**Option 1: Manual via Admin Interface** (Future feature)
- Edit product
- Add variants one by one
- Set stock for each variant

**Option 2: Database Script**
```javascript
// Convert single stock to variants
const product = await Product.findById('...');
product.variants = [];

for (const size of product.sizes) {
  for (const color of product.colors) {
    product.variants.push({
      size,
      color: { 
        name: color, 
        hexCode: colorMap[color] || '#999999' 
      },
      stock: Math.floor(product.stock / (product.sizes.length * product.colors.length)),
      sku: `${product.slug}-${color}-${size}`.toUpperCase()
    });
  }
}

await product.save();
```

## Troubleshooting

### Issue: Variants not showing
- Check if product has `variants` array populated
- Verify variants have `stock > 0`
- Ensure frontend component receives `variants` prop

### Issue: Can't add to cart
- Verify selected size/color combination exists in variants
- Check variant stock is greater than 0
- Ensure cart API accepts size and color parameters

### Issue: Stock not updating
- Confirm `updateVariantStock` method is called
- Check pre-save hook runs to recalculate total stock
- Verify variant size and color match exactly (case-sensitive)

## Documentation
- Product Model: `backend/models/Product.js`
- Types: `src/types/index.ts`
- ProductCard: `src/components/ProductCard.tsx`
- Seed Script: `backend/utils/seedVariants.js`
- This Guide: `PRODUCT_VARIANTS.md`

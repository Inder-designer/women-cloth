# Quick Start Guide - Customer Frontend APIs

This guide will help you quickly integrate the RTK Query APIs into your components.

## Prerequisites

✅ Redux store is already set up and integrated in the root layout
✅ All API endpoints are configured and ready to use
✅ Backend server should be running on `http://localhost:5000`

## Step 1: Import the Hook

Choose the appropriate hook from the API files:

```tsx
// For products
import { useGetAllProductsQuery } from '@/store/api/productsApi';

// For authentication
import { useLoginMutation } from '@/store/api/authApi';

// For cart
import { useGetCartQuery, useAddToCartMutation } from '@/store/api/cartApi';

// For wishlist
import { useGetWishlistQuery, useAddToWishlistMutation } from '@/store/api/wishlistApi';

// For orders
import { useGetMyOrdersQuery } from '@/store/api/ordersApi';

// For reviews
import { useGetProductReviewsQuery } from '@/store/api/reviewsApi';
```

## Step 2: Use the Hook in Your Component

### Example 1: Display Products List

```tsx
'use client';

import { useGetAllProductsQuery } from '@/store/api/productsApi';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  // Call the hook
  const { data, isLoading, error } = useGetAllProductsQuery({
    page: 1,
    limit: 12,
    inStock: true,
    sort: '-createdAt'
  });

  // Handle loading state
  if (isLoading) {
    return <div>Loading products...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error loading products. Please try again.</div>;
  }

  // Display data
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <p>
          Page {data?.pagination.currentPage} of {data?.pagination.totalPages}
        </p>
      </div>
    </div>
  );
}
```

### Example 2: Product Details Page

```tsx
'use client';

import { useGetProductBySlugQuery } from '@/store/api/productsApi';
import { useAddToCartMutation } from '@/store/api/cartApi';
import { useState } from 'react';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Fetch product data
  const { data: product, isLoading } = useGetProductBySlugQuery(params.slug);

  // Add to cart mutation
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product!._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      }).unwrap();
      
      alert('Added to cart successfully!');
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img 
            src={product.images[0]?.url} 
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-red-600 mb-4">
            ₹{product.price}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="mb-4">
              <label className="block font-medium mb-2">Size:</label>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-4">
              <label className="block font-medium mb-2">Color:</label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded ${
                      selectedColor === color ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border rounded px-4 py-2 w-20"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !product.inStock}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isAdding ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Example 3: User Login

```tsx
'use client';

import { useLoginMutation } from '@/store/api/authApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await login({ email, password }).unwrap();
      console.log('Login successful:', result.user);
      router.push('/profile');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>

        {error && (
          <div className="text-red-600">
            Login failed. Please check your credentials.
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

### Example 4: Shopping Cart

```tsx
'use client';

import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from '@/store/api/cartApi';
import Link from 'next/link';

export default function CartPage() {
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveFromCartMutation();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateItem({ itemId, quantity: newQuantity });
  };

  const handleRemove = async (itemId: string) => {
    if (confirm('Remove this item from cart?')) {
      await removeItem(itemId);
    }
  };

  if (isLoading) return <div>Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/shop" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="flex gap-4 border rounded-lg p-4">
              <img
                src={item.product.images[0]?.url}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
                {item.size && <p className="text-sm">Size: {item.size}</p>}
                {item.color && <p className="text-sm">Color: {item.color}</p>}
                
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="px-3 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                  
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="ml-4 text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span>₹{cart.totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{cart.totalPrice}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## Common Patterns

### 1. Loading State
```tsx
if (isLoading) return <div>Loading...</div>;
```

### 2. Error Handling
```tsx
import { getErrorMessage } from '@/store/utils';

if (error) {
  const message = getErrorMessage(error);
  return <div>Error: {message}</div>;
}
```

### 3. Conditional Rendering
```tsx
if (!data) return null;
```

### 4. Mutation with Toast Notification
```tsx
const [mutate, { isLoading }] = useMutation();

const handleAction = async () => {
  try {
    await mutate(data).unwrap();
    toast.success('Success!');
  } catch (err) {
    toast.error(getErrorMessage(err));
  }
};
```

## Tips

1. **Always use `unwrap()`** when you need to handle mutation results in try-catch
2. **Check `isLoading`** before rendering data
3. **Use `getErrorMessage()`** utility for consistent error messages
4. **Invalidate tags** automatically happen - no need to manually refetch
5. **TypeScript types** are automatically inferred from the APIs

## Next Steps

1. Replace existing Context API calls with RTK Query hooks
2. Add error boundaries for better error handling
3. Implement toast notifications for user feedback
4. Add loading skeletons for better UX
5. Set up authentication guards using `useCheckAuthQuery`

## Need Help?

- Check `API_USAGE.md` for detailed examples
- Check `README.md` for store structure overview
- Check `utils.ts` for helper functions
- Backend API docs: Check backend README

Happy coding! 🚀

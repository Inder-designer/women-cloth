# Redux Store with RTK Query

This directory contains the Redux store configuration with RTK Query for API calls.

## Structure

```
store/
├── api/
│   ├── baseApi.ts         # Base API configuration
│   ├── authApi.ts         # Authentication endpoints
│   ├── productsApi.ts     # Products endpoints
│   ├── categoriesApi.ts   # Categories endpoints
│   ├── cartApi.ts         # Cart endpoints
│   ├── wishlistApi.ts     # Wishlist endpoints
│   ├── ordersApi.ts       # Orders endpoints
│   └── reviewsApi.ts      # Reviews endpoints
├── slices/                # Redux slices (for local state if needed)
├── index.ts               # Store configuration
├── hooks.ts               # Typed hooks (useAppDispatch, useAppSelector)
├── provider.tsx           # Redux Provider component
└── API_USAGE.md           # Detailed API usage examples
```

## Features

### RTK Query Benefits

1. **Automatic Caching**: Data is cached automatically based on query parameters
2. **Automatic Refetching**: Data refetches when dependencies change
3. **Loading States**: Built-in loading, success, and error states
4. **Tag-based Invalidation**: Automatic cache invalidation using tags
5. **TypeScript Support**: Full type safety with TypeScript
6. **Optimistic Updates**: Support for optimistic UI updates

### Available APIs

#### 1. Authentication API
- Register new user
- Login/Logout
- Check authentication status
- Forgot/Reset password
- Get/Update user profile
- Change password

#### 2. Products API
- Get all products with filters (pagination, search, category, price range, etc.)
- Get product by slug
- Get featured products
- Get related products

#### 3. Categories API
- Get all categories
- Get category by slug
- Get category tree (with subcategories)

#### 4. Cart API
- Get user cart
- Add item to cart
- Update cart item quantity
- Remove item from cart
- Clear entire cart

#### 5. Wishlist API
- Get user wishlist
- Add item to wishlist
- Remove item from wishlist
- Clear entire wishlist
- Check if product is in wishlist

#### 6. Orders API
- Get all user orders
- Get order by ID
- Create new order
- Cancel order

#### 7. Reviews API
- Get product reviews with stats
- Create review
- Update review
- Delete review
- Mark review as helpful

## Usage

### In a Component

```tsx
'use client';

import { useGetAllProductsQuery } from '@/store/api/productsApi';

export default function ProductsPage() {
  const { data, isLoading, error } = useGetAllProductsQuery({
    page: 1,
    limit: 12,
    inStock: true,
    sort: '-createdAt'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {data?.products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### Mutations Example

```tsx
'use client';

import { useAddToCartMutation } from '@/store/api/cartApi';

export default function AddToCartButton({ productId }) {
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleClick = async () => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      alert('Added to cart!');
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Base API Setup

The base API is configured in `api/baseApi.ts` with:
- Base URL from environment variable
- Credentials included for cookie-based authentication
- Tag types for cache invalidation

## Cache Tags

The following tags are used for cache invalidation:

- `Products` - List of products
- `Product` - Individual product
- `Categories` - List of categories
- `Category` - Individual category
- `Cart` - User's cart
- `Wishlist` - User's wishlist
- `Orders` - User's orders
- `User` - User data
- `Reviews` - Product reviews

When a mutation invalidates a tag, all queries with that tag will automatically refetch.

## Type Safety

All APIs are fully typed with TypeScript interfaces. Import types from the API files:

```tsx
import type { Product } from '@/store/api/productsApi';
import type { User } from '@/store/api/authApi';
import type { Order } from '@/store/api/ordersApi';
```

## Error Handling

RTK Query provides error information in the hook return value:

```tsx
const { data, error, isError } = useGetProductsQuery();

if (isError) {
  console.error(error);
  // Handle error appropriately
}
```

## For More Details

See `API_USAGE.md` for comprehensive examples of all API endpoints.

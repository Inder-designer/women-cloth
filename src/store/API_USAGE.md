# RTK Query APIs - Usage Guide

This document provides examples of how to use the RTK Query APIs in the customer-facing application.

## Setup

The Redux store with RTK Query is already configured and wrapped in the root layout. All you need to do is import the hooks and use them in your components.

## Available APIs

### 1. Authentication API (`authApi.ts`)

#### Register a new user
```tsx
import { useRegisterMutation } from '@/store/api/authApi';

function RegisterForm() {
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      }).unwrap();
      console.log('User registered:', result.user);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };
}
```

#### Login
```tsx
import { useLoginMutation } from '@/store/api/authApi';

function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    const result = await login({
      email: 'john@example.com',
      password: 'password123'
    }).unwrap();
  };
}
```

#### Check Authentication Status
```tsx
import { useCheckAuthQuery } from '@/store/api/authApi';

function ProtectedComponent() {
  const { data, isLoading } = useCheckAuthQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data?.isAuthenticated) return <div>Please login</div>;

  return <div>Welcome, {data.user?.firstName}</div>;
}
```

### 2. Products API (`productsApi.ts`)

#### Get all products with filters
```tsx
import { useGetAllProductsQuery } from '@/store/api/productsApi';

function ProductsList() {
  const { data, isLoading, error } = useGetAllProductsQuery({
    page: 1,
    limit: 12,
    category: 'dresses',
    minPrice: 500,
    maxPrice: 5000,
    inStock: true,
    sort: '-createdAt'
  });

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {data?.products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
      <Pagination {...data?.pagination} />
    </div>
  );
}
```

#### Get product by slug
```tsx
import { useGetProductBySlugQuery } from '@/store/api/productsApi';

function ProductDetails({ slug }: { slug: string }) {
  const { data: product, isLoading } = useGetProductBySlugQuery(slug);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product?.name}</h1>
      <p>₹{product?.price}</p>
      <img src={product?.images[0]?.url} alt={product?.name} />
    </div>
  );
}
```

#### Get featured products
```tsx
import { useGetFeaturedProductsQuery } from '@/store/api/productsApi';

function FeaturedSection() {
  const { data: products } = useGetFeaturedProductsQuery({ limit: 8 });

  return (
    <div className="grid grid-cols-4 gap-4">
      {products?.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### 3. Categories API (`categoriesApi.ts`)

#### Get all categories
```tsx
import { useGetAllCategoriesQuery } from '@/store/api/categoriesApi';

function CategoriesMenu() {
  const { data: categories } = useGetAllCategoriesQuery({ isActive: true });

  return (
    <nav>
      {categories?.map(category => (
        <Link key={category._id} href={`/categories/${category.slug}`}>
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
```

### 4. Cart API (`cartApi.ts`)

#### Get user cart
```tsx
import { useGetCartQuery } from '@/store/api/cartApi';

function CartPage() {
  const { data: cart, isLoading } = useGetCartQuery();

  if (isLoading) return <div>Loading cart...</div>;

  return (
    <div>
      <h2>Cart ({cart?.totalItems} items)</h2>
      <div>Total: ₹{cart?.totalPrice}</div>
      {cart?.items.map(item => (
        <CartItem key={item._id} item={item} />
      ))}
    </div>
  );
}
```

#### Add to cart
```tsx
import { useAddToCartMutation } from '@/store/api/cartApi';

function AddToCartButton({ productId }: { productId: string }) {
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId,
        quantity: 1,
        size: 'M',
        color: 'Red'
      }).unwrap();
      alert('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

#### Update cart item
```tsx
import { useUpdateCartItemMutation } from '@/store/api/cartApi';

function CartItemQuantity({ itemId, currentQuantity }) {
  const [updateItem] = useUpdateCartItemMutation();

  const handleQuantityChange = (newQuantity: number) => {
    updateItem({ itemId, quantity: newQuantity });
  };

  return (
    <div>
      <button onClick={() => handleQuantityChange(currentQuantity - 1)}>-</button>
      <span>{currentQuantity}</span>
      <button onClick={() => handleQuantityChange(currentQuantity + 1)}>+</button>
    </div>
  );
}
```

#### Remove from cart
```tsx
import { useRemoveFromCartMutation } from '@/store/api/cartApi';

function RemoveButton({ itemId }: { itemId: string }) {
  const [removeItem] = useRemoveFromCartMutation();

  return (
    <button onClick={() => removeItem(itemId)}>
      Remove
    </button>
  );
}
```

### 5. Wishlist API (`wishlistApi.ts`)

#### Get wishlist
```tsx
import { useGetWishlistQuery } from '@/store/api/wishlistApi';

function WishlistPage() {
  const { data: wishlist } = useGetWishlistQuery();

  return (
    <div>
      <h2>My Wishlist ({wishlist?.items.length})</h2>
      {wishlist?.items.map(item => (
        <WishlistItem key={item._id} item={item} />
      ))}
    </div>
  );
}
```

#### Add/Remove from wishlist
```tsx
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/store/api/wishlistApi';

function WishlistButton({ productId }: { productId: string }) {
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { data } = useIsInWishlistQuery(productId);

  const handleToggle = async () => {
    if (data?.inWishlist) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist({ productId });
    }
  };

  return (
    <button onClick={handleToggle}>
      {data?.inWishlist ? '❤️ Remove' : '🤍 Add to Wishlist'}
    </button>
  );
}
```

### 6. Orders API (`ordersApi.ts`)

#### Get user orders
```tsx
import { useGetMyOrdersQuery } from '@/store/api/ordersApi';

function OrdersPage() {
  const { data, isLoading } = useGetMyOrdersQuery({ page: 1, limit: 10 });

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2>My Orders</h2>
      {data?.orders.map(order => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
```

#### Create order
```tsx
import { useCreateOrderMutation } from '@/store/api/ordersApi';

function CheckoutButton() {
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleCheckout = async () => {
    try {
      const order = await createOrder({
        items: [
          { product: 'productId', quantity: 2, size: 'M', color: 'Red', price: 1999 }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India',
          phone: '+91 9876543210'
        },
        paymentMethod: 'COD',
        notes: 'Please deliver after 6 PM'
      }).unwrap();
      
      // Redirect to order confirmation page
      router.push(`/orders/${order._id}`);
    } catch (err) {
      console.error('Order failed:', err);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Place Order'}
    </button>
  );
}
```

### 7. Reviews API (`reviewsApi.ts`)

#### Get product reviews
```tsx
import { useGetProductReviewsQuery } from '@/store/api/reviewsApi';

function ProductReviews({ productId }: { productId: string }) {
  const { data, isLoading } = useGetProductReviewsQuery({ productId, page: 1, limit: 5 });

  if (isLoading) return <div>Loading reviews...</div>;

  return (
    <div>
      <h3>Customer Reviews</h3>
      <div>Average: {data?.stats.averageRating} ⭐ ({data?.stats.totalReviews} reviews)</div>
      {data?.reviews.map(review => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
}
```

#### Create review
```tsx
import { useCreateReviewMutation } from '@/store/api/reviewsApi';

function ReviewForm({ productId }: { productId: string }) {
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating: 5,
        title: 'Great product!',
        comment: 'Highly recommend this product.'
      }).unwrap();
      alert('Review submitted!');
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Important Notes

1. **Authentication**: Most APIs require authentication. Make sure users are logged in before calling cart, wishlist, orders, and review mutations.

2. **Error Handling**: Always wrap mutation calls in try-catch blocks to handle errors gracefully.

3. **Automatic Refetching**: RTK Query automatically refetches data when tags are invalidated. For example, adding a product to cart will automatically refetch the cart data.

4. **Loading States**: Use `isLoading`, `isFetching`, and `isError` from the hooks to show appropriate UI states.

5. **Optimistic Updates**: For better UX, you can implement optimistic updates (updating UI before server response).

6. **Cache Management**: RTK Query handles caching automatically. Data is cached based on query parameters and tags.

## API Base URL

The API base URL is configured in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Make sure your backend server is running on this URL or update the environment variable accordingly.

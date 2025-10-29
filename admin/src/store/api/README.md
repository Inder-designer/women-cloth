# RTK Query API Documentation

This project uses **RTK Query** for efficient data fetching, caching, and state management.

## Architecture

### Base API Configuration

**File:** `store/api/baseApi.ts`

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include', // Cookies for authentication
  }),
  tagTypes: ['User', 'Products', 'Product', 'Orders', 'Order', 'Customers'],
  endpoints: () => ({}),
});
```

## API Endpoints

### 1. Auth API (`store/api/authApi.ts`)

**Endpoints:**
- `login` - POST /auth/login
- `logout` - POST /auth/logout  
- `checkAuth` - GET /auth/status

**Hooks:**
```typescript
import { useLoginMutation, useLogoutMutation, useCheckAuthQuery } from '@/store/api/authApi';

// In component
const [login, { isLoading, error }] = useLoginMutation();
const { data, isLoading } = useCheckAuthQuery();
```

**Features:**
- ✅ Automatic cache invalidation on login/logout
- ✅ Auth status caching with 'User' tag
- ✅ Cookie-based authentication

---

### 2. Products API (`store/api/productsApi.ts`)

**Endpoints:**
- `getProducts` - GET /products (with filters, search, pagination)
- `getProductById` - GET /products/:id
- `createProduct` - POST /products
- `updateProduct` - PUT /products/:id
- `deleteProduct` - DELETE /products/:id

**Hooks:**
```typescript
import {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/store/api/productsApi';

// List products with filters
const { data, isLoading, refetch } = useGetProductsQuery({
  page: 1,
  limit: 12,
  search: 'shirt',
});

// Get single product
const { data: product } = useGetProductByIdQuery(productId);

// Create/Update/Delete
const [createProduct] = useCreateProductMutation();
const [updateProduct] = useUpdateProductMutation();
const [deleteProduct] = useDeleteProductMutation();
```

**Features:**
- ✅ Automatic cache invalidation on mutations
- ✅ Optimistic updates
- ✅ Automatic refetching
- ✅ Query parameter handling

---

### 3. Orders API (`store/api/ordersApi.ts`)

**Endpoints:**
- `getAllOrders` - GET /orders/admin
- `getOrderById` - GET /orders/:id
- `updateOrderStatus` - PUT /orders/:id/status

**Hooks:**
```typescript
import {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from '@/store/api/ordersApi';

// Get all orders
const { data: orders, isLoading } = useGetAllOrdersQuery();

// Get single order
const { data: order } = useGetOrderByIdQuery(orderId);

// Update status
const [updateStatus] = useUpdateOrderStatusMutation();
await updateStatus({ 
  id: orderId, 
  status: 'shipped', 
  trackingNumber: 'TRACK123' 
});
```

**Features:**
- ✅ Admin-only endpoints
- ✅ Order status management
- ✅ Tracking number support
- ✅ Auto-refresh after updates

---

### 4. Customers API (`store/api/customersApi.ts`)

**Endpoints:**
- `getAllCustomers` - GET /users

**Hooks:**
```typescript
import { useGetAllCustomersQuery } from '@/store/api/customersApi';

const { data: customers, isLoading } = useGetAllCustomersQuery();
```

**Features:**
- ✅ Customer list caching
- ✅ Role and status information
- ✅ Automatic updates

---

## Key Benefits of RTK Query

### 1. **Automatic Caching**
```typescript
// First call - fetches from API
const { data } = useGetProductsQuery({ page: 1 });

// Second call - uses cached data (no API call!)
const { data } = useGetProductsQuery({ page: 1 });
```

### 2. **Automatic Refetching**
- Refetch on focus (when tab becomes active)
- Refetch on reconnect (when internet comes back)
- Configurable cache lifetime

### 3. **Cache Invalidation**
```typescript
// When product is deleted, automatically:
// - Removes product from cache
// - Refetches product list
// - Updates UI everywhere

await deleteProduct(id).unwrap();
// All product lists automatically update!
```

### 4. **Loading States**
```typescript
const { data, isLoading, isFetching, error } = useGetProductsQuery();

if (isLoading) return <LoadingSpinner />;
if (error) return <Error message={error} />;
return <ProductList products={data} />;
```

### 5. **Optimistic Updates**
```typescript
// UI updates immediately, API call happens in background
const [updateProduct] = useUpdateProductMutation();
await updateProduct({ id, data });
// UI already updated!
```

---

## Cache Tags System

**Tag Types:**
- `User` - Authentication status
- `Products` - Product list
- `Product` - Individual product
- `Orders` - Order list
- `Order` - Individual order
- `Customers` - Customer list

**How It Works:**
```typescript
// Product list provides tags
providesTags: (result) => [
  ...result.products.map(({ _id }) => ({ type: 'Products', id: _id })),
  { type: 'Products', id: 'LIST' },
]

// Delete invalidates those tags
invalidatesTags: (result, error, id) => [
  { type: 'Product', id },
  { type: 'Products', id: 'LIST' },
]

// RTK Query automatically refetches affected queries!
```

---

## Usage Examples

### Example 1: Products Page
```typescript
'use client';

import { useGetProductsQuery, useDeleteProductMutation } from '@/store/api/productsApi';

export default function ProductsPage() {
  const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 12 });
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    await deleteProduct(id).unwrap();
    // List automatically updates!
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.data.products.map(product => (
        <ProductCard 
          key={product._id} 
          product={product}
          onDelete={() => handleDelete(product._id)}
        />
      ))}
    </div>
  );
}
```

### Example 2: Login Page
```typescript
'use client';

import { useLoginMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [login, { isLoading, error }] = useLoginMutation();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div>{error.data.message}</div>}
    </form>
  );
}
```

### Example 3: Order Details with Update
```typescript
'use client';

import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '@/store/api/ordersApi';

export default function OrderDetailsPage({ params }) {
  const { data: order, isLoading } = useGetOrderByIdQuery(params.id);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateStatus({ 
        id: params.id, 
        status,
        trackingNumber: 'TRACK123'
      }).unwrap();
      // Order automatically refetches and updates!
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Order #{order?.data.order.orderNumber}</h1>
      <button 
        onClick={() => handleStatusUpdate('shipped')}
        disabled={isUpdating}
      >
        Mark as Shipped
      </button>
    </div>
  );
}
```

---

## Performance Improvements

### Before (Redux Toolkit + Thunks)
- Manual cache management
- Manual loading states
- Manual error handling
- Need to dispatch actions everywhere
- No automatic refetching
- **~500 lines of slice code**

### After (RTK Query)
- Automatic caching
- Automatic loading states
- Automatic error handling
- Hooks-based API
- Automatic refetching
- **~200 lines of API code** (60% less code!)

---

## Migration Benefits

✅ **Less Code** - 60% reduction in boilerplate
✅ **Better Performance** - Automatic caching and deduplication
✅ **Type Safety** - Full TypeScript support
✅ **Better UX** - Automatic refetching on focus/reconnect
✅ **Easier Testing** - Mock RTK Query hooks
✅ **Developer Experience** - Redux DevTools integration
✅ **No Manual Cleanup** - Automatic cache management

---

## Next Steps

To complete the migration, update the remaining pages:
1. ✅ Auth pages (login) - DONE
2. 🔄 Products pages - IN PROGRESS
3. ⏳ Orders pages
4. ⏳ Customers pages
5. ⏳ Dashboard page

Replace:
```typescript
// Old
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
const dispatch = useAppDispatch();
dispatch(fetchProducts());

// New
import { useGetProductsQuery } from '@/store/api/productsApi';
const { data, isLoading } = useGetProductsQuery();
```

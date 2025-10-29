import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    credentials: 'include', // Important for cookie-based auth
  }),
  tagTypes: ['Products', 'Product', 'Categories', 'Category', 'Cart', 'Wishlist', 'Orders', 'User', 'Reviews'],
  endpoints: () => ({}),
});

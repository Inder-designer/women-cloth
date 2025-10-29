import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define base query with credentials
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  credentials: 'include', // Send cookies with requests
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Create base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Products', 'Product', 'Orders', 'Order', 'Customers', 'Categories', 'Category'],
  endpoints: () => ({}),
});

export default baseApi;

import { baseApi } from './baseApi';

// Cart item interface
export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: { url: string; alt: string }[];
    stock: number;
    inStock: boolean;
  };
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

// Cart interface
export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Cart API endpoints
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user cart
    getCart: builder.query<Cart, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
      transformResponse: (response: { data: Cart }) => response.data,
    }),

    // Add item to cart
    addToCart: builder.mutation<
      Cart,
      { productId: string; quantity: number; size?: string; color?: string }
    >({
      query: (data) => ({
        url: '/cart/items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
      transformResponse: (response: { data: Cart }) => response.data,
    }),

    // Update cart item quantity
    updateCartItem: builder.mutation<
      Cart,
      { itemId: string; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `/cart/items/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
      transformResponse: (response: { data: Cart }) => response.data,
    }),

    // Remove item from cart
    removeFromCart: builder.mutation<Cart, string>({
      query: (itemId) => ({
        url: `/cart/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
      transformResponse: (response: { data: Cart }) => response.data,
    }),

    // Clear entire cart
    clearCart: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/cart/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

// Export hooks
export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;

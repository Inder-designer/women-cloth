import { baseApi } from './baseApi';

// Wishlist item interface
export interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: { url: string; alt: string }[];
    inStock: boolean;
    rating: {
      average: number;
      count: number;
    };
  };
  addedAt: string;
}

// Wishlist interface
export interface Wishlist {
  _id: string;
  user: string;
  products: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

// Wishlist API endpoints
export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user wishlist
    getWishlist: builder.query<Wishlist, void>({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
      transformResponse: (response: { data: Wishlist }) => response.data,
    }),

    // Add item to wishlist
    addToWishlist: builder.mutation<Wishlist, { productId: string }>({
      query: (data) => ({
        url: '/wishlist',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wishlist'],
      transformResponse: (response: { data: Wishlist }) => response.data,
    }),

    // Remove item from wishlist
    removeFromWishlist: builder.mutation<Wishlist, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
      transformResponse: (response: { data: Wishlist }) => response.data,
    }),

    // Clear entire wishlist
    clearWishlist: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/wishlist/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
      transformResponse: (response: { data: { message: string } }) => response.data,
    }),

    // Check if product is in wishlist
    isInWishlist: builder.query<{ inWishlist: boolean }, string>({
      query: (productId) => `/wishlist/check/${productId}`,
      providesTags: ['Wishlist'],
      transformResponse: (response: { data: { inWishlist: boolean } }) => response.data,
    }),
  }),
});

// Export hooks
export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
  useIsInWishlistQuery,
} = wishlistApi;

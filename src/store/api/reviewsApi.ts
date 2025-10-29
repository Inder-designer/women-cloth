import { baseApi } from './baseApi';

// Review interface
export interface Review {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

// Reviews API endpoints
export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get product reviews
    getProductReviews: builder.query<
      {
        reviews: Review[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalReviews: number;
          limit: number;
        };
        stats: {
          averageRating: number;
          totalReviews: number;
          ratingDistribution: { rating: number; count: number; percentage: number }[];
        };
      },
      { productId: string; page?: number; limit?: number; sort?: string }
    >({
      query: ({ productId, page = 1, limit = 10, sort = '-createdAt' }) => 
        `/reviews/product/${productId}?page=${page}&limit=${limit}&sort=${sort}`,
      providesTags: (result, error, { productId }) => [{ type: 'Reviews', id: productId }],
    }),

    // Create review
    createReview: builder.mutation<
      Review,
      { productId: string; rating: number; title: string; comment: string }
    >({
      query: ({ productId, ...data }) => ({
        url: `/reviews/product/${productId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Reviews', id: productId },
        { type: 'Product', id: productId },
      ],
    }),

    // Update review
    updateReview: builder.mutation<
      Review,
      { reviewId: string; rating?: number; title?: string; comment?: string }
    >({
      query: ({ reviewId, ...data }) => ({
        url: `/reviews/${reviewId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Reviews'],
    }),

    // Delete review
    deleteReview: builder.mutation<{ message: string }, string>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),

    // Mark review as helpful
    markReviewHelpful: builder.mutation<Review, string>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/helpful`,
        method: 'POST',
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
});

// Export hooks
export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
} = reviewsApi;

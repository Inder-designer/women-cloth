import { baseApi } from './baseApi';

// Category interface
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  order: number;
  isActive: boolean;
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Categories API endpoints
export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getAllCategories: builder.query<Category[], { isActive?: boolean }>({
      query: ({ isActive = true }) => `/categories?isActive=${isActive}`,
      providesTags: ['Categories'],
    }),

    // Get category by slug
    getCategoryBySlug: builder.query<Category, string>({
      query: (slug) => `/categories/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Category', id: slug }],
    }),

    // Get category tree (with subcategories)
    getCategoryTree: builder.query<Category[], void>({
      query: () => '/categories/tree',
      providesTags: ['Categories'],
    }),
  }),
});

// Export hooks
export const {
  useGetAllCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetCategoryTreeQuery,
} = categoriesApi;

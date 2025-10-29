import { baseApi } from './baseApi';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: string;
  parent?: string | null;
  isActive?: boolean;
  order?: number;
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getAllCategories: builder.query<{ success: boolean; data: { categories: Category[] } }, void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),

    // Get category by slug
    getCategoryBySlug: builder.query<{ success: boolean; data: { category: Category } }, string>({
      query: (slug) => `/categories/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Category', id: slug }],
    }),

    // Create category
    createCategory: builder.mutation<{ success: boolean; message: string; data: { category: Category } }, CreateCategoryRequest>({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Categories'],
    }),

    // Update category
    updateCategory: builder.mutation<{ success: boolean; message: string; data: { category: Category } }, { id: string; data: Partial<CreateCategoryRequest> }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),

    // Delete category
    deleteCategory: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;

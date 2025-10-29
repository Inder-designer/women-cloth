import { baseApi } from './baseApi';

// Product interface
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  images: {
    url: string;
    publicId: string;
    alt: string;
  }[];
  sizes: string[];
  colors: string[];
  stock: number;
  inStock: boolean;
  featured: boolean;
  isActive: boolean;
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  views: number;
  sold: number;
  createdAt: string;
  updatedAt: string;
}

// Query parameters interface
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  featured?: boolean;
  sort?: string;
}

// Backend response interface
interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface SingleProductResponse {
  success: boolean;
  data: Product;
}

// Products API endpoints
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with filters
    getAllProducts: builder.query<
      {
        products: Product[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      },
      ProductQueryParams
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('category', params.category);
        if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
        if (params.sizes) params.sizes.forEach(size => queryParams.append('sizes', size));
        if (params.colors) params.colors.forEach(color => queryParams.append('colors', color));
        if (params.inStock !== undefined) queryParams.append('inStock', params.inStock.toString());
        if (params.featured !== undefined) queryParams.append('featured', params.featured.toString());
        if (params.sort) queryParams.append('sort', params.sort);

        return `/products?${queryParams.toString()}`;
      },
      transformResponse: (response: ProductsResponse) => response.data,
      providesTags: (result) => 
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Product' as const, id: _id })),
              { type: 'Products' as const },
            ]
          : [{ type: 'Products' as const }],
    }),

    // Get product by ID
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: SingleProductResponse) => response.data,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Get featured products
    getFeaturedProducts: builder.query<Product[], { limit?: number }>({
      query: ({ limit = 8 }) => `/products?featured=true&limit=${limit}`,
      transformResponse: (response: ProductsResponse) => response.data.products,
      providesTags: ['Products'],
    }),

    // Get related products
    getRelatedProducts: builder.query<Product[], { categoryId: string; productId: string; limit?: number }>({
      query: ({ categoryId, productId, limit = 4 }) => 
        `/products?category=${categoryId}&limit=${limit}`,
      transformResponse: (response: ProductsResponse, meta, arg) => 
        response.data.products.filter(product => product._id !== arg.productId),
      providesTags: ['Products'],
    }),
  }),
});

// Export hooks
export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetRelatedProductsQuery,
} = productsApi;

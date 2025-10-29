import { Product as BackendProduct } from '@/store/api/productsApi';

// Frontend product interface (matching local data structure)
export interface FrontendProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stock: number;
  featured?: boolean;
  tags?: string[];
}

// Transform backend product to frontend format
export const transformProduct = (backendProduct: BackendProduct): FrontendProduct => {
  return {
    id: backendProduct._id,
    name: backendProduct.name,
    category: typeof backendProduct.category === 'string' 
      ? backendProduct.category 
      : backendProduct.category.name,
    price: backendProduct.price,
    originalPrice: backendProduct.comparePrice,
    image: backendProduct.images?.[0]?.url || '/placeholder-product.jpg',
    images: backendProduct.images?.map(img => img.url) || [],
    rating: backendProduct.rating?.average || 0,
    reviews: backendProduct.rating?.count || 0,
    description: backendProduct.description,
    sizes: backendProduct.sizes || [],
    colors: backendProduct.colors || [],
    inStock: backendProduct.inStock,
    stock: backendProduct.stock,
    featured: backendProduct.featured,
    tags: backendProduct.tags || [],
  };
};

// Transform array of products
export const transformProducts = (backendProducts: BackendProduct[]): FrontendProduct[] => {
  return backendProducts.map(transformProduct);
};

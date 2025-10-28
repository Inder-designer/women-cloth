'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, 1, product.sizes[0], product.colors[0]);
  };

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="flex flex-col md:flex-row">
          <Link href={`/product/${product.id}`} className="md:w-64 shrink-0">
            <div className="relative h-64 md:h-full overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {product.originalPrice && (
                <div className="absolute top-4 left-4 bg-[#D32F2F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <Link href={`/product/${product.id}`}>
                <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide">{product.category}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-[#D32F2F] transition font-playfair">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Available Sizes</p>
                  <div className="flex gap-2">
                    {product.sizes.slice(0, 4).map((size) => (
                      <span key={size} className="px-2 py-1 border border-gray-300 rounded text-xs font-semibold">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Colors</p>
                  <div className="flex gap-2">
                    {product.colors.slice(0, 4).map((color) => (
                      <span key={color} className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="text-3xl font-bold text-[#D32F2F]">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through ml-3">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleWishlistToggle}
                  className="p-3 border-2 border-gray-300 rounded-md hover:border-[#D32F2F] transition group/btn"
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill={inWishlist ? '#D32F2F' : 'none'}
                    viewBox="0 0 24 24"
                    stroke={inWishlist ? '#D32F2F' : 'currentColor'}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-8 py-3 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] transition font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout (Default)
  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-[#D32F2F] text-white px-2 py-1 rounded-full text-xs font-semibold">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill={inWishlist ? '#D32F2F' : 'none'}
          viewBox="0 0 24 24"
          stroke={inWishlist ? '#D32F2F' : 'currentColor'}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <div className="p-3">
        <Link href={`/product/${product.id}`}>
          <p className="text-xs text-gray-500 mb-1 capitalize">{product.category}</p>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 hover:text-[#D32F2F] transition line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-lg font-bold text-[#D32F2F]">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-[#D32F2F] text-white py-2 rounded-md hover:bg-[#B71C1C] transition font-semibold text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

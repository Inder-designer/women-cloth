'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Product } from '@/types';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAddToCartMutation } from '@/store/api/cartApi';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetWishlistQuery } from '@/store/api/wishlistApi';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthContext();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();
  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated, // Only fetch if authenticated
  });

  // Variant selection state
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [showVariantSelector, setShowVariantSelector] = useState<boolean>(false);

  console.log(product);

  // Get available sizes (if variants exist)
  const getAvailableSizes = () => {
    if (!product.variants || product.variants.length === 0) {
      return product.sizes || [];
    }
    const availableSizes = product.variants
      .filter(v => v.stock > 0)
      .map(v => v.size);
    return [...new Set(availableSizes)];
  };

  // Get current variant stock
  const getCurrentVariantStock = () => {
    if (!product.variants || product.variants.length === 0) {
      return product.inStock;
    }
    const variant = product.variants.find(v => v.size === selectedSize);
    return variant ? variant.stock > 0 : false;
  };

  // Get display price (first variant price if variants exist, else product price)
  const getDisplayPrice = () => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].price || product.price;
    }
    return product.price;
  };

  // Get variant price by size
  const getVariantPrice = (size: string) => {
    if (!product.variants || product.variants.length === 0) {
      return product.price;
    }
    const variant = product.variants.find(v => v.size === size);
    return variant ? variant.price || product.price : product.price;
  };

  // Check if product is in wishlist
  // Wishlist products are backend format with _id, product might be frontend format with id
  const productId = (product as any)._id || product.id;
  const inWishlist = wishlist?.products?.some((item: any) => {
    // item is a populated Product from backend with _id
    const itemId = item._id || item.id;
    return itemId === productId;
  }) || false;

  const handleWishlistToggle = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }

    try {
      if (inWishlist) {
        await removeFromWishlist(productId).unwrap();
      } else {
        await addToWishlist({ productId }).unwrap();
      }
    } catch (err) {
      console.error('Failed to update wishlist:', err);
    }
  };

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }

    // Check if variant is available
    if (!getCurrentVariantStock()) {
      alert('This variant is currently out of stock. Please select another size.');
      return;
    }

    try {
      await addToCart({
        productId,
        quantity: 1,
        size: selectedSize,
      }).unwrap();
      // Hide variant selector after adding to cart
      setShowVariantSelector(false);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleQuickAdd = () => {
    // Always show variant selector if product has multiple sizes
    if (product.sizes && product.sizes.length > 1) {
      setShowVariantSelector(true);
    } else {
      // If only one size or no sizes, add directly
      handleAddToCart();
    }
  };

  const availableSizes = getAvailableSizes();
  const isVariantInStock = getCurrentVariantStock();

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
                <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide">{product.category.name}</p>
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
                    {product.sizes.length > 4 && (
                      <span className="px-2 py-1 text-xs text-gray-500">+{product.sizes.length - 4} more</span>
                    )}
                  </div>
                </div>
                {product.color && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Color</p>
                    <p className="text-sm font-medium text-gray-800">{product.color}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Variant Selector Modal for List View */}
              {showVariantSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowVariantSelector(false)}>
                  <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Select Size</h3>
                      <button
                        onClick={() => setShowVariantSelector(false)}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex gap-4 mb-4 pb-4 border-b">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.category.name}</p>
                        <p className="text-lg font-bold text-[#D32F2F] mt-1">
                          ${selectedSize ? getVariantPrice(selectedSize) : getDisplayPrice()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">Choose Size:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {product.sizes.map((size) => {
                          const isAvailable = availableSizes.includes(size);
                          const variantPrice = getVariantPrice(size);
                          return (
                            <button
                              key={size}
                              onClick={() => isAvailable && setSelectedSize(size)}
                              disabled={!isAvailable}
                              className={`px-4 py-3 border-2 rounded-lg text-sm font-semibold transition ${selectedSize === size
                                  ? 'border-[#D32F2F] bg-[#D32F2F] text-white shadow-md'
                                  : isAvailable
                                    ? 'border-gray-300 hover:border-[#D32F2F] hover:shadow-sm'
                                    : 'border-gray-200 text-gray-400 cursor-not-allowed line-through bg-gray-50'
                                }`}
                            >
                              <div>{size}</div>
                              <div className="text-xs mt-1">${variantPrice}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {!isVariantInStock && selectedSize && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-medium">⚠️ This size is currently out of stock</p>
                      </div>
                    )}

                    {isVariantInStock && selectedSize && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 font-medium">✓ In Stock</p>
                      </div>
                    )}

                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || !selectedSize || !isVariantInStock}
                      className="w-full bg-[#D32F2F] text-white py-3 rounded-lg hover:bg-[#B71C1C] transition font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAddingToCart ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Adding to Cart...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="text-3xl font-bold text-[#D32F2F]">${getDisplayPrice()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through ml-3">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleWishlistToggle}
                  disabled={isAddingToWishlist || isRemovingFromWishlist}
                  className="p-3 border-2 border-gray-300 rounded-md hover:border-[#D32F2F] transition group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isAddingToWishlist || isRemovingFromWishlist ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D32F2F] border-t-transparent"></div>
                  ) : (
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
                  )}
                </button>
                <button
                  onClick={handleQuickAdd}
                  disabled={isAddingToCart || !product.inStock}
                  className="px-8 py-3 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
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
              {Math.round((1 - getDisplayPrice() / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={isAddingToWishlist || isRemovingFromWishlist}
        className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAddingToWishlist || isRemovingFromWishlist ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#D32F2F] border-t-transparent"></div>
        ) : (
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
        )}
      </button>

      <div className="p-3">
        <Link href={`/product/${product.id}`}>
          <p className="text-xs text-gray-500 mb-1 capitalize">{product.category.name}</p>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 hover:text-[#D32F2F] transition line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Color Display */}
        {product.color && (
          <div className="mb-2">
            <span className="text-xs text-gray-600">Color: </span>
            <span className="text-xs font-medium text-gray-800">{product.color}</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-lg font-bold text-[#D32F2F]">${getDisplayPrice()}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <span className={`text-xs font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Variant Selector Modal for Grid View */}
        {showVariantSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowVariantSelector(false)}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Select Size</h3>
                <button
                  onClick={() => setShowVariantSelector(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="flex gap-4 mb-4 pb-4 border-b">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.category.name}</p>
                  <p className="text-lg font-bold text-[#D32F2F] mt-1">
                    ${selectedSize ? getVariantPrice(selectedSize) : getDisplayPrice()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Choose Size:</label>
                <div className="grid grid-cols-3 gap-2">
                  {product.variants?.map((variant) => {
                    const isAvailable = availableSizes.includes(variant.size);
                    const variantPrice = getVariantPrice(variant.size);
                    return (
                      <button
                        key={variant.size}
                        onClick={() => isAvailable && setSelectedSize(variant.size)}
                        disabled={!isAvailable}
                        className={`px-4 py-3 border-2 rounded-lg text-sm font-semibold transition ${selectedSize === variant.size
                            ? 'border-[#D32F2F] bg-[#D32F2F] text-white shadow-md'
                            : isAvailable
                              ? 'border-gray-300 hover:border-[#D32F2F] hover:shadow-sm'
                              : 'border-gray-200 text-gray-400 cursor-not-allowed line-through bg-gray-50'
                          }`}
                      >
                        <div>{variant.size}</div>
                        <div className="text-xs mt-1">${variantPrice}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isVariantInStock && selectedSize && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">⚠️ This size is currently out of stock</p>
                </div>
              )}

              {isVariantInStock && selectedSize && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">✓ In Stock</p>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !selectedSize || !isVariantInStock}
                className="w-full bg-[#D32F2F] text-white py-3 rounded-lg hover:bg-[#B71C1C] transition font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleQuickAdd}
          disabled={isAddingToCart || !product.inStock}
          className="w-full bg-[#D32F2F] text-white py-2 rounded-md hover:bg-[#B71C1C] transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAddingToCart ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Adding...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

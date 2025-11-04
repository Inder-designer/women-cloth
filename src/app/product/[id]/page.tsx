'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useGetProductByIdQuery, useGetRelatedProductsQuery } from '@/store/api/productsApi';
import { useAddToCartMutation } from '@/store/api/cartApi';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetWishlistQuery } from '@/store/api/wishlistApi';
import { useAuthContext } from '@/contexts/AuthContext';
import { transformProduct, transformProducts } from '@/lib/productHelpers';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { isAuthenticated } = useAuthContext();

  // Fetch product from API
  const { data: productData, isLoading: isLoadingProduct, error: productError } = useGetProductByIdQuery(productId);
  console.log(productData);

  const product = productData ? transformProduct(productData) : null;

  // Fetch related products
  const categoryId = typeof productData?.category.slug === 'string'
    ? productData.category.slug
    : productData?.category?._id || '';

  const { data: relatedData, isLoading: isLoadingRelated } = useGetRelatedProductsQuery(
    {
      categoryId,
      productId: productId,
      limit: 4,
    },
    {
      skip: !productData || !categoryId,
    }
  );
  const relatedProducts = relatedData ? transformProducts(relatedData) : [];

  // API Mutations
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();
  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [showNotification, setShowNotification] = useState(false);

  // Check if product is in wishlist
  const productIdToCheck = (productData as any)?._id || productId;
  const isInWishlist = wishlist?.products?.some((item: any) => {
    const itemId = item._id || item.id;
    return itemId === productIdToCheck;
  }) || false;

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or not found
  if (productError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">Product Not Found</h1>
          <p className="text-gray-600 mb-6 text-sm">The product you're looking for doesn't exist.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#a90202] text-white px-6 py-2 rounded-md hover:bg-[#8a0101] transition text-sm font-semibold"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push(`/auth/login?returnUrl=${encodeURIComponent(`/product/${productId}`)}`);
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    try {
      await addToCart({
        productId: productIdToCheck,
        quantity,
        size: selectedSize,
        color: selectedColor,
      }).unwrap();

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const toggleWishlist = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push(`/auth/login?returnUrl=${encodeURIComponent(`/product/${productId}`)}`);
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(productIdToCheck).unwrap();
      } else {
        await addToWishlist({ productId: productIdToCheck }).unwrap();
      }
    } catch (err) {
      console.error('Failed to update wishlist:', err);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  console.log(product);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-600">
            <Link href="/" className="hover:text-[#a90202] transition">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#a90202] transition">Shop</Link>
            {product.parentCategory.name && (
              <>
                <span>/</span>
                <Link href={`/shop?category=${product.parentCategory.slug}`} className="hover:text-[#a90202] transition capitalize">
                  {product.parentCategory.name}
                </Link>
              </>
            )}
            <span>/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#a90202] transition capitalize">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-sm">Added to cart!</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-[#a90202] text-white px-3 py-1 rounded-full text-xs font-bold">
                  -{discount}%
                </div>
              )}
              {!product.inStock && (
                <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="text-xs text-[#a90202] font-semibold uppercase tracking-wider hover:underline"
              >
                {product.category.name}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2 font-playfair">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-[#a90202]">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">In Stock</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Size
              </label>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 border rounded-md text-sm font-semibold transition ${selectedSize === size
                      ? 'bg-[#a90202] text-white border-[#a90202]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#a90202]'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md text-sm font-semibold transition ${selectedColor === color
                      ? 'bg-[#a90202] text-white border-[#a90202]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#a90202]'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition"
                  disabled={!product.inStock}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[#a90202] text-sm"
                  disabled={!product.inStock}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition"
                  disabled={!product.inStock}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className="flex-1 bg-[#a90202] text-white py-3 rounded-md font-semibold hover:bg-[#8a0101] transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>
              <button
                onClick={toggleWishlist}
                disabled={isAddingToWishlist || isRemovingFromWishlist}
                className={`px-4 py-3 border-2 rounded-md font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${isInWishlist
                  ? 'bg-[#a90202] border-[#a90202] text-white'
                  : 'border-gray-300 text-gray-700 hover:border-[#a90202] hover:text-[#a90202]'
                  }`}
              >
                <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5 text-[#a90202]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5 text-[#a90202]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>30-day returns & exchanges</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5 text-[#a90202]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure checkout & payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-md mb-12">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 text-sm font-semibold transition border-b-2 ${activeTab === 'description'
                  ? 'border-[#a90202] text-[#a90202]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-3 text-sm font-semibold transition border-b-2 ${activeTab === 'details'
                  ? 'border-[#a90202] text-[#a90202]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 text-sm font-semibold transition border-b-2 ${activeTab === 'reviews'
                  ? 'border-[#a90202] text-[#a90202]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Reviews (4.8)
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  This premium quality product is crafted with attention to detail and designed to provide both style and comfort.
                  Perfect for various occasions, it combines modern aesthetics with practical functionality.
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-4 space-y-1">
                  <li>Premium quality materials</li>
                  <li>Comfortable and breathable fabric</li>
                  <li>Easy to care for and maintain</li>
                  <li>Available in multiple sizes and colors</li>
                  <li>Perfect fit and elegant design</li>
                </ul>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Product Information</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Category:</dt>
                      <dd className="font-medium text-gray-900">{product.category.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">SKU:</dt>
                      <dd className="font-medium text-gray-900">WF-{product.id.padStart(5, '0')}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Available Sizes:</dt>
                      <dd className="font-medium text-gray-900">{product.sizes.join(', ')}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Available Colors:</dt>
                      <dd className="font-medium text-gray-900">{product.colors.join(', ')}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Care Instructions</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-[#a90202] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Machine wash cold with similar colors
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-[#a90202] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Do not bleach
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-[#a90202] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Tumble dry low or hang to dry
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-[#a90202] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Iron on low heat if needed
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-gray-900">4.8</span>
                      <span className="text-sm text-gray-600">(128 reviews)</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#a90202] text-white rounded-md hover:bg-[#8a0101] transition text-sm font-semibold">
                    Write a Review
                  </button>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[
                    { name: 'Sarah M.', rating: 5, date: '2 weeks ago', comment: 'Absolutely love this! The quality is amazing and fits perfectly. Highly recommend!' },
                    { name: 'Jessica L.', rating: 5, date: '1 month ago', comment: 'Great product! Exactly as described. Fast shipping and excellent customer service.' },
                    { name: 'Emily R.', rating: 4, date: '1 month ago', comment: 'Very nice quality. The color is slightly different from the photo but still beautiful.' },
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-yellow-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {isLoadingRelated ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">You May Also Like</h2>
              <Link href={`/shop?category=${product.category.name}`} className="text-sm text-[#a90202] font-semibold hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} viewMode="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

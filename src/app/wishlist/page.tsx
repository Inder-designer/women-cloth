'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const handleMoveToCart = (item: any) => {
    setSelectedProduct(item.product);
    setSelectedSize(item.product.sizes[0] || '');
    setSelectedColor(item.product.colors[0] || '');
    setShowModal(true);
  };

  const confirmMoveToCart = () => {
    if (selectedProduct && selectedSize && selectedColor) {
      addToCart(selectedProduct, 1, selectedSize, selectedColor);
      removeFromWishlist(selectedProduct.id);
      setShowModal(false);
      setSelectedProduct(null);
      setSelectedSize('');
      setSelectedColor('');
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding items you love to your wishlist
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#D32F2F] text-white px-6 py-3 rounded-md hover:bg-[#B71C1C] transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Wishlist ({wishlistItems.length} items)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                //   fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(item.product.id)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#D32F2F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <Link href={`/product/${item.product.id}`}>
                  <p className="text-sm text-gray-500 mb-1">{item.product.category}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-[#D32F2F] transition">
                    {item.product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-bold text-[#D32F2F]">
                      ${item.product.price}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${item.product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full bg-[#D32F2F] text-white py-2 rounded-md hover:bg-[#B71C1C] transition font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Size & Color Selection */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-playfair">Select Options</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedProduct.name}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Size
              </label>
              <div className="grid grid-cols-6 gap-2">
                {selectedProduct.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 border rounded-md text-sm font-semibold transition ${
                      selectedSize === size
                        ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#D32F2F]'
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
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md text-sm font-semibold transition ${
                      selectedColor === color
                        ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#D32F2F]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmMoveToCart}
                className="flex-1 px-4 py-2 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] transition font-semibold"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

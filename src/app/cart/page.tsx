'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { addToWishlist } = useWishlist();

  const handleMoveToWishlist = (item: any) => {
    addToWishlist(item.product);
    removeFromCart(item.product.id);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some items to your cart to get started
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex flex-col sm:flex-row gap-4 p-6 border-b last:border-b-0"
                >
                  <div className="relative w-full sm:w-32 h-32 shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1">
                    <Link href={`/product/${item.product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-[#D32F2F] transition">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                    </div>
                    <p className="text-lg font-bold text-[#D32F2F] mt-2">
                      ${item.product.price}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition group"
                        title="Move to Wishlist"
                      >
                        <svg
                          className="h-5 w-5 text-gray-600 group-hover:text-[#D32F2F] transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 border border-gray-300 rounded-md hover:bg-red-50 transition group"
                        title="Remove"
                      >
                        <svg
                          className="h-5 w-5 text-gray-600 group-hover:text-red-600 transition"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#D32F2F]">
                    ${(getCartTotal() * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout/payment"
                className="block w-full bg-[#D32F2F] text-white text-center py-3 rounded-md hover:bg-[#B71C1C] transition font-semibold"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="block w-full text-center text-[#D32F2F] py-3 mt-3 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

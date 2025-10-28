'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Get pending order and save to orders
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (pendingOrder) {
      const order = JSON.parse(pendingOrder);
      const orderId = 'ORD-' + Date.now();
      const newOrder = {
        id: orderId,
        ...order,
        status: 'processing',
        orderDate: new Date().toISOString(),
      };

      // Save to orders history
      const existingOrders = localStorage.getItem('orders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.unshift(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.removeItem('pendingOrder');
    }

    // Clear the cart
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order Number</p>
          <p className="text-lg font-bold text-[#D32F2F]">
            ORD-{Date.now()}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full bg-[#D32F2F] text-white py-3 rounded-md hover:bg-[#B71C1C] transition font-semibold"
          >
            View Order Details
          </Link>
          
          <Link
            href="/"
            className="block w-full border border-[#D32F2F] text-[#D32F2F] py-3 rounded-md hover:bg-[#D32F2F] hover:text-white transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          <p>You will receive an email confirmation shortly.</p>
        </div>
      </div>
    </div>
  );
}

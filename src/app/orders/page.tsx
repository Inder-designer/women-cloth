'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#D32F2F] text-white px-6 py-3 rounded-md hover:bg-[#B71C1C] transition"
            >
              Start Shopping
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
          My Orders ({orders.length})
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-[#D32F2F] hover:text-[#B71C1C] font-semibold"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Shipping Address
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Order Summary
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.items.length} item(s)</p>
                      <p className="text-lg font-bold text-[#D32F2F]">
                        Total: ${order.totalAmount.toFixed(2)}
                      </p>
                      <p>Payment: {order.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Items</h4>
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#D32F2F] rounded-full"></div>
                        <span className="text-gray-900">{item.product.name}</span>
                        <span className="text-gray-600">×{item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-gray-500 ml-5">
                        +{order.items.length - 3} more item(s)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

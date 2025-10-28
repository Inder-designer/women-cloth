'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types';

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders: Order[] = JSON.parse(savedOrders);
      const foundOrder = orders.find((o) => o.id === params.id);
      setOrder(foundOrder || null);
    }
  }, [params.id]);

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Order not found
            </h2>
            <Link
              href="/orders"
              className="inline-block text-[#a90202] hover:text-[#8a0101] font-semibold"
            >
              ← Back to orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center text-[#a90202] hover:text-[#8a0101] font-semibold"
          >
            ← Back to orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Order Header */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order.id}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Order Progress */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Progress
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.status === 'processing' ||
                        order.status === 'shipped' ||
                        order.status === 'delivered'
                          ? 'bg-[#a90202] text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      ✓
                    </div>
                    <div
                      className={`flex-1 h-1 ${
                        order.status === 'shipped' || order.status === 'delivered'
                          ? 'bg-[#a90202]'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    Order Placed
                  </p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.status === 'shipped' || order.status === 'delivered'
                          ? 'bg-[#a90202] text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      ✓
                    </div>
                    <div
                      className={`flex-1 h-1 ${
                        order.status === 'delivered' ? 'bg-[#a90202]' : 'bg-gray-300'
                      }`}
                    ></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">Shipped</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.status === 'delivered'
                          ? 'bg-[#a90202] text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    Delivered
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="relative w-full sm:w-24 h-24 shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.product.category}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#a90202]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary and Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Shipping Address
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 font-medium">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-gray-600 mt-2">
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${(order.totalAmount / 1.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(order.totalAmount - order.totalAmount / 1.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#a90202]">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 text-sm text-gray-600">
                    <p>Payment Method: {order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-[#a90202] text-white py-3 rounded-md hover:bg-[#8a0101] transition font-semibold">
                Track Order
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition font-semibold">
                Download Invoice
              </button>
              {order.status === 'delivered' && (
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition font-semibold">
                  Return Items
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

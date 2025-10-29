'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrderById, updateOrderStatus, clearCurrentOrder } from '@/store/slices/ordersSlice';
import ProtectedRoute from '@/middleware/ProtectedRoute';

function OrderDetailsContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentOrder: order, loading } = useAppSelector((state) => state.orders);

  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    dispatch(fetchOrderById(params.id));

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, params.id]);

  useEffect(() => {
    if (order) {
      setNewStatus(order.orderStatus);
      setTrackingNumber(order.trackingNumber || '');
    }
  }, [order]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await dispatch(
        updateOrderStatus({
          id: params.id,
          orderStatus: newStatus,
          trackingNumber: trackingNumber || undefined,
        })
      ).unwrap();
      alert('Order status updated successfully');
    } catch (error: any) {
      alert(error || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="text-[#D32F2F] hover:text-[#B71C1C] mb-4 inline-block"
          >
            ← Back to Orders
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#D32F2F]">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Placed on</p>
              <p className="text-lg font-semibold">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-[#FFD700]"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.size && <span>Size: {item.size} </span>}
                        {item.color && <span>• Color: {item.color}</span>}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.price)}</p>
                      <p className="text-sm text-gray-600">
                        Total: {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="text-gray-700">
                <p className="font-semibold">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.pincode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">
                  <span className="text-gray-600">Phone:</span> {order.shippingAddress.phone}
                </p>
                <p>
                  <span className="text-gray-600">Email:</span> {order.shippingAddress.email}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="text-gray-700">
                <p className="font-semibold">
                  {order.user.firstName} {order.user.lastName}
                </p>
                <p>{order.user.email}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (18% GST):</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-[#D32F2F]">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold uppercase">{order.paymentMethod}</p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">Payment Status</p>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    order.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F]"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-[#D32F2F] text-white py-2 rounded-lg hover:bg-[#B71C1C] transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </form>

              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Current Tracking Number</p>
                  <p className="font-mono text-sm mt-1">{order.trackingNumber}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            {(order.deliveredAt || order.cancelledAt) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Timeline</h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  {order.deliveredAt && (
                    <div>
                      <span className="text-gray-600">Delivered:</span>
                      <p className="font-medium">{formatDate(order.deliveredAt)}</p>
                    </div>
                  )}
                  {order.cancelledAt && (
                    <div>
                      <span className="text-gray-600">Cancelled:</span>
                      <p className="font-medium">{formatDate(order.cancelledAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <OrderDetailsContent params={params} />
    </ProtectedRoute>
  );
}

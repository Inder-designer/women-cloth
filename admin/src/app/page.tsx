'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#D32F2F]">ਸੁਰਖ਼-ਏ-ਪੰਜਾਬ</h1>
            <p className="text-sm text-gray-600">Surkh-E-Punjab Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Welcome, <span className="font-semibold">{user.firstName}</span>
            </span>
            <Link
              href="/logout"
              className="bg-[#D32F2F] text-white px-4 py-2 rounded-lg hover:bg-[#B71C1C] transition-colors"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your e-commerce store</p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products */}
          <Link
            href="/products"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[#D32F2F]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Products</h3>
                <p className="text-gray-600 mt-2">Manage product inventory</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
            <div className="mt-4">
              <span className="text-[#D32F2F] font-semibold hover:underline">
                View All →
              </span>
            </div>
          </Link>

          {/* Orders */}
          <Link
            href="/orders"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[#8B4513]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Orders</h3>
                <p className="text-gray-600 mt-2">Track customer orders</p>
              </div>
              <div className="text-4xl">🛍️</div>
            </div>
            <div className="mt-4">
              <span className="text-[#8B4513] font-semibold hover:underline">
                View All →
              </span>
            </div>
          </Link>

          {/* Customers */}
          <Link
            href="/customers"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[#FFD700]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Customers</h3>
                <p className="text-gray-600 mt-2">View customer list</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <div className="mt-4">
              <span className="text-[#8B4513] font-semibold hover:underline">
                View All →
              </span>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Admin Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h4 className="font-semibold text-gray-800">Product Management</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Create, edit, and delete products with image uploads
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <h4 className="font-semibold text-gray-800">Order Tracking</h4>
                <p className="text-gray-600 text-sm mt-1">
                  View and update order statuses with tracking numbers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">👨‍💼</div>
              <div>
                <h4 className="font-semibold text-gray-800">Customer Management</h4>
                <p className="text-gray-600 text-sm mt-1">
                  View all customers and their account details
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔐</div>
              <div>
                <h4 className="font-semibold text-gray-800">Secure Authentication</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Cookie-based Passport authentication with session management
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

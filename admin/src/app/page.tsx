'use client';

import Link from 'next/link';
import ProtectedRoute from '@/middleware/ProtectedRoute';

function DashboardContent() {
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your e-commerce store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#D32F2F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Products</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">0</h3>
              <p className="text-sm text-green-600 mt-2">Coming soon</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#8B4513]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Orders</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">0</h3>
              <p className="text-sm text-green-600 mt-2">Coming soon</p>
            </div>
            <div className="text-4xl">🛍️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#FFD700]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">₹0</h3>
              <p className="text-sm text-green-600 mt-2">Coming soon</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Customers</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">0</h3>
              <p className="text-sm text-green-600 mt-2">Coming soon</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Products */}
        <Link
          href="/products"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-[#D32F2F] group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Products</h3>
              <p className="text-gray-600 mt-2">Manage product inventory</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
          <div className="mt-4">
            <span className="text-[#D32F2F] font-semibold group-hover:underline">
              View All →
            </span>
          </div>
        </Link>

        {/* Categories */}
        <Link
          href="/categories"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-purple-500 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Categories</h3>
              <p className="text-gray-600 mt-2">Organize products</p>
            </div>
            <div className="text-4xl">📂</div>
          </div>
          <div className="mt-4">
            <span className="text-purple-600 font-semibold group-hover:underline">
              View All →
            </span>
          </div>
        </Link>

        {/* Orders */}
        <Link
          href="/orders"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-[#8B4513] group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Orders</h3>
              <p className="text-gray-600 mt-2">Track customer orders</p>
            </div>
            <div className="text-4xl">🛍️</div>
          </div>
          <div className="mt-4">
            <span className="text-[#8B4513] font-semibold group-hover:underline">
              View All →
            </span>
          </div>
        </Link>

        {/* Customers */}
        <Link
          href="/customers"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-[#FFD700] group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Customers</h3>
              <p className="text-gray-600 mt-2">View customer list</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
          <div className="mt-4">
            <span className="text-[#8B4513] font-semibold group-hover:underline">
              View All →
            </span>
          </div>
        </Link>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Admin Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

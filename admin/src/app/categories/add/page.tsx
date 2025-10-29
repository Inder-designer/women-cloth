'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateCategoryMutation, useGetAllCategoriesQuery } from '@/store/api/categoriesApi';
import ProtectedRoute from '@/middleware/ProtectedRoute';

function AddCategoryContent() {
  const router = useRouter();
  const [createCategory, { isLoading, error }] = useCreateCategoryMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data?.categories || [];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
    isActive: true,
    order: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const categoryData = {
        name: formData.name,
        description: formData.description || undefined,
        parent: formData.parent || null,
        isActive: formData.isActive,
        order: Number(formData.order),
      };

      await createCategory(categoryData).unwrap();
      router.push('/categories');
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#D32F2F]">Add New Category</h1>
            <p className="text-gray-600 mt-1">Create a new product category</p>
          </div>
          <Link
            href="/categories"
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back to Categories
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
              ? String(error.data.message)
              : 'Failed to create category. Please try again.'}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                placeholder="e.g., Punjabi Suits, Sarees, Kurtis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                placeholder="Brief description of the category..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Category
              </label>
              <select
                name="parent"
                value={formData.parent}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
              >
                <option value="">None (Top Level Category)</option>
                {categories
                  .filter((cat) => !cat.parent) // Only show top-level categories as parent options
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select a parent category to create a subcategory
              </p>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Settings</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
              />
              <p className="text-sm text-gray-500 mt-1">
                Lower numbers appear first (e.g., 0, 1, 2, ...)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-[#D32F2F] border-gray-300 rounded focus:ring-[#D32F2F]"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
              <p className="text-sm text-gray-500">
                (Only active categories are visible on the website)
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#D32F2F] text-white py-3 rounded-lg font-semibold hover:bg-[#B71C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Category...' : 'Create Category'}
            </button>
            <Link
              href="/categories"
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddCategoryPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AddCategoryContent />
    </ProtectedRoute>
  );
}

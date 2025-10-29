'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetAllCategoriesQuery, useUpdateCategoryMutation } from '@/store/api/categoriesApi';
import ProtectedRoute from '@/middleware/ProtectedRoute';

function EditCategoryContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  const [updateCategory, { isLoading: isUpdating, error: updateError }] = useUpdateCategoryMutation();
  
  const categories = categoriesData?.data?.categories || [];
  const category = categories.find(cat => cat._id === params.id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
    isActive: true,
    order: 0,
  });

  // Initialize form with category data
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        parent: category.parent?._id || '',
        isActive: category.isActive !== undefined ? category.isActive : true,
        order: category.order || 0,
      });
    }
  }, [category]);

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

      await updateCategory({ id: params.id, data: categoryData }).unwrap();
      router.push('/categories');
    } catch (err) {
      console.error('Failed to update category:', err);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D32F2F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Category not found</p>
          <Link href="/categories" className="text-[#D32F2F] hover:text-[#B71C1C] underline">
            ← Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#D32F2F]">Edit Category</h1>
            <p className="text-gray-600 mt-1">Update category information</p>
          </div>
          <Link
            href="/categories"
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back to Categories
          </Link>
        </div>

        {/* Error Display */}
        {updateError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {'data' in updateError && updateError.data && typeof updateError.data === 'object' && 'message' in updateError.data
              ? String(updateError.data.message)
              : 'Failed to update category. Please try again.'}
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
                  .filter((cat) => !cat.parent && cat._id !== params.id) // Exclude current category and only show top-level
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
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

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Category Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Slug: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">{category.slug}</span></p>
                  <p className="mt-1">Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                  <p>Last Updated: {new Date(category.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 bg-[#D32F2F] text-white py-3 rounded-lg font-semibold hover:bg-[#B71C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating Category...' : 'Update Category'}
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

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <EditCategoryContent params={params} />
    </ProtectedRoute>
  );
}

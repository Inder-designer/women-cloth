'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateProductMutation } from '@/store/api/productsApi';
import { useGetAllCategoriesQuery } from '@/store/api/categoriesApi';
import ProtectedRoute from '@/middleware/ProtectedRoute';

function AddProductContent() {
    const router = useRouter();
    const [createProduct, { isLoading, error }] = useCreateProductMutation();
    const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
    const categories = categoriesData?.data?.categories || [];

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        stock: '',
        sizes: [] as string[],
        colors: [] as string[],
        tags: '',
        featured: false,
        isActive: true,
    });

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [sizeInput, setSizeInput] = useState('');
    const [colorInput, setColorInput] = useState('');

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const availableColors = [
        { name: 'Red', value: '#FF0000' },
        { name: 'Blue', value: '#0000FF' },
        { name: 'Green', value: '#00FF00' },
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Yellow', value: '#FFFF00' },
        { name: 'Pink', value: '#FFC0CB' },
        { name: 'Purple', value: '#800080' },
        { name: 'Orange', value: '#FFA500' },
        { name: 'Brown', value: '#8B4513' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length + images.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        setImages((prev) => [...prev, ...files]);

        // Create previews
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleSize = (size: string) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size],
        }));
    };

    const toggleColor = (color: string) => {
        setFormData((prev) => ({
            ...prev,
            colors: prev.colors.includes(color)
                ? prev.colors.filter((c) => c !== color)
                : [...prev.colors, color],
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);
        if (formData.originalPrice) submitData.append('originalPrice', formData.originalPrice);
        submitData.append('category', formData.category);
        submitData.append('stock', formData.stock);
        submitData.append('featured', String(formData.featured));
        submitData.append('isActive', String(formData.isActive));

        // Add sizes as JSON array
        submitData.append('sizes', JSON.stringify(formData.sizes));

        // Add colors as JSON array
        submitData.append('colors', JSON.stringify(formData.colors));

        // Add tags as array
        if (formData.tags) {
            const tagsArray = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
            submitData.append('tags', JSON.stringify(tagsArray));
        }

        // Add images
        images.forEach((image) => {
            submitData.append('images', image);
        });

        try {
            console.log('Submitting product data:', submitData);
            await createProduct(submitData).unwrap();
            router.push('/products');
        } catch (err) {
            console.error('Failed to create product:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#D32F2F]">Add New Product</h1>
                        <p className="text-gray-600 mt-1">Create a new product listing</p>
                    </div>
                    <Link
                        href="/products"
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        ← Back to Products
                    </Link>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
                            ? String(error.data.message)
                            : 'Failed to create product. Please try again.'}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                placeholder="e.g., Punjabi Salwar Suit"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                placeholder="Describe the product features, material, and details..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    disabled={categoriesLoading}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20 disabled:bg-gray-100"
                                >
                                    <option value="">
                                        {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.parent ? `${category.parent.name} > ` : ''}{category.name}
                                        </option>
                                    ))}
                                </select>
                                {categories.length === 0 && !categoriesLoading && (
                                    <p className="text-sm text-amber-600 mt-1">
                                        No categories available.{' '}
                                        <Link href="/categories/add" className="underline hover:text-amber-700">
                                            Create one first
                                        </Link>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Pricing</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Compare at Price (₹)
                                </label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                    placeholder="0.00"
                                />
                                <p className="text-sm text-gray-500 mt-1">Original price to show discount</p>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Product Images</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Images * (Max 5)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F]"
                            />
                            <p className="text-sm text-gray-500 mt-1">Upload up to 5 product images</p>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sizes */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Available Sizes</h2>

                        <div className="flex flex-wrap gap-2">
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.sizes.includes(size)
                                            ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#D32F2F]'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Available Colors</h2>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {availableColors.map((color) => (
                                <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => toggleColor(color.name)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${formData.colors.includes(color.name)
                                            ? 'border-[#D32F2F] bg-red-50'
                                            : 'border-gray-300 hover:border-[#D32F2F]'
                                        }`}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-gray-400"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    <span className="text-sm font-medium">{color.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags & Options */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Additional Options</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                placeholder="trending, new arrival, best seller (comma separated)"
                            />
                            <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#D32F2F] border-gray-300 rounded focus:ring-[#D32F2F]"
                                />
                                <span className="text-sm font-medium text-gray-700">Featured Product</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#D32F2F] border-gray-300 rounded focus:ring-[#D32F2F]"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-[#D32F2F] text-white py-3 rounded-lg font-semibold hover:bg-[#B71C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Product...' : 'Create Product'}
                        </button>
                        <Link
                            href="/products"
                            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AddProductPage() {
    return (
        <ProtectedRoute requireAdmin={true}>
            <AddProductContent />
        </ProtectedRoute>
    );
}

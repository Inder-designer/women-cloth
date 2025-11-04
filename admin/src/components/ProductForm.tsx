'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGetAllCategoriesQuery } from '@/store/api/categoriesApi';

interface ProductFormProps {
    mode: 'add' | 'edit';
    productId?: string;
    initialData?: any;
    existingImages?: Array<{ url: string; publicId?: string; alt?: string }>;
    onSubmit: (data: FormData) => Promise<void>;
    isLoading: boolean;
    error: any;
}

export default function ProductForm({
    mode,
    productId,
    initialData,
    existingImages: initialExistingImages = [],
    onSubmit,
    isLoading,
    error
}: ProductFormProps) {
    const router = useRouter();
    const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
    const categories = categoriesData?.data?.categories || [];

    // Variant management state
    const [useVariants, setUseVariants] = useState(false);
    const [variants, setVariants] = useState<Array<{
        size: string;
        stock: number;
        sku: string;
        price?: number;
    }>>([]);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [currentVariant, setCurrentVariant] = useState({
        size: '',
        stock: 0,
        sku: '',
        price: '',
    });
    const [bulkVariantSettings, setBulkVariantSettings] = useState({
        defaultStock: '',
        defaultPrice: '',
    });

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState(initialExistingImages);

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const availableColors = [
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Red', value: '#DC2626' },
        { name: 'Blue', value: '#2563EB' },
        { name: 'Navy', value: '#1E3A8A' },
        { name: 'Green', value: '#16A34A' },
        { name: 'Yellow', value: '#FCD34D' },
        { name: 'Orange', value: '#F97316' },
        { name: 'Pink', value: '#EC4899' },
        { name: 'Purple', value: '#9333EA' },
        { name: 'Brown', value: '#92400E' },
        { name: 'Beige', value: '#D4A574' },
        { name: 'Gray', value: '#6B7280' },
        { name: 'Maroon', value: '#7F1D1D' },
        { name: 'Teal', value: '#0D9488' },
        { name: 'Gold', value: '#CA8A04' },
        { name: 'Silver', value: '#9CA3AF' },
        { name: 'Coral', value: '#FB7185' },
        { name: 'Mint', value: '#6EE7B7' },
        { name: 'Lavender', value: '#C084FC' },
    ];

    // Validation Schema
    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Product name is required')
            .min(3, 'Product name must be at least 3 characters')
            .max(100, 'Product name must be less than 100 characters'),
        description: Yup.string()
            .required('Description is required')
            .min(10, 'Description must be at least 10 characters')
            .max(1000, 'Description must be less than 1000 characters'),
        price: Yup.number()
            .required('Price is required')
            .positive('Price must be greater than 0')
            .min(0.01, 'Price must be at least 0.01'),
        originalPrice: Yup.number()
            .nullable()
            .positive('Original price must be greater than 0')
            .min(0.01, 'Original price must be at least 0.01')
            .test('is-greater', 'Original price should be greater than price', function(value) {
                const { price } = this.parent;
                return !value || !price || value > price;
            }),
        category: Yup.string().required('Category is required'),
        stock: Yup.number()
            .when('useVariants', {
                is: false,
                then: (schema) => schema.required('Stock is required').min(0, 'Stock cannot be negative'),
                otherwise: (schema) => schema.nullable()
            }),
        sizes: Yup.array()
            .when('useVariants', {
                is: false,
                then: (schema) => schema.min(1, 'Please select at least one size'),
                otherwise: (schema) => schema.nullable()
            }),
        color: Yup.string().nullable(),
        tags: Yup.string().nullable(),
        featured: Yup.boolean(),
        isActive: Yup.boolean(),
    });

    // Formik setup
    const formik = useFormik({
        initialValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            price: initialData?.price?.toString() || '',
            originalPrice: initialData?.originalPrice?.toString() || '',
            category: initialData?.category?._id || '',
            stock: initialData?.stock?.toString() || '',
            sizes: initialData?.sizes || [],
            color: initialData?.color || '',
            tags: initialData?.tags?.join(', ') || '',
            featured: initialData?.featured || false,
            isActive: initialData?.isActive !== undefined ? initialData?.isActive : true,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            await handleFormSubmit(values);
        },
    });

    // Initialize form with existing data (for edit mode)
    useEffect(() => {
        if (initialData) {
            setExistingImages(initialData.images || []);
            
            // If product has variants, enable variant management and load them
            if (initialData.variants && initialData.variants.length > 0) {
                setUseVariants(true);
                setVariants(initialData.variants);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        formik.handleChange(e);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length + images.length + existingImages.length > 5) {
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

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleSize = (size: string) => {
        const currentSizes = formik.values.sizes;
        const newSizes = currentSizes.includes(size)
            ? currentSizes.filter((s: string) => s !== size)
            : [...currentSizes, size];
        formik.setFieldValue('sizes', newSizes);
    };

    // Variant management functions
    const addVariant = () => {
        if (!currentVariant.size) {
            alert('Please select a size');
            return;
        }

        // Check for duplicate
        const duplicate = variants.find(v => v.size === currentVariant.size);
        if (duplicate) {
            alert('This size already exists');
            return;
        }

        const newVariant = {
            size: currentVariant.size,
            stock: Number(currentVariant.stock) || 0,
            sku: currentVariant.sku || `${formik.values.name.substring(0, 3).toUpperCase()}-${currentVariant.size}`,
            price: currentVariant.price ? Number(currentVariant.price) : undefined,
        };

        setVariants([...variants, newVariant]);

        // Reset form
        setCurrentVariant({
            size: '',
            stock: 0,
            sku: '',
            price: '',
        });
        setShowVariantModal(false);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const generateAllVariants = () => {
        if (formik.values.sizes.length === 0) {
            alert('Please select sizes first');
            return;
        }

        const defaultStock = Number(bulkVariantSettings.defaultStock) || 0;
        const defaultPrice = bulkVariantSettings.defaultPrice ? Number(bulkVariantSettings.defaultPrice) : undefined;

        const newVariants: typeof variants = [];
        formik.values.sizes.forEach((size: string) => {
            // Check if variant already exists
            const exists = variants.find(v => v.size === size);
            if (!exists) {
                newVariants.push({
                    size,
                    stock: defaultStock,
                    sku: `${formik.values.name.substring(0, 3).toUpperCase()}-${size}`,
                    price: defaultPrice,
                });
            }
        });

        if (newVariants.length > 0) {
            setVariants([...variants, ...newVariants]);
            alert(`Generated ${newVariants.length} new variants`);
        } else {
            alert('All variants already exist');
        }
    };

    const getTotalStock = () => {
        if (useVariants && variants.length > 0) {
            return variants.reduce((sum, v) => sum + v.stock, 0);
        }
        return Number(formik.values.stock) || 0;
    };

    const handleFormSubmit = async (values: typeof formik.values) => {

        if (mode === 'add' && images.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        if (useVariants && variants.length === 0) {
            alert('Please add at least one variant or disable variant management');
            return;
        }

        const submitData = new FormData();
        submitData.append('name', values.name);
        submitData.append('description', values.description);
        submitData.append('price', values.price);
        if (values.originalPrice) submitData.append('originalPrice', values.originalPrice);
        submitData.append('category', values.category);
        submitData.append('featured', String(values.featured));
        submitData.append('isActive', String(values.isActive));

        // Always add color
        if (values.color) {
            submitData.append('color', values.color);
        }

        // If using variants, send variant data; otherwise use legacy fields
        if (useVariants && variants.length > 0) {
            submitData.append('variants', JSON.stringify(variants));
            // Total stock will be calculated from variants on backend
            submitData.append('stock', String(getTotalStock()));
            // Extract unique sizes from variants and send as sizes array
            const variantSizes = [...new Set(variants.map(v => v.size))];
            submitData.append('sizes', JSON.stringify(variantSizes));
        } else {
            submitData.append('stock', values.stock);
            // Add sizes as JSON array
            submitData.append('sizes', JSON.stringify(values.sizes));
        }

        // Add tags as array
        if (values.tags) {
            const tagsArray = values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
            submitData.append('tags', JSON.stringify(tagsArray));
        }

        // Add existing images (for edit mode)
        if (mode === 'edit') {
            submitData.append('existingImages', JSON.stringify(existingImages));
        }

        // Add new images
        images.forEach((image) => {
            submitData.append('images', image);
        });

        try {
            await onSubmit(submitData);
        } catch (err) {
            console.error(`Failed to ${mode} product:`, err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#D32F2F]">
                            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {mode === 'add' ? 'Create a new product listing' : 'Update product information'}
                        </p>
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
                            : `Failed to ${mode} product. Please try again.`}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
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
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                placeholder="e.g., Punjabi Salwar Suit"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-600 text-sm mt-1">{String(formik.errors.name)}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                placeholder="Describe the product features, material, and details..."
                            />
                            {formik.touched.description && formik.errors.description && (
                                <p className="text-red-600 text-sm mt-1">{String(formik.errors.description)}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={categoriesLoading}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20 disabled:bg-gray-100"
                                >
                                    <option value="">
                                        {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                                    </option>
                                    {categories.map((category: any) => (
                                        <option key={category._id} value={category._id}>
                                            {category.parent ? `${category.parent.name} > ` : ''}{category.name}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.category && formik.errors.category && (
                                    <p className="text-red-600 text-sm mt-1">{String(formik.errors.category)}</p>
                                )}
                                {categories.length === 0 && !categoriesLoading && (
                                    <p className="text-sm text-amber-600 mt-1">
                                        No categories available.{' '}
                                        <Link href="/categories/add" className="underline hover:text-amber-700">
                                            Create one first
                                        </Link>
                                    </p>
                                )}
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
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                    placeholder="0.00"
                                />
                                {formik.touched.price && formik.errors.price && (
                                    <p className="text-red-600 text-sm mt-1">{String(formik.errors.price)}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Compare at Price (₹)
                                </label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formik.values.originalPrice}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                    placeholder="0.00"
                                />
                                {formik.touched.originalPrice && formik.errors.originalPrice && (
                                    <p className="text-red-600 text-sm mt-1">{String(formik.errors.originalPrice)}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">Original price to show discount</p>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Product Images</h2>

                        {/* Existing Images (for edit mode) */}
                        {mode === 'edit' && existingImages.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Images
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {existingImages.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.url}
                                                alt={image.alt || `Product image ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {mode === 'edit' ? 'Add More Images (Max 5 total)' : 'Upload Images * (Max 5)'}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                disabled={images.length + existingImages.length >= 5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] disabled:bg-gray-100"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {mode === 'edit' 
                                    ? `${existingImages.length + images.length} of 5 images`
                                    : 'Upload up to 5 product images'}
                            </p>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {mode === 'edit' ? 'New Images to Upload' : 'Image Previews'}
                                </label>
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
                            </div>
                        )}
                    </div>

                    {/* Product Color - Always visible */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Product Color</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Color
                            </label>
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-3">
                                {availableColors.map((color) => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => formik.setFieldValue('color', color.name)}
                                        className={`group relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:shadow-md ${formik.values.color === color.name
                                            ? 'border-[#D32F2F] bg-red-50 shadow-md'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        title={color.name}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-full border-2 transition-transform group-hover:scale-110 ${color.name === 'White' ? 'border-gray-300' : 'border-gray-400'
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                        />
                                        <span className={`text-xs font-medium ${formik.values.color === color.name ? 'text-[#D32F2F]' : 'text-gray-700'
                                            }`}>
                                            {color.name}
                                        </span>
                                        {formik.values.color === color.name && (
                                            <div className="absolute top-1 right-1">
                                                <svg className="w-5 h-5 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {formik.values.color && (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Selected:</span>
                                    <span className="font-semibold text-gray-800">{formik.values.color}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Variant Management Toggle */}
                    <div className="space-y-4">
                        <div className="bg-linear-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                        Variant Management
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {useVariants
                                            ? 'Track inventory for each size separately with individual stock and pricing'
                                            : 'Use simple stock tracking (sizes without individual stock management)'}
                                    </p>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700">
                                        {useVariants ? 'Enabled' : 'Disabled'}
                                    </span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={useVariants}
                                            onChange={(e) => setUseVariants(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Variant Management Section */}
                    {useVariants ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Product Variants</h2>

                            {/* Quick Generate Section */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">Quick Generate Variants</h3>
                                <p className="text-sm text-blue-700 mb-3">
                                    First select sizes below, then click "Generate All Variants" to create all combinations automatically.
                                </p>

                                {/* Sizes */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Sizes</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSize(size)}
                                                className={`px-3 py-1.5 rounded-lg border-2 font-medium transition-colors text-sm ${formik.values.sizes.includes(size)
                                                    ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#D32F2F]'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Default Stock for Generated Variants */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Default Stock for All Variants
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={bulkVariantSettings.defaultStock}
                                        onChange={(e) => setBulkVariantSettings(prev => ({
                                            ...prev,
                                            defaultStock: e.target.value
                                        }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="e.g., 10"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Stock quantity that will be assigned to each generated variant
                                    </p>
                                </div>

                                {/* Default Price for Generated Variants */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Default Price for Variants (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={bulkVariantSettings.defaultPrice}
                                        onChange={(e) => setBulkVariantSettings(prev => ({
                                            ...prev,
                                            defaultPrice: e.target.value
                                        }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="Leave empty to use base price"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Optional: Set a specific price for these variants (overrides base price)
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={generateAllVariants}
                                    disabled={formik.values.sizes.length === 0}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Generate All Variants ({formik.values.sizes.length} sizes)
                                </button>
                            </div>

                            {/* Existing Variants List */}
                            {variants.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-800">
                                            Created Variants ({variants.length})
                                        </h3>
                                        <span className="text-sm text-gray-600">
                                            Total Stock: <span className="font-bold text-[#D32F2F]">{getTotalStock()}</span>
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                        {variants.map((variant, index) => (
                                            <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-[#D32F2F] transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            Size: {variant.size}
                                                        </p>
                                                        <p className="text-xs text-gray-500">SKU: {variant.sku}</p>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                                Stock: {variant.stock}
                                                            </span>
                                                            {variant.price && (
                                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                                    ₹{variant.price}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariant(index)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add Individual Variant Button */}
                            <button
                                type="button"
                                onClick={() => setShowVariantModal(true)}
                                className="w-full bg-white border-2 border-dashed border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Individual Variant
                            </button>

                            {/* Variant Modal */}
                            {showVariantModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-gray-800">Add New Variant</h3>
                                            <button
                                                type="button"
                                                onClick={() => setShowVariantModal(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                                                <select
                                                    value={currentVariant.size}
                                                    onChange={(e) => setCurrentVariant({ ...currentVariant, size: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F]"
                                                >
                                                    <option value="">Select size</option>
                                                    {availableSizes.map((size) => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={currentVariant.stock}
                                                    onChange={(e) => setCurrentVariant({ ...currentVariant, stock: Number(e.target.value) })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F]"
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                                                <input
                                                    type="text"
                                                    value={currentVariant.sku}
                                                    onChange={(e) => setCurrentVariant({ ...currentVariant, sku: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F]"
                                                    placeholder="Auto-generated if empty"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Variant Price (₹)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={currentVariant.price}
                                                    onChange={(e) => setCurrentVariant({ ...currentVariant, price: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F]"
                                                    placeholder="Leave empty to use base price"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Optional: Set different price for this variant
                                                </p>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={addVariant}
                                                    className="flex-1 bg-[#D32F2F] text-white py-2 rounded-lg font-semibold hover:bg-[#B71C1C]"
                                                >
                                                    Add Variant
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowVariantModal(false)}
                                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Legacy Mode - Simple Sizes and Stock */
                        <>
                            {/* Sizes */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Available Sizes</h2>

                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSize(size)}
                                            className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formik.values.sizes.includes(size)
                                                ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#D32F2F]'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                {formik.touched.sizes && formik.errors.sizes && (
                                    <p className="text-red-600 text-sm mt-1">{String(formik.errors.sizes)}</p>
                                )}
                            </div>

                            {/* Stock field for legacy mode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formik.values.stock}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
                                    placeholder="0"
                                />
                                {formik.touched.stock && formik.errors.stock && (
                                    <p className="text-red-600 text-sm mt-1">{String(formik.errors.stock)}</p>
                                )}
                            </div>
                        </>
                    )}

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
                                value={formik.values.tags}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                    checked={formik.values.featured}
                                    onChange={formik.handleChange}
                                    className="w-4 h-4 text-[#D32F2F] border-gray-300 rounded focus:ring-[#D32F2F]"
                                />
                                <span className="text-sm font-medium text-gray-700">Featured Product</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formik.values.isActive}
                                    onChange={formik.handleChange}
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
                            {isLoading ? `${mode === 'add' ? 'Creating' : 'Updating'} Product...` : `${mode === 'add' ? 'Create' : 'Update'} Product`}
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

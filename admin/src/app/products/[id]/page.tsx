'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductById, clearCurrentProduct } from '@/store/slices/productsSlice';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentProduct: product, loading } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    dispatch(fetchProductById(params.id));

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, params.id, user, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (loading || !product) {
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
            href="/products"
            className="text-[#D32F2F] hover:text-[#B71C1C] mb-4 inline-block"
          >
            ← Back to Products
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#D32F2F]">Product Details</h1>
            <Link
              href={`/products/${params.id}/edit`}
              className="bg-[#FFD700] text-[#8B4513] px-6 py-3 rounded-lg hover:bg-[#DAA520] transition-colors font-semibold"
            >
              Edit Product
            </Link>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Images</h2>
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.alt || product.name}
                    className="w-full h-48 object-cover rounded-lg border-2 border-[#FFD700]"
                  />
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Category</label>
                  <p className="text-lg">{product.category.name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <p className="text-gray-700">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Price</label>
                    <p className="text-2xl font-bold text-[#D32F2F]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  {product.originalPrice && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Original Price</label>
                      <p className="text-lg line-through text-gray-500">
                        {formatPrice(product.originalPrice)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Stock</label>
                    <p className="text-lg">{product.stock} units</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Status</label>
                    <p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.inStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </p>
                  </div>
                </div>

                {product.sizes.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Available Sizes</label>
                    <div className="flex gap-2 mt-2">
                      {product.sizes.map((size, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 border-2 border-[#D32F2F] rounded text-sm"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Available Colors</label>
                    <div className="flex gap-2 mt-2">
                      {product.colors.map((color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#FFD700] text-[#8B4513] rounded text-sm font-semibold"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Views</label>
                    <p className="text-lg">{product.views}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Sold</label>
                    <p className="text-lg">{product.sold}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Rating</label>
                    <p className="text-lg">
                      ⭐ {product.rating.average.toFixed(1)} ({product.rating.count})
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Featured</label>
                  <p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.featured
                          ? 'bg-[#FFD700] text-[#8B4513]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

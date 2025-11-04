'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useGetProductByIdQuery, useUpdateProductMutation } from '@/store/api/productsApi';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import ProductForm from '@/components/ProductForm';

function EditProductContent({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    
    const { data: productData, isLoading: productLoading } = useGetProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating, error: updateError }] = useUpdateProductMutation();
    
    const product = (productData as any)?.data?.product || productData;

    const handleSubmit = async (data: FormData) => {
        await updateProduct({ id, data }).unwrap();
        router.push('/products');
    };

    if (productLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D32F2F]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">Product not found</p>
                    <button
                        onClick={() => router.push('/products')}
                        className="text-[#D32F2F] hover:text-[#B71C1C] underline"
                    >
                        ← Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ProductForm
            mode="edit"
            productId={id}
            initialData={product}
            existingImages={product.images || []}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            error={updateError}
        />
    );
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <ProtectedRoute requireAdmin={true}>
            <EditProductContent params={params} />
        </ProtectedRoute>
    );
}

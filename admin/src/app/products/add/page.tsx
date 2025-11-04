'use client';

import { useRouter } from 'next/navigation';
import { useCreateProductMutation } from '@/store/api/productsApi';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import ProductForm from '@/components/ProductForm';

function AddProductContent() {
    const router = useRouter();
    const [createProduct, { isLoading, error }] = useCreateProductMutation();

    const handleSubmit = async (data: FormData) => {
        await createProduct(data).unwrap();
        router.push('/products');
    };

    return (
        <ProductForm
            mode="add"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
        />
    );
}

export default function AddProductPage() {
    return (
        <ProtectedRoute requireAdmin={true}>
            <AddProductContent />
        </ProtectedRoute>
    );
}

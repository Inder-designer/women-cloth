'use client';

import React from 'react';
import ProtectedRoute from '@/middleware/ProtectedRoute';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}

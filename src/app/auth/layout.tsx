'use client';

import React from 'react';
import PublicRoute from '@/middleware/PublicRoute';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <PublicRoute>
            {children}
        </PublicRoute>
    );
}

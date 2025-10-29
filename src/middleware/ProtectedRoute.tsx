'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

// This component is for protected pages (profile, orders, cart, wishlist, etc.)
// If user is NOT authenticated, redirect to login
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isInitialized, isAuthenticated, user } = useAuth({ 
    requireAuth: true,
    redirectTo: '/auth/login'
  });

  // Debug logging
  console.log('🛡️ ProtectedRoute:', { isInitialized, isAuthenticated, user });

  // Show loading or nothing while initial auth check or redirecting
  if (!isInitialized) {
    console.log('⏳ ProtectedRoute: Not initialized, showing loading...');
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#D32F2F] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, will redirect (handled by hook)
  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute: Not authenticated, should redirect...');
    return null;
  }

  console.log('✅ ProtectedRoute: Authenticated, rendering children');
  return <>{children}</>;
}

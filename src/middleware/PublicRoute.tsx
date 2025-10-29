'use client';

import { ReactNode } from 'react';
import { usePublicRoute } from '@/hooks/useAuth';

interface PublicRouteProps {
  children: ReactNode;
}

// This component is for auth pages (login, register, etc.)
// If user is already authenticated, redirect to home or return URL
export default function PublicRoute({ children }: PublicRouteProps) {
  const { isInitialized, isAuthenticated } = usePublicRoute('/');

  // Show loading or nothing while checking or redirecting
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#D32F2F] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, will redirect (handled by hook)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

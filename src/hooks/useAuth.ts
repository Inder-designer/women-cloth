'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

interface UseAuthOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { requireAuth = false, redirectTo = '/auth/login' } = options;
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isInitialized } = useAuthContext();

  useEffect(() => {
    console.log('🔍 useAuth hook:', { 
      isInitialized, 
      isAuthenticated, 
      requireAuth, 
      pathname,
      user: user ? `${user.firstName} ${user.lastName}` : 'null'
    });

    // Wait for initial auth check to complete
    if (!isInitialized) {
      console.log('⏳ useAuth: Waiting for initialization...');
      return;
    }

    // If auth is required and user is not authenticated, redirect to login
    if (requireAuth && !isAuthenticated) {
      const returnUrl = pathname !== '/' ? `?returnUrl=${encodeURIComponent(pathname)}` : '';
      const redirectUrl = `${redirectTo}${returnUrl}`;
      console.log('🚀 useAuth: Redirecting to:', redirectUrl);
      router.push(redirectUrl);
      return;
    }

    if (requireAuth && isAuthenticated) {
      console.log('✅ useAuth: Authenticated, allowing access');
    }
  }, [isAuthenticated, isInitialized, requireAuth, redirectTo, router, pathname, user]);

  return {
    user,
    isAuthenticated,
    isInitialized,
  };
}

// Hook for public routes (auth pages) - redirects if already logged in
export function usePublicRoute(redirectTo: string = '/') {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuthContext();

  useEffect(() => {
    // Wait for initial auth check to complete
    if (!isInitialized) return;

    // If already authenticated, redirect to home or return URL
    if (isAuthenticated && user) {
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl') || redirectTo;
      router.push(returnUrl);
    }
  }, [isAuthenticated, user, isInitialized, router, redirectTo]);

  return {
    user,
    isAuthenticated,
    isInitialized,
  };
}

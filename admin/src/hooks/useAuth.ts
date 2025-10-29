'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

interface UseAuthOptions {
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { requireAdmin = false, redirectTo = '/login' } = options;
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isInitialized } = useAuthContext();

  useEffect(() => {
    // Wait for initial auth check to complete
    if (!isInitialized) return;

    // If not authenticated, redirect to login with return URL
    if (!isAuthenticated || !user) {
      const returnUrl = pathname !== '/' ? `?returnUrl=${encodeURIComponent(pathname)}` : '';
      router.push(`${redirectTo}${returnUrl}`);
      return;
    }

    // If admin is required and user is not admin, redirect
    if (requireAdmin && user.role !== 'admin') {
      router.push(redirectTo);
      return;
    }
  }, [isAuthenticated, user, isInitialized, requireAdmin, redirectTo, router, pathname]);

  return {
    user,
    isAuthenticated,
    isInitialized,
    isAdmin: user?.role === 'admin',
  };
}

export function useAuthRedirect() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuthContext();

  useEffect(() => {
    // Wait for initial auth check to complete
    if (!isInitialized) return;

    // If already authenticated, redirect to home or return URL
    if (isAuthenticated && user) {
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl') || '/';
      router.push(returnUrl);
    }
  }, [isAuthenticated, user, isInitialized, router]);

  return {
    user,
    isAuthenticated,
    isInitialized,
  };
}

'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = true 
}: ProtectedRouteProps) {
  const { isInitialized, isAuthenticated, isAdmin } = useAuth({ 
    requireAdmin,
    redirectTo: '/login'
  });

  // Show nothing while initial auth check or redirecting
  if (!isInitialized || !isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}

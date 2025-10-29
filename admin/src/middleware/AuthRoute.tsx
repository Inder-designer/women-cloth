'use client';

import { ReactNode } from 'react';
import { useAuthRedirect } from '@/hooks/useAuth';

interface AuthRouteProps {
  children: ReactNode;
}

// This component is for auth pages (login, register, etc.)
// If user is already authenticated, redirect to home or return URL
export default function AuthRoute({ children }: AuthRouteProps) {
  const { isInitialized, isAuthenticated } = useAuthRedirect();

  // Show nothing while checking or redirecting
  if (!isInitialized || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

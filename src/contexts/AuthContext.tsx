'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCheckAuthQuery, User } from '@/store/api/authApi';

interface AuthContextType {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  isLoading: true,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data, isLoading, isSuccess, isError, error } = useCheckAuthQuery();

  const isInitialized = !isLoading;
  const isAuthenticated = isSuccess && data?.authenticated === true;
  const user = isAuthenticated ? data?.data?.user || null : null;

  // Debug logging (remove in production)
  if (typeof window !== 'undefined') {
    console.log('🔐 Auth State:', {
      isInitialized,
      isAuthenticated,
      isSuccess,
      isError,
      hasData: !!data,
      user: user ? `${user.firstName} ${user.lastName}` : 'null',
      rawData: data
    });
  }

  return (
    <AuthContext.Provider value={{ isInitialized, isAuthenticated, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

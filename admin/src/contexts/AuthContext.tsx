'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCheckAuthQuery } from '@/store/api/authApi';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

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
  const { data, isLoading, isSuccess, isError } = useCheckAuthQuery();

  const isInitialized = !isLoading;
  const isAuthenticated = isSuccess && data?.authenticated === true;
  const user = isAuthenticated ? data?.data?.user || null : null;

  // Show loading until auth check is complete
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#D32F2F] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isInitialized, isAuthenticated, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

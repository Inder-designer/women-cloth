'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, clearError } from '@/store/slices/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(login(formData)).unwrap();
      router.push('/');
    } catch (err) {
      // Error handled by Redux
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D32F2F] to-[#8B4513] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-[#D32F2F] rounded-full flex items-center justify-center mb-4 border-4 border-[#FFD700]">
            <span className="text-3xl text-[#FFD700] font-bold">ਸ</span>
          </div>
          <h1 className="text-2xl font-bold text-[#D32F2F]">ਸੁਰਖ਼-ਏ-ਪੰਜਾਬ</h1>
          <p className="text-gray-600 mt-1">Admin Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@surkhepunjab.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D32F2F] text-white py-3 rounded-lg font-semibold hover:bg-[#B71C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Default Admin Credentials:
          </p>
          <p className="text-sm text-center mt-2">
            <span className="font-semibold">Email:</span> admin@surkhepunjab.com<br />
            <span className="font-semibold">Password:</span> Admin@123
          </p>
        </div>
      </div>
    </div>
  );
}

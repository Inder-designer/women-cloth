'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    if (formData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    // Handle password change
    alert('Password changed successfully!');
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/profile" className="text-[#D32F2F] hover:underline">
              Profile
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Change Password</span>
          </div>

          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-[#D32F2F]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#D32F2F] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-playfair">
                  Change Password
                </h1>
                <p className="text-gray-600 text-sm">Update your account password</p>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Password Security Tips
            </h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Use at least 8 characters</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Add numbers and special characters</li>
              <li>• Avoid common words or personal information</li>
            </ul>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] text-sm pr-10"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#D32F2F]"
                  >
                    {showPassword.current ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] text-sm pr-10"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#D32F2F]"
                  >
                    {showPassword.new ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] text-sm pr-10"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#D32F2F]"
                  >
                    {showPassword.confirm ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#D32F2F] text-white px-6 py-2 rounded-md hover:bg-[#B71C1C] transition font-semibold text-sm"
                >
                  Update Password
                </button>
                <Link
                  href="/profile"
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition font-semibold text-sm inline-block text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

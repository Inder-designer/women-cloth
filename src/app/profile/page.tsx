'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Priya',
    lastName: 'Kaur',
    email: 'priya.kaur@example.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1995-05-15',
    address: '123 Mall Road, Ludhiana',
    city: 'Ludhiana',
    state: 'Punjab',
    pincode: '141001',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Handle profile update
    alert('Profile updated successfully!');
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#D32F2F] flex items-center justify-center">
                  <span className="text-3xl text-white font-bold">PK</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-playfair">
                    {formData.firstName} {formData.lastName}
                  </h1>
                  <p className="text-gray-600 text-sm">{formData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-gray-500">Active Member</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-[#D32F2F] text-white px-4 py-2 rounded-md hover:bg-[#B71C1C] transition text-sm font-semibold"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Link
              href="/orders"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition text-center border-2 border-transparent hover:border-[#FFD700]"
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="font-semibold text-sm">My Orders</p>
            </Link>
            <Link
              href="/wishlist"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition text-center border-2 border-transparent hover:border-[#FFD700]"
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="font-semibold text-sm">Wishlist</p>
            </Link>
            <Link
              href="/profile/change-password"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition text-center border-2 border-transparent hover:border-[#FFD700]"
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="font-semibold text-sm">Password</p>
            </Link>
            <Link
              href="/profile/settings"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition text-center border-2 border-transparent hover:border-[#FFD700]"
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="font-semibold text-sm">Settings</p>
            </Link>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-playfair flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-[#D32F2F]"></span>
              Personal Information
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] disabled:bg-gray-100 text-sm"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] disabled:bg-gray-100 text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] disabled:bg-gray-100 text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] disabled:bg-gray-100 text-sm"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] disabled:bg-gray-100 text-sm"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] disabled:bg-gray-100 text-sm"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] disabled:bg-gray-100 text-sm"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] disabled:bg-gray-100 text-sm"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] disabled:bg-gray-100 text-sm"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="bg-[#D32F2F] text-white px-6 py-2 rounded-md hover:bg-[#B71C1C] transition font-semibold text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition font-semibold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

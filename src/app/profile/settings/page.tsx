'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    newArrivals: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    orderStatus: true,
    promotions: false,
    recommendations: true,
  });

  const [smsNotifications, setSmsNotifications] = useState({
    orderUpdates: true,
    deliveryAlerts: true,
    promotions: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'INR',
    twoFactorAuth: false,
    activityStatus: true,
  });

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/profile" className="text-[#D32F2F] hover:underline">
              Profile
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Settings</span>
          </div>

          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-[#D32F2F]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#D32F2F] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-playfair">
                  Account Settings
                </h1>
                <p className="text-gray-600 text-sm">Manage your preferences and notifications</p>
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-playfair flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-[#D32F2F]"></span>
              Email Notifications
            </h2>
            <div className="space-y-3">
              {Object.entries(emailNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-500">
                      {key === 'orderUpdates' && 'Get updates about your orders and shipping'}
                      {key === 'promotions' && 'Receive special offers and discount codes'}
                      {key === 'newsletter' && 'Weekly fashion tips and style guides'}
                      {key === 'newArrivals' && 'Be the first to know about new collections'}
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications({ ...emailNotifications, [key]: !value })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      value ? 'bg-[#D32F2F]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-playfair flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-[#D32F2F]"></span>
              Push Notifications
            </h2>
            <div className="space-y-3">
              {Object.entries(pushNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-500">
                      {key === 'orderStatus' && 'Real-time updates on your order status'}
                      {key === 'promotions' && 'Flash sales and limited-time offers'}
                      {key === 'recommendations' && 'Personalized product suggestions'}
                    </p>
                  </div>
                  <button
                    onClick={() => setPushNotifications({ ...pushNotifications, [key]: !value })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      value ? 'bg-[#D32F2F]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-playfair flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-[#D32F2F]"></span>
              SMS Notifications
            </h2>
            <div className="space-y-3">
              {Object.entries(smsNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-500">
                      {key === 'orderUpdates' && 'Order confirmations and status updates'}
                      {key === 'deliveryAlerts' && 'Delivery notifications and OTPs'}
                      {key === 'promotions' && 'Exclusive SMS-only deals'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSmsNotifications({ ...smsNotifications, [key]: !value })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      value ? 'bg-[#D32F2F]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Account Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-playfair flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-[#D32F2F]"></span>
              Account Preferences
            </h2>
            <div className="space-y-4">
              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] text-sm"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D32F2F] text-sm"
                >
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                </select>
              </div>

              {/* Two Factor Auth */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add an extra layer of security</p>
                </div>
                <button
                  onClick={() => setPreferences({ ...preferences, twoFactorAuth: !preferences.twoFactorAuth })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    preferences.twoFactorAuth ? 'bg-[#D32F2F]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      preferences.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Activity Status */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Show Activity Status</p>
                  <p className="text-xs text-gray-500">Let others see when you're active</p>
                </div>
                <button
                  onClick={() => setPreferences({ ...preferences, activityStatus: !preferences.activityStatus })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    preferences.activityStatus ? 'bg-[#D32F2F]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      preferences.activityStatus ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSaveSettings}
              className="bg-[#D32F2F] text-white px-6 py-2 rounded-md hover:bg-[#B71C1C] transition font-semibold text-sm"
            >
              Save All Settings
            </button>
            <Link
              href="/profile"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition font-semibold text-sm inline-block text-center"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

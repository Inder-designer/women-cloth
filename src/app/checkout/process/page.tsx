'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProcessPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate payment processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push('/checkout/success');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-[#D32F2F] rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Processing Your Order
        </h1>
        <p className="text-gray-600 mb-6">
          Please wait while we process your payment...
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-[#D32F2F] h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-500">{progress}% Complete</p>

        <div className="mt-6 text-xs text-gray-400">
          <p>Do not close this window or press the back button.</p>
        </div>
      </div>
    </div>
  );
}

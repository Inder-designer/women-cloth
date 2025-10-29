'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useForgotPasswordMutation } from '@/store/api/authApi';
import { getErrorMessage } from '@/store/utils';
import { forgotPasswordInitialValues, forgotPasswordValidationSchema } from '@/lib/formik/authSchemas';

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const formik = useFormik({
        initialValues: forgotPasswordInitialValues,
        validationSchema: forgotPasswordValidationSchema,
        onSubmit: async (values) => {
            try {
                await forgotPassword({ email: values.email }).unwrap();
                setSubmitted(true);
            } catch (err) {
                console.error('Failed to send reset email:', err);
            }
        },
    });

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h2>
                        <p className="text-gray-600 mb-8">
                            We've sent a password reset link to <strong>{formik.values.email}</strong>
                        </p>
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center text-[#D32F2F] hover:text-[#B71C1C] font-medium"
                        >
                            ← Back to login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <Link href="/" className="flex items-center justify-center text-center gap-2 hover:opacity-80 transition shrink-0">
                        <div>
                            <h1 className="text-xl font-bold text-[#8B4513] font-playfair leading-tight mb-1">Surkh-E-Punjab</h1>
                            <p className="text-[10px] text-[#D32F2F] leading-none">ਸੁਰਖ਼-ਏ-ਪੰਜਾਬ</p>
                        </div>
                    </Link>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    {formik.errors.email && formik.touched.email && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                            {formik.errors.email}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`appearance-none relative block w-full px-3 py-3 border ${
                                formik.touched.email && formik.errors.email
                                    ? 'border-red-300'
                                    : 'border-gray-300'
                            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D32F2F] focus:border-[#D32F2F] sm:text-sm`}
                            placeholder="Enter your email"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#D32F2F] hover:bg-[#B71C1C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D32F2F] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                'Send reset link'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link href="/auth/login" className="text-sm font-medium text-[#D32F2F] hover:text-[#B71C1C]">
                            ← Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

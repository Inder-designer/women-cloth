'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { useResetPasswordMutation } from '@/store/api/authApi';
import { getErrorMessage } from '@/store/utils';
import { resetPasswordInitialValues, resetPasswordValidationSchema } from '@/lib/formik/authSchemas';

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const [resetPassword, { isLoading, error: apiError }] = useResetPasswordMutation();

    const formik = useFormik({
        initialValues: resetPasswordInitialValues,
        validationSchema: resetPasswordValidationSchema,
        onSubmit: async (values) => {
            try {
                await resetPassword({ token: params.token, password: values.password }).unwrap();
                setSuccess(true);
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/auth/login?reset=success');
                }, 3000);
            } catch (err) {
                console.error('Password reset failed:', err);
            }
        },
    });

    if (success) {
        return (
            <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">
                                    Password reset successful!
                                </h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>
                                        Your password has been successfully reset. You will be redirected to the login page in a few seconds.
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href="/auth/login"
                                        className="text-sm font-medium text-green-800 hover:text-green-700"
                                    >
                                        Go to login now →
                                    </Link>
                                </div>
                            </div>
                        </div>
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
                        Set new password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter your new password below.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    {apiError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                            {getErrorMessage(apiError)}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* New Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`appearance-none relative block w-full px-3 py-3 border ${
                                    formik.touched.password && formik.errors.password ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D32F2F] focus:border-[#D32F2F] focus:z-10 sm:text-sm`}
                                placeholder="Enter new password (min. 6 characters)"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`appearance-none relative block w-full px-3 py-3 border ${
                                    formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D32F2F] focus:border-[#D32F2F] focus:z-10 sm:text-sm`}
                                placeholder="Confirm your new password"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
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
                                    Resetting password...
                                </span>
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                        <div className="text-center">
                            <Link
                                href="/auth/login"
                                className="text-sm font-medium text-[#D32F2F] hover:text-[#B71C1C]"
                            >
                                ← Back to login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

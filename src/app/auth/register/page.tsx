'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { useRegisterMutation } from '@/store/api/authApi';
import { getErrorMessage } from '@/store/utils';
import { registerInitialValues, registerValidationSchema } from '@/lib/formik/authSchemas';

export default function RegisterPage() {
    const router = useRouter();
    const [register, { isLoading, error: apiError }] = useRegisterMutation();

    const formik = useFormik({
        initialValues: registerInitialValues,
        validationSchema: registerValidationSchema,
        onSubmit: async (values) => {
            try {
                const result = await register({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                }).unwrap();

                console.log('Registration successful:', result.user);
                
                // Redirect to login or home page
                router.push('/auth/login?registered=true');
            } catch (err) {
                console.error('Registration failed:', err);
            }
        },
    });

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
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-medium text-[#D32F2F] hover:text-[#B71C1C]">
                            Sign in
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    {apiError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                            {getErrorMessage(apiError)}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`appearance-none relative block w-full px-3 py-3 border ${
                                    formik.touched.firstName && formik.errors.firstName
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D32F2F] focus:border-[#D32F2F] focus:z-10 sm:text-sm`}
                                placeholder="Enter your first name"
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.firstName}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`appearance-none relative block w-full px-3 py-3 border ${
                                    formik.touched.lastName && formik.errors.lastName
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D32F2F] focus:border-[#D32F2F] focus:z-10 sm:text-sm`}
                                placeholder="Enter your last name"
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.lastName}</p>
                            )}
                        </div>

                        {/* Email */}
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
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D32F2F] focus:border-[#D32F2F] focus:z-10 sm:text-sm`}
                                placeholder="Enter your email"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
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
                                    formik.touched.password && formik.errors.password
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D32F2F] focus:border-[#D32F2F] focus:z-10 sm:text-sm`}
                                placeholder="Create a password (min. 6 characters)"
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
                                    formik.touched.confirmPassword && formik.errors.confirmPassword
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D32F2F] focus:border-[#D32F2F] focus:z-10 sm:text-sm`}
                                placeholder="Confirm your password"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div>
                        <div className="flex items-center">
                            <input
                                id="acceptTerms"
                                name="acceptTerms"
                                type="checkbox"
                                checked={formik.values.acceptTerms}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-4 w-4 text-[#D32F2F] focus:ring-[#D32F2F] border-gray-300 rounded"
                            />
                            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                                I agree to the{' '}
                                <Link href="/terms" className="text-[#D32F2F] hover:text-[#B71C1C]">
                                    Terms and Conditions
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-[#D32F2F] hover:text-[#B71C1C]">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.acceptTerms}</p>
                        )}
                    </div>

                    {/* Submit Button */}
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
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>

                    {/* Social Registration */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span className="ml-2">Google</span>
                            </button>
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                <span className="ml-2">Facebook</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

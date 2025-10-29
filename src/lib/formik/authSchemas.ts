import * as Yup from 'yup';

// ==================== LOGIN ====================
export const loginInitialValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
  rememberMe: Yup.boolean(),
});

// ==================== REGISTER ====================
export const registerInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export const registerValidationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .trim()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

// ==================== FORGOT PASSWORD ====================
export const forgotPasswordInitialValues = {
  email: '',
};

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

// ==================== RESET PASSWORD ====================
export const resetPasswordInitialValues = {
  password: '',
  confirmPassword: '',
};

export const resetPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

// ==================== TYPES ====================
export type LoginFormValues = typeof loginInitialValues;
export type RegisterFormValues = typeof registerInitialValues;
export type ForgotPasswordFormValues = typeof forgotPasswordInitialValues;
export type ResetPasswordFormValues = typeof resetPasswordInitialValues;

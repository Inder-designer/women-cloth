# Authentication Pages - Quick Reference

## 📋 Pages Overview

### 1. 🔐 Login Page
**Route**: `/auth/login`

**Purpose**: Allow existing users to sign in

**Features**:
- Email and password fields
- Remember me checkbox
- Loading state with spinner
- Error messages
- Link to register page
- Link to forgot password
- Social login options (UI ready)

**Success**: Redirects to home or return URL

---

### 2. ✨ Register Page (NEW)
**Route**: `/auth/register`

**Purpose**: Allow new users to create an account

**Features**:
- First name, last name fields
- Email and password fields
- Password confirmation
- Terms & conditions checkbox
- Client-side validation
- Loading state with spinner
- Error messages
- Link to login page
- Social registration options (UI ready)

**Success**: Redirects to `/auth/login?registered=true`

---

### 3. 📧 Forgot Password Page
**Route**: `/auth/forgot-password`

**Purpose**: Allow users to request password reset

**Features**:
- Email field
- Email validation
- Loading state with spinner
- Success message
- Error messages
- Link back to login

**Success**: Shows success message, email sent with reset link

---

### 4. 🔑 Reset Password Page (NEW)
**Route**: `/auth/reset-password/[token]`

**Purpose**: Allow users to set new password using reset link

**Features**:
- New password field
- Confirm password field
- Password validation
- Loading state with spinner
- Success message with auto-redirect
- Error messages
- Link back to login

**Success**: Shows success, auto-redirects to login after 3 seconds

---

## 🔄 User Flow Diagrams

### New User Flow
```
1. Visit Site
   ↓
2. Click "Register" or "Create Account"
   ↓
3. Fill Registration Form
   ↓
4. Submit → POST /api/auth/register
   ↓
5. Success → Redirect to /auth/login?registered=true
   ↓
6. Enter credentials on login page
   ↓
7. Submit → POST /api/auth/login
   ↓
8. Success → Redirect to home (authenticated)
```

### Existing User Flow
```
1. Visit Site
   ↓
2. Click "Login" or "Sign In"
   ↓
3. Enter email and password
   ↓
4. Submit → POST /api/auth/login
   ↓
5. Success → Redirect to home (authenticated)
```

### Forgot Password Flow
```
1. Visit Login Page
   ↓
2. Click "Forgot your password?"
   ↓
3. Enter email address
   ↓
4. Submit → POST /api/auth/forgot-password
   ↓
5. Success → Show success message
   ↓
6. Check email for reset link
   ↓
7. Click link → Navigate to /auth/reset-password/:token
   ↓
8. Enter new password and confirm
   ↓
9. Submit → POST /api/auth/reset-password/:token
   ↓
10. Success → Auto-redirect to login
    ↓
11. Login with new password
```

---

## 🎨 UI Components

### Common Elements
All pages include:
- Surkh-E-Punjab logo with Punjabi text
- Page title
- Form container with shadow
- Submit button with loading state
- Error message display area
- Navigation links

### Color Scheme (Punjab Theme)
- Primary: `#D32F2F` (Red)
- Primary Hover: `#B71C1C` (Dark Red)
- Secondary: `#8B4513` (Brown)
- Success: Green shades
- Error: Red shades

---

## 📝 Form Validation

### Login
- Email: Required, valid email format
- Password: Required

### Register
- First Name: Required, non-empty
- Last Name: Required, non-empty
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Confirm Password: Required, must match password
- Terms: Must be checked

### Forgot Password
- Email: Required, valid email format

### Reset Password
- New Password: Required, minimum 6 characters
- Confirm Password: Required, must match new password

---

## 🔌 API Endpoints

| Page | Method | Endpoint | Request Body |
|------|--------|----------|--------------|
| Login | POST | `/api/auth/login` | `{ email, password }` |
| Register | POST | `/api/auth/register` | `{ firstName, lastName, email, password }` |
| Forgot Password | POST | `/api/auth/forgot-password` | `{ email }` |
| Reset Password | POST | `/api/auth/reset-password/:token` | `{ password }` |

---

## 💡 Usage Examples

### Using Login in Your App

```tsx
import { useLoginMutation } from '@/store/api/authApi';

function MyComponent() {
  const [login, { isLoading, error }] = useLoginMutation();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      console.log('User logged in:', result.user);
      // Redirect or update UI
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
}
```

### Using Register in Your App

```tsx
import { useRegisterMutation } from '@/store/api/authApi';

function MyComponent() {
  const [register, { isLoading, error }] = useRegisterMutation();
  
  const handleRegister = async (userData) => {
    try {
      const result = await register(userData).unwrap();
      console.log('User registered:', result.user);
      // Redirect to login
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };
}
```

---

## 🐛 Troubleshooting

### Common Issues

1. **"Network Error" or CORS issues**
   - Check if backend is running on `http://localhost:5000`
   - Verify CORS is configured to allow credentials
   - Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

2. **"Token expired" on reset password**
   - Tokens usually expire after 1 hour
   - User needs to request a new reset link

3. **Login successful but not redirected**
   - Check browser console for errors
   - Verify cookies are being set by backend
   - Check if `credentials: 'include'` is set in baseApi

4. **Form validation not working**
   - Check if utilities are imported correctly
   - Verify form state is being updated

---

## ✅ Testing Your Auth Pages

### Manual Testing Steps

1. **Test Registration**
   ```
   - Go to /auth/register
   - Fill all fields with valid data
   - Submit form
   - Verify redirect to login
   - Check backend database for new user
   ```

2. **Test Login**
   ```
   - Go to /auth/login
   - Enter registered credentials
   - Submit form
   - Verify redirect to home
   - Check if user is authenticated
   ```

3. **Test Forgot Password**
   ```
   - Go to /auth/forgot-password
   - Enter registered email
   - Submit form
   - Check email for reset link
   - Verify link format: /auth/reset-password/:token
   ```

4. **Test Reset Password**
   ```
   - Click reset link from email
   - Enter new password twice
   - Submit form
   - Verify success message
   - Wait for auto-redirect
   - Try logging in with new password
   ```

---

## 📱 Responsive Design

All auth pages are fully responsive:
- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

Forms are centered and have maximum width of 448px (28rem) for optimal readability.

---

## 🔒 Security Notes

1. **Passwords**: 
   - Minimum 6 characters required
   - Stored as hashed in database (bcrypt on backend)
   - Never sent in plain text

2. **Sessions**: 
   - Cookie-based authentication
   - httpOnly cookies (can't be accessed by JavaScript)
   - Secure flag in production (HTTPS only)

3. **Reset Tokens**: 
   - Unique, random tokens
   - Expire after set time (typically 1 hour)
   - Single-use only

4. **Email Validation**: 
   - Prevents typos
   - Reduces spam registrations

---

## 🎯 Quick Links

- **Login**: [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
- **Register**: [http://localhost:3000/auth/register](http://localhost:3000/auth/register)
- **Forgot Password**: [http://localhost:3000/auth/forgot-password](http://localhost:3000/auth/forgot-password)

---

**Status**: ✅ All authentication pages implemented and ready!

**Last Updated**: October 29, 2025

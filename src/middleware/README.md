# Route Protection Documentation

## Overview
This application implements two types of route protection:

1. **Public Routes** - Auth pages that should only be accessible when NOT logged in
2. **Protected Routes** - User pages that require authentication

## Components

### 1. AuthContext (`src/contexts/AuthContext.tsx`)
Provides authentication state throughout the application using RTK Query's `checkAuth` endpoint.

**Exports:**
- `AuthProvider` - Wraps the app to provide auth state
- `useAuthContext()` - Hook to access auth state

**State:**
- `isInitialized` - Whether auth check is complete
- `isAuthenticated` - Whether user is logged in
- `user` - User object or null
- `isLoading` - Whether auth check is in progress

### 2. useAuth Hook (`src/hooks/useAuth.ts`)
Custom hooks for route protection logic.

**Exports:**
- `useAuth(options)` - For protected routes, redirects to login if not authenticated
  - Options: `{ requireAuth: boolean, redirectTo: string }`
  
- `usePublicRoute(redirectTo)` - For public routes, redirects to home if already authenticated

### 3. PublicRoute Component (`src/middleware/PublicRoute.tsx`)
Wraps auth pages (login, register, forgot-password, reset-password).

**Behavior:**
- Shows loading spinner while checking auth
- Redirects to home (or returnUrl) if user is already logged in
- Renders children if user is NOT logged in

**Usage:**
Applied via layout at `/auth/layout.tsx` - automatically protects all auth pages.

### 4. ProtectedRoute Component (`src/middleware/ProtectedRoute.tsx`)
Wraps pages that require authentication.

**Behavior:**
- Shows loading spinner while checking auth
- Redirects to login (with returnUrl) if user is NOT logged in
- Renders children if user IS logged in

**Usage:**
Applied via layouts at:
- `/profile/layout.tsx` - Protects all profile pages
- `/orders/layout.tsx` - Protects order history and details
- `/checkout/layout.tsx` - Protects checkout process

## Route Categories

### Public Routes (No Auth Required)
- `/` - Home page
- `/shop` - Product listing
- `/product/[id]` - Product details
- `/categories` - Categories page
- `/about` - About page
- `/cart` - Shopping cart (accessible to all, login required at checkout)
- `/wishlist` - Wishlist (accessible to all, login prompted for sync)

### Auth Routes (Public Routes - Redirect if Logged In)
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/forgot-password` - Forgot password page
- `/auth/reset-password/[token]` - Reset password page

**Protected by:** `/auth/layout.tsx` wrapping all auth pages with `<PublicRoute>`

### Protected Routes (Auth Required)
- `/profile` - User profile
- `/profile/settings` - Profile settings
- `/profile/change-password` - Change password
- `/orders` - Order history
- `/orders/[id]` - Order details
- `/checkout/process` - Checkout process
- `/checkout/payment` - Payment page
- `/checkout/success` - Order success page

**Protected by:** Individual layouts wrapping page groups with `<ProtectedRoute>`

## Implementation

### Root Layout
The root layout (`src/app/layout.tsx`) wraps the entire app with `AuthProvider`:

```tsx
<ReduxProvider>
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <Header />
        {children}
        <Footer />
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
</ReduxProvider>
```

### Auth Pages Layout
All auth pages are automatically protected by `/auth/layout.tsx`:

```tsx
<PublicRoute>
  {children}
</PublicRoute>
```

### User Pages Layouts
Protected pages use individual layouts:

```tsx
// /profile/layout.tsx
<ProtectedRoute>
  {children}
</ProtectedRoute>
```

## Return URL Feature

When a non-authenticated user tries to access a protected route:
1. They are redirected to `/auth/login?returnUrl=/original-path`
2. After successful login, they are redirected back to the original page
3. If no returnUrl, they go to home page `/`

## Testing

### Test Public Routes
1. While logged in, try to access `/auth/login` → Should redirect to `/`
2. While logged in, try to access `/auth/register` → Should redirect to `/`

### Test Protected Routes
1. While logged out, try to access `/profile` → Should redirect to `/auth/login?returnUrl=/profile`
2. While logged out, try to access `/orders` → Should redirect to `/auth/login?returnUrl=/orders`
3. After login, should return to the original requested page

### Test Return URL
1. Logged out, click on "My Orders" → Redirected to login with returnUrl
2. Login successfully → Automatically redirected to Orders page
3. Logout → Can access shop/products freely

## Benefits

1. **Security** - Prevents unauthorized access to user-specific pages
2. **User Experience** - Seamless navigation with automatic redirects
3. **Centralized Logic** - Auth logic in one place (hooks + components)
4. **Reusable** - Easy to protect new routes by adding a layout
5. **Loading States** - Consistent loading UI during auth checks

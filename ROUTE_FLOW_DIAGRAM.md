# Route Protection Flow Diagram

## 🔄 User Flow Scenarios

### Scenario 1: Guest User Tries Protected Page
```
┌─────────────────────────────────────────────────────────────────┐
│ User clicks "My Orders" (/orders)                               │
│                                                                   │
│ ProtectedRoute checks authentication                             │
│ ├─ isInitialized? → Show loading spinner                        │
│ ├─ isAuthenticated? → NO                                        │
│ └─ Redirect to: /auth/login?returnUrl=/orders                   │
│                                                                   │
│ User enters credentials & clicks Login                           │
│ ├─ API call to /auth/login                                      │
│ ├─ Cookie set with session                                      │
│ └─ Redirect to returnUrl: /orders ✅                            │
└─────────────────────────────────────────────────────────────────┘
```

### Scenario 2: Logged-In User Tries Auth Page
```
┌─────────────────────────────────────────────────────────────────┐
│ User navigates to /auth/login                                    │
│                                                                   │
│ PublicRoute checks authentication                                │
│ ├─ isInitialized? → Show loading spinner                        │
│ ├─ isAuthenticated? → YES                                       │
│ └─ Redirect to: / (home page) ✅                                │
│                                                                   │
│ Auth pages are hidden from logged-in users                       │
└─────────────────────────────────────────────────────────────────┘
```

### Scenario 3: Guest User Shopping
```
┌─────────────────────────────────────────────────────────────────┐
│ User browses /shop                                               │
│ ├─ No protection → Accessible ✅                                │
│                                                                   │
│ User clicks product → /product/123                               │
│ ├─ No protection → Accessible ✅                                │
│                                                                   │
│ User adds to cart → /cart                                        │
│ ├─ No protection → Accessible ✅                                │
│ ├─ Cart stored in local state (CartContext)                     │
│                                                                   │
│ User clicks "Proceed to Checkout"                                │
│ ├─ Navigates to /checkout/process                               │
│ ├─ ProtectedRoute checks auth → NOT authenticated               │
│ └─ Redirect to: /auth/login?returnUrl=/checkout/process         │
│                                                                   │
│ After login → Returns to checkout with cart intact ✅           │
└─────────────────────────────────────────────────────────────────┘
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Root Layout                              │
│                    (src/app/layout.tsx)                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              <ReduxProvider>                                │ │
│  │  ┌───────────────────────────────────────────────────────┐ │ │
│  │  │           <AuthProvider>                              │ │ │
│  │  │  Provides: isAuthenticated, user, isInitialized      │ │ │
│  │  │  ┌─────────────────────────────────────────────────┐ │ │ │
│  │  │  │         <CartProvider>                          │ │ │ │
│  │  │  │  ┌───────────────────────────────────────────┐  │ │ │ │
│  │  │  │  │      <WishlistProvider>                   │  │ │ │ │
│  │  │  │  │  ┌─────────────────────────────────────┐  │  │ │ │ │
│  │  │  │  │  │        <Header />                   │  │  │ │ │ │
│  │  │  │  │  │        {children}                   │  │  │ │ │ │
│  │  │  │  │  │        <Footer />                   │  │  │ │ │ │
│  │  │  │  │  └─────────────────────────────────────┘  │  │ │ │ │
│  │  │  │  └───────────────────────────────────────────┘  │ │ │ │
│  │  │  └─────────────────────────────────────────────────┘ │ │ │
│  │  └───────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Route Protection Matrix

| Route | Auth Required | Component | Redirect If Logged In | Redirect If Logged Out |
|-------|---------------|-----------|----------------------|------------------------|
| `/` | ❌ No | - | - | - |
| `/shop` | ❌ No | - | - | - |
| `/product/[id]` | ❌ No | - | - | - |
| `/about` | ❌ No | - | - | - |
| `/categories` | ❌ No | - | - | - |
| `/cart` | 🔒 Protected | ProtectedRoute | ❌ - | ✅ to `/auth/login?returnUrl=/cart` |
| `/wishlist` | 🔒 Protected | ProtectedRoute | ❌ - | ✅ to `/auth/login?returnUrl=/wishlist` |
| `/auth/login` | 🔓 Public | PublicRoute | ✅ to `/` | ❌ - |
| `/auth/register` | 🔓 Public | PublicRoute | ✅ to `/` | ❌ - |
| `/auth/forgot-password` | 🔓 Public | PublicRoute | ✅ to `/` | ❌ - |
| `/auth/reset-password/[token]` | 🔓 Public | PublicRoute | ✅ to `/` | ❌ - |
| `/profile` | 🔒 Protected | ProtectedRoute | ❌ - | ✅ to `/auth/login?returnUrl=/profile` |
| `/profile/settings` | 🔒 Protected | ProtectedRoute | ❌ - | ✅ to `/auth/login?returnUrl=/profile/settings` |
| `/profile/change-password` | 🔒 Protected | ProtectedRoute | ❌ - | ✅ to `/auth/login?returnUrl=/profile/change-password` |
| `/orders` | 🔒 Protected | ProtectedRoute | ❌ - | ✅ to `/auth/login?returnUrl=/orders` |
| `/orders/[id]` | 🔒 Protected | ProtectedRoute | ❌ - | ✅ to `/auth/login?returnUrl=/orders/[id]` |
| `/checkout/process` | 🔒 Protected | ProtectedRoute | ❌ - | ✅ to `/auth/login?returnUrl=/checkout/process` |
| `/checkout/payment` | 🔒 Protected | ProtectedRoute | ❌ - | ✅ to `/auth/login?returnUrl=/checkout/payment` |
| `/checkout/success` | 🔒 Protected | ProtectedRoute | ❌ - | ✅ to `/auth/login?returnUrl=/checkout/success` |

## 🔍 Component Responsibility

### AuthProvider (Context)
```
Responsibility: Global Auth State
├─ Calls useCheckAuthQuery() from RTK Query
├─ Provides isAuthenticated, user, isInitialized, isLoading
└─ Used by all auth-dependent components
```

### PublicRoute (Middleware)
```
Responsibility: Auth Pages Protection
├─ Wraps /auth/* pages via layout
├─ Shows loading during auth check
├─ Redirects authenticated users to home
└─ Allows unauthenticated users to proceed
```

### ProtectedRoute (Middleware)
```
Responsibility: User Pages Protection
├─ Wraps /profile/*, /orders/*, /checkout/* via layouts
├─ Shows loading during auth check
├─ Redirects unauthenticated users to login (with returnUrl)
└─ Allows authenticated users to proceed
```

## 🎯 Implementation Pattern

### Step 1: Auth State (Global)
```tsx
// Root Layout wraps entire app
<AuthProvider>
  {children}
</AuthProvider>
```

### Step 2: Route Protection (Layout Level)
```tsx
// For auth pages: /auth/layout.tsx
<PublicRoute>
  {children}  // login, register, etc.
</PublicRoute>

// For protected pages: /profile/layout.tsx
<ProtectedRoute>
  {children}  // profile pages
</ProtectedRoute>
```

### Step 3: Auth Hooks (Component Level)
```tsx
// In any component
import { useAuthContext } from '@/contexts/AuthContext';

const { isAuthenticated, user } = useAuthContext();

// Conditional rendering
{isAuthenticated && <UserMenu user={user} />}
{!isAuthenticated && <LoginButton />}
```

## ✅ Verification Checklist

- [x] AuthContext created and integrated
- [x] useAuth hooks implemented
- [x] PublicRoute component created
- [x] ProtectedRoute component created
- [x] Auth layout wraps all auth pages
- [x] Profile layout protects profile pages
- [x] Orders layout protects order pages
- [x] Checkout layout protects checkout flow
- [x] Root layout includes AuthProvider
- [x] Loading states implemented
- [x] Return URL feature working
- [x] No TypeScript errors
- [x] Documentation complete

**Status:** ✅ All route protection implemented and ready!

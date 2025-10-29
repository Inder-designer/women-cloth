# Authentication Hooks

Custom React hooks for handling authentication in the admin panel.

## Architecture

### ⚡ Optimized Authentication Flow

Authentication is checked **only once** at the app level using `AuthProvider` in the root layout. All pages share this single auth state, preventing redundant API calls.

```
App Start → AuthProvider checks auth once → All pages use shared state
```

**Benefits:**
- ✅ **Single API Call** - Auth checked once, not on every page
- ✅ **Faster Navigation** - No auth delay when switching pages
- ✅ **Better Performance** - Reduced server load
- ✅ **Shared State** - All components use same auth result

## `useAuth`

Hook for protected routes that require authentication.

### Usage

```tsx
import { useAuth } from '@/hooks/useAuth';

function ProtectedPage() {
  const { user, isAuthenticated, isChecking, isAdmin } = useAuth({
    requireAdmin: true,
    redirectTo: '/login'
  });

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return <div>Protected content</div>;
}
```

### Options

- `requireAdmin` (boolean, default: false) - Require admin role
- `redirectTo` (string, default: '/login') - Redirect URL if not authenticated

### Returns

- `user` - Current user object or null
- `isAuthenticated` - Boolean indicating auth status
- `isInitialized` - Boolean indicating if initial auth check is complete
- `isAdmin` - Boolean indicating if user is admin

### Features

- ✅ Preserves intended route with `?returnUrl` parameter
- ✅ Redirects to login if not authenticated
- ✅ Redirects after login back to original page
- ✅ Role-based access control

## `useAuthRedirect`

Hook for authentication pages (login, register) that redirects authenticated users.

### Usage

```tsx
import { useAuthRedirect } from '@/hooks/useAuth';

function LoginPage() {
  const { user, isAuthenticated, isChecking } = useAuthRedirect();

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return <div>Login form</div>;
}
```

### Returns

- `user` - Current user object or null
- `isAuthenticated` - Boolean indicating auth status
- `isInitialized` - Boolean indicating if initial auth check is complete

### Features

- ✅ Checks for `?returnUrl` parameter
- ✅ Redirects to return URL after login
- ✅ Defaults to home page if no return URL
- ✅ Prevents authenticated users from seeing login page

## How It Works

### Global Authentication (Optimized)

```
1. App Loads → AuthProvider in layout.tsx
2. Single checkAuth() API call
3. Redux store updated with auth state
4. isInitialized = true
5. All pages access shared state (no more API calls)
```

### Return URL Flow

1. **User visits protected page:** `/orders`
2. **Not authenticated:** Redirect to `/login?returnUrl=/orders`
3. **User logs in:** Login form reads `returnUrl` parameter
4. **After successful login:** Redirect to `/orders`
5. **User stays on intended page** ✅

### Without Return URL

1. **User visits login page directly:** `/login`
2. **User logs in:** No `returnUrl` parameter
3. **After successful login:** Redirect to `/` (home)

## Example: Complete Protected Route

```tsx
// app/orders/page.tsx
'use client';

import ProtectedRoute from '@/middleware/ProtectedRoute';

function OrdersPageContent() {
  // Your page content
  return <div>Orders</div>;
}

export default function OrdersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <OrdersPageContent />
    </ProtectedRoute>
  );
}
```

When you refresh `/orders`:
1. ProtectedRoute uses `useAuth` hook
2. Hook checks authentication
3. If not authenticated → Redirect to `/login?returnUrl=/orders`
4. After login → Redirect back to `/orders`
5. You stay on the same page! ✅

## Benefits

✅ **Preserves Navigation Context** - No more losing your place
✅ **Better UX** - Users return to where they were
✅ **Automatic** - Handled by hooks, no manual code
✅ **Type-Safe** - Full TypeScript support
✅ **Reusable** - Use across all protected pages

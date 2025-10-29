# Protected Routes Middleware

This directory contains middleware components for handling authentication and route protection in the admin panel.

## Components

### 1. ProtectedRoute (`ProtectedRoute.tsx`)
Protects routes that require authentication and/or admin access.

**Usage:**
```tsx
import ProtectedRoute from '@/middleware/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <YourPageContent />
    </ProtectedRoute>
  );
}
```

**Features:**
- Automatically checks authentication status
- Redirects to `/login` if not authenticated
- Can require admin role with `requireAdmin` prop
- Shows loading spinner during auth check
- Uses Redux store for auth state

**Props:**
- `children` (ReactNode) - The protected content to render
- `requireAdmin` (boolean, default: true) - Whether admin role is required

### 2. AuthRoute (`AuthRoute.tsx`)
Protects authentication pages (login, register) from already logged-in users.

**Usage:**
```tsx
import AuthRoute from '@/middleware/AuthRoute';

export default function LoginPage() {
  return (
    <AuthRoute>
      <LoginForm />
    </AuthRoute>
  );
}
```

**Features:**
- Checks if user is already authenticated
- Redirects to `/` (home) if already logged in
- Prevents logged-in users from accessing auth pages
- Shows loading spinner during redirect

**Props:**
- `children` (ReactNode) - The auth page content to render

## Implementation

### Protected Pages (Require Admin):
- ✅ `/` - Dashboard
- ✅ `/products` - Products list
- ✅ `/products/[id]` - Product details
- ✅ `/orders` - Orders list
- ✅ `/orders/[id]` - Order details
- ✅ `/customers` - Customers list

### Auth Pages (Redirect if logged in):
- ✅ `/login` - Login page

## How It Works

### Authentication Flow:

1. **On Page Load:**
   - Middleware dispatches `checkAuth()` thunk
   - Calls `GET /api/auth/status` to verify session
   - Updates Redux store with auth status

2. **Protected Routes:**
   - If not authenticated → Redirect to `/login`
   - If authenticated but not admin → Redirect to `/login`
   - If authenticated and admin → Render content

3. **Auth Routes:**
   - If authenticated → Redirect to `/` (home)
   - If not authenticated → Render login form

### Redux Integration:

The middleware uses the following Redux state:
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

### API Endpoints:

- `POST /api/auth/login` - Login user
- `GET /api/auth/status` - Check auth status
- `POST /api/auth/logout` - Logout user

### Cookie-Based Authentication:

- Session stored in MongoDB via `connect-mongo`
- Cookies automatically sent with requests (`withCredentials: true`)
- Secure session management with Passport.js

## Benefits

1. **Centralized Protection:** All route protection logic in one place
2. **Reusable:** Wrap any page component with middleware
3. **Type-Safe:** Full TypeScript support
4. **User-Friendly:** Shows loading states during auth checks
5. **Automatic:** No manual auth checks needed in page components
6. **Secure:** Server-side session validation

## Example Implementation

### Before (Manual Protection):
```tsx
export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  // Page content...
}
```

### After (Middleware Protection):
```tsx
function ProductsPageContent() {
  // Page content - no auth checks needed!
}

export default function ProductsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <ProductsPageContent />
    </ProtectedRoute>
  );
}
```

## Security Features

- ✅ Server-side session validation
- ✅ Cookie-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Automatic session refresh
- ✅ Redirect loops prevented
- ✅ Loading states prevent content flash

## Future Enhancements

- [ ] Add permission-based access (beyond just admin/user)
- [ ] Add route-level loading skeletons
- [ ] Add session timeout warnings
- [ ] Add multi-factor authentication support
- [ ] Add audit logging for protected routes

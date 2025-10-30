# Frontend

React SPA with authentication, routing, and type-safe API integration.

## Features

- React 19 with TypeScript
- React Router v7 for routing
- Tailwind CSS v4 for styling
- JWT authentication with protected routes
- Type-safe API client integration
- Dark mode support
- Vite for fast development and optimized builds
- Path aliases for clean imports

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **API Client**: `@repo/api-client` (type-safe)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.tsx         # Main layout with navigation
│   │   ├── ProtectedRoute.tsx # Auth guard for protected pages
│   │   └── PublicRoute.tsx    # Redirects authenticated users
│   │
│   ├── pages/
│   │   ├── HomePage.tsx       # Landing page
│   │   ├── LoginPage.tsx      # Login form
│   │   ├── SignupPage.tsx     # Signup form
│   │   ├── AboutPage.tsx      # About/tech stack info
│   │   ├── ApiDemoPage.tsx    # API demo examples
│   │   └── NotFoundPage.tsx   # 404 page
│   │
│   ├── context/
│   │   ├── AuthContext.tsx    # Auth provider component
│   │   ├── useAuth.ts         # Auth hook
│   │   └── index.ts           # Barrel export
│   │
│   ├── lib/
│   │   └── api.ts             # API client instance
│   │
│   ├── examples/
│   │   └── ApiExample.tsx     # API usage examples
│   │
│   ├── App.tsx                # Router configuration
│   ├── main.tsx               # Application entry point
│   └── index.css              # Tailwind directives
│
├── vite.config.ts             # Vite configuration
└── tsconfig.app.json          # TypeScript config with path aliases
```

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Path Aliases

- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@context` → `src/context/index.ts` (barrel export)
- `@context/*` → `src/context/*` (specific files)
- `@lib/*` → `src/lib/*`
- `@examples/*` → `src/examples/*`
- `@utils/*` → `src/utils/*`

## Routes

### Public Routes (redirect if authenticated)
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes (require authentication)
- `/` - Home page
- `/about` - About page
- `/api-demo` - API demo page

### Other
- `*` - 404 Not Found page

## Authentication

Authentication is managed through `AuthContext`:

```typescript
import { useAuth } from '@context';

const MyComponent = () => {
  const { user, isLoading, isAuthenticated, login, signup, logout } = useAuth();

  // Use auth state and functions
};
```

### Auth Flow

1. User signs up/logs in → Token saved to localStorage
2. `AuthContext` checks token on mount
3. Protected routes use `<ProtectedRoute>` wrapper
4. Public routes use `<PublicRoute>` wrapper
5. Logout clears token and redirects to login

## API Integration

The frontend uses a type-safe API client from `@repo/api-client`:

```typescript
import { api } from '@lib/api';

// All calls are fully typed
const response = await api.auth.login({ email, password });
const user = await api.auth.me();
const health = await api.health.check();
```

## Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Wrap with `<ProtectedRoute>` if authentication required:

```typescript
<Route
  path="/new-page"
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route index element={<NewPage />} />
</Route>
```

## Styling

- Tailwind CSS v4 is configured for styling
- Dark mode support via `dark:` prefix
- Global styles in `src/index.css`
- Component-specific styles use Tailwind utility classes

## Fast Refresh

Vite's Fast Refresh is optimized by separating:
- React components (return JSX)
- Utility functions and hooks (pure functions)

This prevents full page reloads during development.

## Error Handling

The frontend has a comprehensive error handling system to catch and display errors gracefully.

### Error Boundary

The app is wrapped in an `ErrorBoundary` component that catches React rendering errors:

```typescript
// Errors are caught automatically
const MyComponent = () => {
  // If this throws an error during render, ErrorBoundary catches it
  const data = someUndefinedVariable.property; // ❌ Error!
  return <div>{data}</div>;
};
```

**Error Boundary Features:**
- Catches all React rendering errors
- Shows user-friendly fallback UI
- Displays error details in development mode
- Provides "Reload Page" and "Try Again" buttons
- Logs errors to console

### Toast Notifications

Use the toast system to show success/error messages to users:

```typescript
import { toast } from '@components/ToastContainer';

// Show different types of notifications
toast.success('Settings saved successfully!');
toast.error('Failed to update profile');
toast.warning('Your session will expire soon');
toast.info('New features available');
```

**Toast Features:**
- Auto-dismiss after 5 seconds
- Manual dismiss with close button
- Slide-in animation
- Positioned at top-right corner
- Color-coded by type (green, red, yellow, blue)

### API Error Handling

Use utility functions to extract error messages from API errors:

```typescript
import { getErrorMessage, getValidationErrors, isAuthError } from '@utils/error';
import { api } from '@lib/api';
import { toast } from '@components/ToastContainer';

try {
  await api.auth.login(credentials);
  toast.success('Login successful!');
} catch (error) {
  // Extract user-friendly error message
  const message = getErrorMessage(error);
  toast.error(message);

  // Check if it's an auth error
  if (isAuthError(error)) {
    // Handle 401 errors
    navigate('/login');
  }

  // Get all validation errors if present
  const validationErrors = getValidationErrors(error);
  console.log(validationErrors);
}
```

### Error Utility Functions

#### `getErrorMessage(error: unknown): string`
Extracts a user-friendly error message from any error type:

```typescript
import { getErrorMessage } from '@utils/error';

try {
  await api.auth.signup(data);
} catch (error) {
  // Returns: "Email already registered" or "Invalid email format"
  const message = getErrorMessage(error);
  toast.error(message);
}
```

#### `getValidationErrors(error: unknown): string[]`
Gets all validation error messages as an array:

```typescript
import { getValidationErrors } from '@utils/error';

try {
  await api.auth.signup(data);
} catch (error) {
  const errors = getValidationErrors(error);
  // Returns: ["email must be an email", "password must be at least 8 characters"]
  errors.forEach(err => toast.error(err));
}
```

#### `isAuthError(error: unknown): boolean`
Checks if an error is a 401 authentication error:

```typescript
import { isAuthError } from '@utils/error';

try {
  await api.auth.me();
} catch (error) {
  if (isAuthError(error)) {
    // Token expired or invalid
    logout();
    navigate('/login');
  }
}
```

#### `isValidationError(error: unknown): boolean`
Checks if an error contains validation errors:

```typescript
import { isValidationError } from '@utils/error';

try {
  await api.auth.signup(data);
} catch (error) {
  if (isValidationError(error)) {
    // Show all validation errors
    const errors = getValidationErrors(error);
    setFormErrors(errors);
  }
}
```

### Complete Error Handling Example

Here's a full example showing best practices:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '@lib/api';
import { toast } from '@components/ToastContainer';
import { getErrorMessage, isValidationError, getValidationErrors } from '@utils/error';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      const response = await api.auth.signup({ email, password });

      // Success!
      toast.success('Account created successfully!');
      navigate('/');

    } catch (error) {
      // Handle validation errors
      if (isValidationError(error)) {
        const validationErrors = getValidationErrors(error);
        setErrors(validationErrors);
        toast.error('Please fix the errors below');
        return;
      }

      // Handle other errors
      const message = getErrorMessage(error);
      toast.error(message);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
};
```

### Error Handling Best Practices

#### 1. **Always Show User Feedback**
```typescript
// ❌ Bad - Silent failure
try {
  await api.auth.login(credentials);
} catch (error) {
  console.error(error); // User doesn't see anything!
}

// ✅ Good - User sees what happened
try {
  await api.auth.login(credentials);
  toast.success('Login successful!');
} catch (error) {
  toast.error(getErrorMessage(error));
}
```

#### 2. **Use Loading States**
```typescript
// ✅ Good - Shows loading state
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await api.auth.login(credentials);
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    setIsLoading(false); // Always reset loading state
  }
};
```

#### 3. **Handle Specific Error Cases**
```typescript
// ✅ Good - Handle different error types
try {
  await api.posts.create(data);
} catch (error) {
  if (isAuthError(error)) {
    toast.error('Please log in to create a post');
    navigate('/login');
  } else if (isValidationError(error)) {
    setFormErrors(getValidationErrors(error));
  } else {
    toast.error('Failed to create post. Please try again.');
  }
}
```

#### 4. **Provide Context in Error Messages**
```typescript
// ❌ Bad - Generic message
toast.error('An error occurred');

// ✅ Good - Specific message
toast.error('Failed to save your profile. Please try again.');
```

#### 5. **Log Errors for Debugging**
```typescript
// ✅ Good - Log for debugging, show toast for users
try {
  await api.auth.login(credentials);
} catch (error) {
  console.error('Login error:', error); // Debug info
  toast.error(getErrorMessage(error));  // User-friendly message
}
```

### Error Types Reference

| Error Type | Status Code | When It Happens | How to Handle |
|------------|-------------|-----------------|---------------|
| Validation Error | 400 | Invalid input data | Show field errors, use `getValidationErrors()` |
| Auth Error | 401 | Token expired/invalid | Redirect to login, clear auth state |
| Forbidden | 403 | Insufficient permissions | Show "Access Denied" message |
| Not Found | 404 | Resource doesn't exist | Navigate to 404 page or show not found message |
| Conflict | 409 | Duplicate resource | Show specific error (e.g., "Email already exists") |
| Server Error | 500 | Backend failure | Show generic error, log for debugging |
| Network Error | - | No internet connection | Show "Check your connection" message |

### Testing Error Handling

When developing, you can test error scenarios:

```typescript
// Simulate different error types
const testErrors = async () => {
  // Test validation error
  try {
    await api.auth.signup({ email: 'invalid', password: '123' });
  } catch (error) {
    console.log('Validation error:', getValidationErrors(error));
  }

  // Test auth error
  try {
    // Use invalid token
    await api.auth.me();
  } catch (error) {
    console.log('Is auth error:', isAuthError(error));
  }
};
```

### Future Improvements

The current error handling is minimal but effective. Consider adding:

1. **Error Tracking Service** (Sentry, LogRocket)
   ```typescript
   // Future: Send errors to tracking service
   Sentry.captureException(error);
   ```

2. **Retry Logic**
   ```typescript
   // Future: Auto-retry failed requests
   const response = await retryRequest(() => api.auth.me(), 3);
   ```

3. **Offline Detection**
   ```typescript
   // Future: Show offline banner
   if (!navigator.onLine) {
     toast.warning('You are offline');
   }
   ```

### Quick Reference

```typescript
// Import error utilities
import { getErrorMessage, getValidationErrors, isAuthError } from '@utils/error';
import { toast } from '@components/ToastContainer';

// Show notifications
toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
toast.info('Info message');

// Handle errors
try {
  await api.someEndpoint();
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message);
}
```

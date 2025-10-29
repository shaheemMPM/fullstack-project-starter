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

# Project Context

## Project Overview
Full-stack monorepo starter with NestJS backend, React frontend, and type-safe API client.

## Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: class-validator and class-transformer

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State Management**: React Context API (AuthContext)

### Shared
- **Package Manager**: pnpm with workspaces
- **Linting/Formatting**: Biome
- **Type Safety**: Shared types between backend and frontend via api-client package

## Project Structure

```
project-starter/
├── apps/
│   ├── backend/              # NestJS API
│   │   ├── src/
│   │   │   ├── modules/      # Feature modules (auth, health, etc.)
│   │   │   ├── db/           # Database schema and client
│   │   │   ├── types/        # Shared type definitions
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── tsconfig.json
│   │
│   └── frontend/             # React app
│       ├── src/
│       │   ├── components/   # Reusable components (Layout, ProtectedRoute)
│       │   ├── pages/        # Page components (HomePage, LoginPage, etc.)
│       │   ├── context/      # React contexts (AuthContext)
│       │   ├── lib/          # Utilities and API client instance
│       │   ├── examples/     # Example components
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── tsconfig.app.json
│       └── vite.config.ts
│
├── packages/
│   └── api-client/           # Shared API client with type safety
│       ├── src/
│       │   ├── index.ts
│       │   └── types.ts      # Re-exports types from backend
│       └── package.json
│
└── package.json              # Workspace root
```

## Path Aliases

### Backend (`apps/backend/tsconfig.json`)
- `@/*` → `src/*`
- `@modules/*` → `src/modules/*`
- `@db` → `src/db/index.ts`
- `@db/*` → `src/db/*`
- `@types` → `src/types/index.ts`
- `@types/*` → `src/types/*`

### Frontend (`apps/frontend/tsconfig.app.json` + `vite.config.ts`)
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@context/*` → `src/context/*`
- `@lib/*` → `src/lib/*`
- `@examples/*` → `src/examples/*`

## Key Conventions

### 1. Arrow Functions
Always use arrow functions for component definitions and exported functions:
```typescript
// ✓ Good
export const MyComponent = () => { ... }
const myFunction = () => { ... }

// ✗ Bad
export function MyComponent() { ... }
function myFunction() { ... }
```

### 2. Type Sharing
- Response types are defined once in backend `.types.ts` files (no dependencies)
- DTOs are duplicated as plain types in `backend/src/types/index.ts` (due to decorators)
- Frontend imports types from `@repo/api-client` which re-exports from backend

### 3. Path Aliases
- When creating highly reusable directories, always create a corresponding path alias
- Update both `tsconfig.json` and `vite.config.ts` for frontend aliases
- Use aliases consistently across the codebase

### 4. Authentication Flow
1. User visits protected route → redirected to `/login`
2. User signs up or logs in → JWT stored in localStorage
3. AuthContext manages auth state globally
4. ProtectedRoute component guards authenticated pages
5. Logout clears token and redirects to login

### 5. API Client Usage
```typescript
import { api } from '@lib/api';

// All API calls are type-safe
const health = await api.health.check();
const response = await api.auth.login({ email, password });
const user = await api.auth.me();
```

## Important Files

### Backend
- `src/main.ts` - Application entry point with bootstrap function
- `src/app.module.ts` - Root module with global JWT guard
- `src/modules/auth/auth.service.ts` - Authentication logic
- `src/db/index.ts` - Database client and schema exports
- `src/types/index.ts` - Central type export point

### Frontend
- `src/App.tsx` - Router configuration with protected routes
- `src/context/AuthContext.tsx` - Authentication state management
- `src/components/Layout.tsx` - Main layout with navigation
- `src/components/ProtectedRoute.tsx` - Route protection HOC
- `src/lib/api.ts` - API client instance

### Shared
- `packages/api-client/src/index.ts` - Type-safe API client
- `packages/api-client/src/types.ts` - Type re-exports from backend

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend
No environment variables required (uses Vite proxy for API calls)

## Development Commands

```bash
# Install dependencies
pnpm install

# Start all apps
pnpm dev

# Run backend only
pnpm --filter backend dev

# Run frontend only
pnpm --filter frontend dev

# Database operations
pnpm --filter backend db:push
pnpm --filter backend db:studio

# Linting/Formatting
pnpm lint
pnpm format
```

## Notes for Future Development

1. **Adding New Directories**: When adding highly reusable directories (like `hooks/`, `utils/`, etc.), create corresponding path aliases
2. **Type Safety**: Always maintain single source of truth for types - define in backend, re-export through api-client
3. **Protected Routes**: Wrap new protected routes with `<ProtectedRoute>` component
4. **Code Style**: Use Biome for formatting - configured in `.vscode/settings.json` to format on save
5. **Authentication**: Use `useAuth()` hook to access auth state and functions throughout the app

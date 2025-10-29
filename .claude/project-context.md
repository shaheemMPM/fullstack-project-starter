# Project Context

## Project Overview
Full-stack monorepo starter with NestJS backend, React frontend, and type-safe API client.

## Project Purpose and User Context

### Purpose
This is a **reusable starter template** for hobby side projects. The goal is to eliminate repetitive setup time and provide a solid foundation for building full-stack applications quickly.

### User Context
- **Experience**: 7+ years of coding experience
- **Time Constraints**: Working on this after full-time job, so time is limited
- **Usage Pattern**: Will be used to spin up multiple side projects without spending days on initial setup
- **Philosophy**: Pragmatic approach - get things working well without being overly strict or complex

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

## Development Philosophy

### Core Principles
1. **TypeScript Everywhere** - Full type safety across backend, frontend, and shared packages
2. **Pragmatic, Not Overly Strict** - Balance between best practices and getting things done
3. **Minimal to Start** - Only add what's needed; avoid over-engineering
4. **Learn New Tools** - Opportunity to try new technologies (React Router v7, Biome, Drizzle)
5. **Reusability** - Create once, use for multiple projects

### Technology Decisions

#### Why Biome over ESLint + Prettier?
- **Performance**: 25-100x faster than ESLint
- **Simplicity**: Single tool instead of two separate configurations
- **Modern**: Built in Rust, designed for the current JS/TS ecosystem
- **VSCode Integration**: Format on save configured in `.vscode/settings.json`

#### Why Drizzle ORM over Prisma?
- **Performance**: Smaller bundle size, better runtime performance
- **Full SQL Control**: Write raw SQL when needed without fighting the ORM
- **Type Safety**: Excellent TypeScript support without codegen
- **PostgreSQL-first**: Direct mapping to PostgreSQL features
- **Push vs Migrate**: Simpler workflow with `db:push` for development

#### Why React Router v7?
- **Latest Version**: User wanted to try v7 as a routing library (uses Remix v3 framework elsewhere)
- **Modern API**: Better TypeScript support and cleaner component patterns
- **Learning Opportunity**: Chance to explore new version

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

### 1. Code Style Preferences (Biome Configuration)

#### Arrow Functions (ENFORCED)
Always use arrow functions for component definitions and exported functions:
```typescript
// ✓ Good
export const MyComponent = () => { ... }
const myFunction = () => { ... }
const bootstrap = async () => { ... }

// ✗ Bad
export function MyComponent() { ... }
function myFunction() { ... }
async function bootstrap() { ... }
```

**Biome Rule**: `style.useArrowFunction` - Enforces arrow functions except in specific cases (class methods, object methods, function with `this`, generators)

#### JSX String Attributes (ENFORCED)
Do not use curly braces for JSX string attributes:
```typescript
// ✓ Good
<Component className="text-red-500" />

// ✗ Bad
<Component className={"text-red-500"} />
```

**Biome Rule**: `complexity.useLiteralKeys` - Enforces direct string literals without braces

#### Async/Await Over Promises (ENFORCED)
Prefer async/await over raw promise chains:
```typescript
// ✓ Good
const result = await fetchData();

// ✗ Bad
fetchData().then(result => { ... });
```

**Biome Rule**: `complexity.useAwait` - Requires await instead of promise chains in async functions

### 2. Type Sharing
- Response types are defined once in backend `.types.ts` files (no dependencies)
- DTOs are duplicated as plain types in `backend/src/types/index.ts` (due to decorators)
- Frontend imports types from `@repo/api-client` which re-exports from backend

### 3. Type Sharing Architecture
**Problem**: Backend DTOs use decorators (class-validator) which can't be directly re-exported.

**Solution**:
- **Response types** (no decorators): Defined in backend `.types.ts` files → exported via `backend/src/types/index.ts` → re-exported by `api-client/src/types.ts`
- **DTO types** (have decorators): Duplicated as plain interfaces in `backend/src/types/index.ts` → re-exported by `api-client/src/types.ts`
- Frontend imports all types from `@repo/api-client`

### 4. Path Aliases
- When creating highly reusable directories, always create a corresponding path alias
- Update both `tsconfig.json` and `vite.config.ts` for frontend aliases
- Use aliases consistently across the codebase

### 5. Authentication Flow
1. User visits protected route → redirected to `/login`
2. User signs up or logs in → JWT stored in localStorage
3. AuthContext manages auth state globally
4. ProtectedRoute component guards authenticated pages
5. Logout clears token and redirects to login

### 6. API Client Usage
```typescript
import { api } from '@lib/api';

// All API calls are type-safe
const health = await api.health.check();
const response = await api.auth.login({ email, password });
const user = await api.auth.me();
```

**Critical Implementation Detail**: The API client uses a callback pattern to ensure tokens are saved to localStorage:
- `AuthEndpoints` accepts `onTokenChange` callback in constructor
- When login/signup succeeds, it calls `onTokenChange(token)` instead of directly setting token
- The `Api` class passes `this.setToken.bind(this)` as the callback
- `Api.setToken()` saves to both memory (ApiClient) and localStorage (TokenStorage)

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

## Database Setup (Drizzle ORM)

### Schema Location
`apps/backend/src/db/schema.ts` - Define all database tables using Drizzle schema

### Development Workflow
```bash
# Push schema changes to database (no migrations)
pnpm --filter backend db:push

# Open Drizzle Studio to view/edit data
pnpm --filter backend db:studio
```

### Why `db:push` instead of migrations?
- **Simpler**: No migration files to manage during development
- **Faster iteration**: Change schema, push, test immediately
- **Production**: Use proper migrations (`drizzle-kit generate`) when ready for production

### Connection
Database client initialized in `apps/backend/src/db/index.ts` using `DATABASE_URL` environment variable.

## Notes for Future Development

1. **Adding New Directories**: When adding highly reusable directories (like `hooks/`, `utils/`, etc.), create corresponding path aliases
2. **Type Safety**: Always maintain single source of truth for types - define in backend, re-export through api-client
3. **Protected Routes**: Wrap new protected routes with `<ProtectedRoute>` component
4. **Code Style**: Use Biome for formatting - configured in `.vscode/settings.json` to format on save
5. **Authentication**: Use `useAuth()` hook to access auth state and functions throughout the app
6. **Public Decorator**: Use `@Public()` decorator in NestJS controllers to bypass JWT guard for specific endpoints
7. **Token Persistence**: Never bypass the `Api.setToken()` method - always use it to ensure localStorage is updated

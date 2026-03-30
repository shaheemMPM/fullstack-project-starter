# Project Starter Context

This file is a runtime/context snapshot for contributors and AI tools.

For editing guardrails, quality gates, and execution rules, read `AGENTS.md` first.

## What This Is

A reusable full-stack monorepo starter template with:
- a backend API (`apps/backend`)
- a frontend SPA (`apps/frontend`)
- a shared type-safe API client (`packages/api-client`)

Designed to eliminate repetitive setup for new projects. Spin up, rename, and start building.

## Current Architecture Reality

### Backend (`apps/backend`)
- NestJS with TypeScript
- PostgreSQL via Drizzle ORM (schema-first, no Prisma)
- JWT authentication with Passport (bcrypt password hashing)
- Validation via class-validator and class-transformer
- BullMQ with Redis for job queues
- Bull Board at `/admin/queues` (password-protected)
- Global JWT guard (use `@Public()` to bypass)
- Global `HttpExceptionFilter` for structured error responses
- CORS enabled in development only
- Static frontend serving in production

### Frontend (`apps/frontend`)
- React 19 with TypeScript and Vite
- Tailwind CSS v4
- React Router v7 for routing
- TanStack Form for form management
- Zod for validation
- AuthContext for authentication state
- ProtectedRoute and PublicRoute wrappers
- ErrorBoundary and Toast system

### API Client (`packages/api-client`)
- Type-safe HTTP client with endpoint wrappers
- Re-exports all response/DTO types from backend
- Token management with localStorage persistence
- 401 handling with `onAuthError` callback
- Must be rebuilt (`pnpm --filter @repo/api-client build`) after type changes

## Type Sharing Architecture

- **Response types** (no decorators): defined in backend module `.types.ts` files -> exported via `backend/src/types/index.ts` -> re-exported by `api-client/src/types.ts`
- **DTO types** (have class-validator decorators): duplicated as plain interfaces in `backend/src/types/index.ts` -> re-exported by `api-client/src/types.ts`
- Frontend imports all types from `@repo/api-client`

## Authentication Flow

1. User visits protected route -> redirected to `/login`
2. User signs up or logs in -> JWT stored in localStorage
3. AuthContext manages auth state globally (checks `api.auth.me()` on mount)
4. ProtectedRoute guards authenticated pages
5. PublicRoute redirects authenticated users away from login/signup
6. Logout clears token and redirects to login

**Critical**: The API client uses a callback pattern — `AuthEndpoints` calls `onTokenChange(token)` on login/signup. `Api.setToken()` saves to both memory (ApiClient) and localStorage (TokenStorage). Never bypass this.

## Path Aliases

### Backend (`apps/backend/tsconfig.json`)
- `@/*` -> `src/*`
- `@modules/*` -> `src/modules/*`
- `@db/*` -> `src/db/*`
- `@types/*` -> `src/types/*`
- `@common/*` -> `src/common/*`
- `@shared/*` -> `src/shared/*`

### Frontend (`apps/frontend/tsconfig.app.json` + `vite.config.ts`)
- `@/*` -> `src/*`
- `@components/*` -> `src/components/*`
- `@pages/*` -> `src/pages/*`
- `@context/*` -> `src/context/*`
- `@lib/*` -> `src/lib/*`
- `@utils/*` -> `src/utils/*`

## Environment Notes

- Root `.env` holds all environment variables (see `.env.example` as template)
- Backend reads `.env` via `dotenv -e ../../.env` in scripts
- Frontend uses Vite proxy (`/api` -> `http://localhost:3000`), no `VITE_*` vars needed in dev
- Redis required for BullMQ job queues

### Variables
```
DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV, PORT, CORS_ORIGIN
REDIS_URL, BULL_BOARD_PASSWORD, VITE_API_URL (optional)
```

## Code Quality Snapshot

Primary quality commands (run based on touched scope):
- `pnpm check:write` — Biome format + lint with auto-fix
- `pnpm typecheck` — runs all workspace typechecks via Turbo
- `pnpm --filter backend typecheck` — backend only
- `pnpm --filter frontend typecheck` — frontend only
- `pnpm --filter @repo/api-client typecheck` — api-client only

Pre-push hook (`.husky/pre-push`) runs Biome check plus typechecks for all packages and apps.

## Reload Checklist

When resuming work after context loss:

1. Read `AGENTS.md`.
2. Read this file (`CLAUDE.md`).
3. Re-open the service entrypoints you will touch.
4. Re-open relevant schema and type files before changing cross-service behavior.

## Cross Reference

- Execution contract and editing policy: `AGENTS.md`
- Starter usage guide: `STARTER.md`

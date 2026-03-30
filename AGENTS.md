# AI Agent Guide (Project Starter)

This repository is actively edited by humans and AI tools.
Use this file as the primary execution contract for AI-assisted changes.

## Read Order (Before Editing)

1. `AGENTS.md` (this file)
2. `CLAUDE.md` (project context + runtime snapshot)
3. Files nearest to the area you will edit
4. Existing patterns in touched modules

If anything conflicts, follow this file for edit behavior and quality gates.

## Repository Map

### Apps
- `apps/backend` — NestJS API server (auth, business logic, database access)
- `apps/frontend` — React SPA (routing, UI, auth state management)

### Packages
- `packages/api-client` — type-safe HTTP client, endpoint wrappers, shared type re-exports

## Canonical Decision Rules

### 1) App Boundaries
- `apps/backend` owns all business logic, database access, and API endpoints. No database queries elsewhere.
- `apps/frontend` is the user-facing SPA. All routing, UI components, and client-side state live here.
- `packages/api-client` is the bridge: type-safe endpoint wrappers and shared types. No business logic, no UI code.

### 2) Type Sharing Boundaries
- Response types are defined once in backend module `.types.ts` files.
- DTO types are duplicated as plain interfaces in `backend/src/types/index.ts` (decorators cannot be re-exported).
- `packages/api-client/src/types.ts` re-exports everything from backend.
- Frontend imports types only from `@repo/api-client`.
- After changing types in backend, rebuild api-client: `pnpm --filter @repo/api-client build`.

### 3) Backend Module Structure
- Each feature module lives in `apps/backend/src/modules/<name>/`.
- A module typically contains: `<name>.module.ts`, `<name>.controller.ts`, `<name>.service.ts`, `<name>.types.ts`, and one or more `<name>.dto.ts` files.
- Schema files live in `apps/backend/src/db/schema/`, not inside modules.
- Use `@CurrentUser()` to access the authenticated user in controllers.
- Use `@Public()` decorator to bypass JWT guard for specific endpoints.

### 4) Frontend Conventions
- Use `useAuth()` for authentication state and actions.
- Wrap authenticated routes with `<ProtectedRoute>`.
- Wrap public-only routes (login, signup) with `<PublicRoute>`.
- Use path aliases (`@components/*`, `@pages/*`, `@lib/*`, etc.) for imports.
- Use TanStack Form for form state management.

### 5) Code Style (Biome Enforced)
- **Arrow functions required.** No `function` declarations for components or exports.
- **Single quotes.** Biome enforces single-quote strings.
- **No curly braces for JSX string attributes.** Use `className="..."` not `className={"..."}`.
- **Async/await over promise chains.** Prefer `await` over `.then()`.
- **Trailing commas.** Biome enforces trailing commas in multi-line structures.
- **Tab indentation, 80-character line width.**
- Run `pnpm check:write` to auto-fix formatting and lint issues.

### 6) Database and Schema Conventions
- Drizzle ORM is the only database access layer. No raw SQL unless Drizzle cannot express the query.
- Schema files live in `apps/backend/src/db/schema/`.
- Use `db:push` during development for fast iteration. Use `db:generate` + `db:migrate` for production.
- Do not hand-edit Drizzle migration files in `src/db/migrations/`. Run `pnpm --filter backend db:generate` to create them.

### 7) Generated Files
- Do not hand-edit files in `apps/backend/src/db/migrations/`.
- Do not hand-edit `packages/api-client/dist/`. Run `pnpm --filter @repo/api-client build` to regenerate.
- When schema changes require a migration, update the schema first, then run `pnpm --filter backend db:generate`.

### 8) Keep Documentation Clean
- Keep operational truth in `CLAUDE.md`, `AGENTS.md`, and active configs.
- Do not create new documentation files unless explicitly asked.

### 9) Keep New Files Small
- When creating new files, prefer splitting responsibilities before a file grows past roughly 500 lines.
- For UI work, split route-level pages, list views, forms, modals, and shared helpers into focused modules.
- Barrel/index files are fine for stable re-exports, but keep implementation out of them.

## Required Checks Before Handoff

Run the quality checks relevant to touched areas:

- `pnpm check:write`
- `pnpm --filter backend typecheck`
- `pnpm --filter frontend typecheck`
- `pnpm --filter @repo/api-client typecheck`

Only run what is relevant to changed areas. Run broader checks (`pnpm typecheck`) when cross-cutting changes are made.

If types changed in the backend:
1. Rebuild api-client first: `pnpm --filter @repo/api-client build`
2. Then typecheck downstream consumers (frontend)

The `.husky/pre-push` hook enforces these automatically before every push. Do not skip hooks (`--no-verify`) unless the user explicitly asks.

## Cross Reference

For project status, architecture reality, and reload checklist, see `CLAUDE.md`.

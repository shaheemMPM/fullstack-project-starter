# ADR 005: Using dotenv-cli for Environment Variables

**Date:** 2025-10-29
**Status:** Implemented

## Problem

Initial approach had `dotenv` package imported in runtime code (`main.ts`), but:
1. dotenv was installed as dev dependency
2. Runtime code tried to use it → would fail in production
3. Production environments provide env vars natively (Docker, cloud platforms)

## Solution

Use `dotenv-cli` as a command wrapper instead of importing dotenv in code.

## Implementation

### Package Installation
```json
// Root package.json
{
  "devDependencies": {
    "dotenv-cli": "^11.0.0"
  }
}
```

Installed at **workspace root** because:
- `.env` file is at root
- `pnpm dev` runs from root
- All apps can use it

### Backend Script Update
```json
// apps/backend/package.json
{
  "scripts": {
    "dev": "dotenv -e ../../.env -- nest start --watch"
  }
}
```

### How It Works

**Development:**
```bash
pnpm dev
└── turbo dev
    ├── frontend dev → vite (no env needed)
    └── backend dev → dotenv -e ../../.env -- nest start --watch
                      ↑ Loads .env and injects into shell context
                      ↑ Then runs nest command with env vars available
```

**Production:**
```bash
node dist/main
# No dotenv-cli needed
# Environment variables provided by platform (Docker, Kubernetes, cloud services)
```

## Comparison with Previous Approach

### ❌ Old Approach (Runtime Import)
```ts
// main.ts
import * as dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '..', '..', '..', '.env') });
```

**Problems:**
- dotenv in runtime code
- Would fail in production (dev dependency)
- Mixed concerns (app code loading env)

### ✅ New Approach (CLI Wrapper)
```json
"dev": "dotenv -e ../../.env -- nest start --watch"
```

**Benefits:**
- No dotenv code in application
- dotenv-cli only in dev scripts
- Production code is clean
- Environment loading separated from app logic

## Similar Patterns

This approach is widely used in monorepos:

```json
// Example patterns
"dev:backend": "dotenv -- pnpm --filter backend dev"
"dev:frontend": "dotenv -- pnpm --filter frontend dev"
"migrate": "dotenv -- pnpm --filter @app/db migrate"
```

## Consequences

**Positive:**
- Clean separation of concerns
- No runtime dependency on dotenv
- Production code doesn't touch env loading
- Same pattern used by many production projects
- dotenv-cli only needed in development

**Negative:**
- None - this is the industry-standard approach

## Files Modified
- Root `package.json` - Added `dotenv-cli` as dev dependency
- `apps/backend/package.json` - Updated dev script to use dotenv-cli
- `apps/backend/src/main.ts` - Removed dotenv import
- Removed custom `scripts/load-env.js` (not needed)

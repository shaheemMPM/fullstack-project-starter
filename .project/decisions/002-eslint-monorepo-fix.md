# ADR 002: Fix ESLint TSConfig Root Dir in Monorepo

**Date:** 2025-10-29
**Status:** Resolved

## Problem

ESLint TypeScript parser was throwing error in monorepo:
```
Parsing error: No tsconfigRootDir was set, and multiple candidate TSConfigRootDirs are present
```

This happens because ESLint finds multiple `tsconfig.json` files (backend and frontend) and doesn't know which one to use.

## Solution

### Frontend (apps/frontend/eslint.config.js)
Added explicit `tsconfigRootDir` in parser options:
```js
parserOptions: {
  project: './tsconfig.json',
  tsconfigRootDir: __dirname,
}
```

### Backend (apps/backend/eslint.config.mjs)
Already had `tsconfigRootDir: import.meta.dirname` set correctly by NestJS CLI.

## Implementation Details

- Used `fileURLToPath` and `path.dirname` to get `__dirname` in ESM module (frontend)
- Backend uses newer `import.meta.dirname` (Node 20.11+)
- Both now explicitly point to their own tsconfig.json

## Consequences

**Positive:**
- No more parsing errors in IDE
- Each app uses its own TypeScript configuration
- ESLint works correctly in monorepo context

**Negative:**
- None (standard monorepo practice)

## Notes

This is a temporary fix. Will be replaced when migrating to Biome.

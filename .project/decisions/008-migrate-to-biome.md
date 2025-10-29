# ADR 008: Migrate from ESLint + Prettier to Biome

**Date:** 2025-10-29
**Status:** Implemented

## Decision

Replace ESLint and Prettier with Biome for linting and formatting across the entire monorepo.

## Rationale

### Why Biome?

1. **Single Tool** - Replaces both ESLint and Prettier
2. **Performance** - Written in Rust, 25x faster than ESLint
3. **Zero Config** - Sensible defaults out of the box
4. **Better DX** - Clearer error messages, better diagnostics
5. **Modern** - Built for monorepos, active development

### Problems with ESLint + Prettier

- Two separate tools to maintain
- Config complexity in monorepos
- Slow on large codebases
- Conflicts between ESLint and Prettier rules
- Heavy node_modules footprint

## Implementation

### 1. Installed Biome
```bash
pnpm add -D -w @biomejs/biome
```

### 2. Removed ESLint/Prettier

**Backend removed:**
- eslint
- prettier
- eslint-config-prettier
- eslint-plugin-prettier
- @eslint/eslintrc
- @eslint/js
- typescript-eslint
- globals

**Frontend removed:**
- eslint
- @eslint/js
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- typescript-eslint
- globals

### 3. Configuration

Created `biome.json` at root with:
- Tab indentation
- 80 character line width
- Single quotes for JS
- Trailing commas
- Recommended lint rules
- Disabled `noExplicitAny` (pragmatic TypeScript)
- Disabled `noNonNullAssertion` (sometimes necessary)
- VCS integration with Git
- Respects `.gitignore`

### 4. Scripts Added

**Root package.json:**
```json
{
  "lint": "turbo lint",        // Runs lint in all apps
  "format": "biome format --write .",  // Format all files
  "check": "biome check .",     // Lint + format check
  "check:write": "biome check --write .",  // Fix all issues
  "ci": "biome ci ."            // CI mode (no writes)
}
```

**App package.json:**
```json
{
  "lint": "biome lint ."
}
```

### 5. Removed Config Files
- `apps/backend/eslint.config.mjs`
- `apps/backend/.prettierrc`
- `apps/frontend/eslint.config.js`

### 6. Applied Formatting
Ran `biome check --write` which:
- Fixed 19 files automatically
- Applied consistent formatting
- Sorted imports
- Added `node:` protocol to Node.js imports

## Configuration Details

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.2/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "off"
      },
      "style": {
        "noNonNullAssertion": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all"
    }
  }
}
```

## Usage

**Local development:**
```bash
pnpm lint            # Check all apps via Turbo
pnpm format          # Format all files
pnpm check:write     # Fix all issues
```

**CI/CD:**
```bash
pnpm ci              # Read-only check for CI
```

**Per-app:**
```bash
cd apps/backend && pnpm lint
cd apps/frontend && pnpm lint
```

## Impact

### Before:
- 2 tools (ESLint + Prettier)
- ~100+ dependencies across apps
- Slow linting (~2-3 seconds)
- Complex configuration

### After:
- 1 tool (Biome)
- 2 dependencies
- Fast linting (~18ms for 22 files)
- Simple configuration

## Benefits

1. **Faster** - 25x faster than ESLint
2. **Simpler** - Single tool, single config
3. **Consistent** - Same rules everywhere
4. **Modern** - Node.js protocol enforcement, import sorting
5. **Better errors** - Clear, actionable messages
6. **Monorepo-friendly** - Built for this use case

## Trade-offs

**Pros:**
- Much faster
- Simpler setup
- Single tool to learn
- Active development

**Cons:**
- Fewer plugins than ESLint ecosystem (but growing)
- Some rules not 1:1 with ESLint (minor)

## Migration Notes

- All existing code formatted to Biome standards
- No breaking changes to functionality
- Codebase now uses tabs (Biome default)
- Node.js imports now use `node:` protocol (best practice)

## Files Modified

- Root `package.json` - Added Biome, removed old scripts
- `biome.json` - Created configuration
- `apps/backend/package.json` - Updated lint script, removed deps
- `apps/frontend/package.json` - Updated lint script, removed deps
- All source files - Formatted with Biome

## Future

Biome continues to add features:
- GraphQL support
- CSS support
- More lint rules
- Plugin system

We're well-positioned to adopt these as they become available.

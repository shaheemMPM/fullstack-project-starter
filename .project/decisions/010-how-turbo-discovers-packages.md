# How Turbo Discovers Packages

**Date:** 2025-10-29

## Question
How does Turbo know which are apps and which are packages? Does it look for `apps/` and `packages/` directories by default?

## Answer

**No, Turbo doesn't have hardcoded directories.** Instead, it reads your **workspace configuration** from your package manager (pnpm, npm, yarn).

---

## How It Works

### 1. Turbo Reads Workspace Config

Turbo looks at your `pnpm-workspace.yaml` (or `package.json` workspaces field for npm/yarn) to discover all packages.

**Our `pnpm-workspace.yaml`:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This tells pnpm (and Turbo) where to find workspaces:
- Look in `apps/*` (finds `apps/backend`, `apps/frontend`)
- Look in `packages/*` (currently empty, but ready for shared packages)

### 2. Turbo Builds Dependency Graph

Turbo scans each package's `package.json` to:
- Find the package name
- Find dependencies between packages
- Understand the workspace structure

**Example:**
```
Root (project-starter)
├── apps/backend (name: "backend")
├── apps/frontend (name: "frontend")
└── packages/ (empty for now)
```

---

## What if We Used Different Directories?

You can use **any directory structure** you want:

### Example 1: Different Names
```yaml
# pnpm-workspace.yaml
packages:
  - 'services/*'    # Instead of apps
  - 'libs/*'        # Instead of packages
```

Turbo would discover packages in `services/` and `libs/`.

### Example 2: Flat Structure
```yaml
# pnpm-workspace.yaml
packages:
  - 'backend'
  - 'frontend'
  - 'shared'
```

All packages at root level.

### Example 3: Deeply Nested
```yaml
# pnpm-workspace.yaml
packages:
  - 'workspaces/applications/*'
  - 'workspaces/libraries/*'
```

Turbo would look in those nested directories.

---

## Apps vs Packages - Naming Convention

**Important:** The distinction between "apps" and "packages" is just a **convention**, not a Turbo requirement.

### Common Conventions:

**`apps/`** (Applications)
- Deployable applications
- Have a build output that runs
- Examples: backend API, frontend website, admin dashboard

**`packages/`** (Libraries/Shared Code)
- Reusable code libraries
- Imported by apps
- Examples: shared types, UI components, utilities

**Turbo doesn't care about the names** - it only cares about:
1. The paths in `pnpm-workspace.yaml`
2. The dependency relationships between packages

---

## Our Current Setup

**Workspace Config (`pnpm-workspace.yaml`):**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Discovered by Turbo:**
- `apps/backend` → Package name: "backend"
- `apps/frontend` → Package name: "frontend"
- `packages/*` → (none yet, but ready)

**Turbo Commands:**
```bash
turbo dev       # Runs in backend + frontend
turbo build     # Runs in backend + frontend
turbo lint      # Runs in backend + frontend
```

---

## Future: Adding Shared Packages

When you add a shared package:

```
packages/
└── shared-types/
    └── package.json  (name: "@project/shared-types")
```

**With dependency:**
```json
// apps/backend/package.json
{
  "dependencies": {
    "@project/shared-types": "workspace:*"
  }
}
```

**Turbo automatically understands:**
```
@project/shared-types (in packages/)
         ↓
       backend (depends on shared-types)
         ↓
When you run: turbo build
```

Turbo will:
1. Build `@project/shared-types` first
2. Then build `backend` (since it depends on shared-types)

---

## Key Takeaways

1. **Turbo reads your workspace config** (`pnpm-workspace.yaml`, not hardcoded paths)
2. **Directory names don't matter** (`apps/`, `packages/`, `services/`, etc. - your choice)
3. **Convention matters for humans**, not for Turbo (but helps organization)
4. **Dependency graph is automatic** - Turbo reads `package.json` dependencies
5. **You can change structure anytime** - just update `pnpm-workspace.yaml`

---

## Turbo Discovery Flow

```
1. Turbo starts
   ↓
2. Reads pnpm-workspace.yaml
   ↓
3. Discovers: apps/backend, apps/frontend, packages/*
   ↓
4. Scans each package.json
   ↓
5. Builds dependency graph
   ↓
6. Executes tasks respecting dependencies
```

---

## Summary

**Question:** How does Turbo know about apps and packages?

**Answer:** Turbo reads `pnpm-workspace.yaml` (or equivalent workspace config). The `apps/` and `packages/` naming is just a convention - you can use any structure you want.

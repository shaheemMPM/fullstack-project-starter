# ADR 003: Backend Architecture Improvements

**Date:** 2025-10-29
**Status:** Implemented

## Changes

### 1. Clean App Module
**Decision:** Keep AppModule as a module-only container, no controllers or services.

**Rationale:**
- Better separation of concerns
- AppModule should orchestrate, not implement
- Easier to manage as app grows

**Implementation:**
- Created `src/modules/` directory for feature modules
- Created `HealthModule` with controller and service
- AppModule now only imports other modules

### 2. Module Organization
**Structure:**
```
src/
├── app.module.ts       # Module-only, imports other modules
├── main.ts             # Bootstrap and config
└── modules/
    └── health/         # Feature modules go here
        ├── health.module.ts
        ├── health.controller.ts
        └── health.service.ts
```

### 3. Global API Prefix
**Decision:** Use `app.setGlobalPrefix('api')` instead of per-controller `@Controller('api')`.

**Rationale:**
- No need to prefix every controller
- Cleaner controller code
- Consistent API routing convention
- All routes automatically namespaced under `/api`

**Implementation:**
- Added `app.setGlobalPrefix('api')` in main.ts
- Controllers now use their feature name: `@Controller('health')` → `/api/health`

### 4. Static File Serving
**Decision:** Moved from ServeStaticModule to native Express static serving in main.ts.

**Rationale:**
- More control in bootstrap
- Conditional serving (only if dist exists)
- Removed dependency on @nestjs/serve-static
- Simpler, more explicit

**Implementation:**
- Use `app.useStaticAssets()` directly
- Check if frontend dist exists before serving
- Falls back gracefully in development

### 5. Bootstrap Error Handling
**Decision:** Added `.catch()` to bootstrap call with proper error handling.

**Rationale:**
- Fixes `@typescript-eslint/no-floating-promises` warning
- Proper error logging on startup failure
- Graceful exit with error code

**Implementation:**
```ts
bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
```

### 6. Test Files
**Decision:** Removed default test files, kept test configuration.

**Rationale:**
- Dummy tests not needed in starter
- Keep Jest config for future tests
- Reduce clutter

**Removed:**
- `src/app.controller.spec.ts`
- `test/` directory
- Unused `app.controller.ts` and `app.service.ts`

## Consequences

**Positive:**
- Cleaner, more scalable architecture
- Better separation of concerns
- Easier to add new modules
- No linting warnings
- Professional NestJS structure

**Negative:**
- None - these are all best practices

## API Routes

- Health check: `GET /api/health`
- Future routes: `GET /api/{module}/{endpoint}`

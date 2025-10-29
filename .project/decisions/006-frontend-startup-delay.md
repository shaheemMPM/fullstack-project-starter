# ADR 006: Frontend Startup Delay to Prevent Race Condition

**Date:** 2025-10-29
**Status:** Implemented

## Problem

When running `pnpm dev`, frontend (Vite) starts faster than backend (NestJS), causing proxy errors:

```
frontend:dev: 10:07:11 PM [vite] http proxy error: /api/health
frontend:dev: AggregateError [ECONNREFUSED]
...
backend:dev: [Nest] 82755  - 10/29/2025, 10:07:12 PM LOG [NestApplication] Nest application successfully started
```

**Timeline:**
1. Frontend ready at 10:07:11 (loads immediately, tries `/api/health`)
2. Backend ready at 10:07:12 (1 second later)
3. Proxy errors during that 1-second gap

## Root Cause

- Vite starts almost instantly
- NestJS needs to compile TypeScript first (~2 seconds)
- Frontend's `App.tsx` has `useEffect` that fetches `/api/health` on mount
- Vite proxy tries to forward request, but backend isn't listening yet

## Solution

Add 2-second delay before starting frontend dev server:

```json
// apps/frontend/package.json
{
  "scripts": {
    "dev": "sleep 2 && vite"
  }
}
```

## Alternatives Considered

### 1. Turbo Task Dependencies ❌
```json
// turbo.json
"dev": {
  "dependsOn": ["^dev"]
}
```
- Doesn't work for persistent tasks
- Would wait for backend to *finish*, not just *start*

### 2. Wait-on Package ❌
```bash
"dev": "wait-on http://localhost:3000/api/health && vite"
```
- Adds another dependency
- Over-engineered for a dev-only timing issue

### 3. Retry Logic in Frontend ❌
```ts
// Add retry logic to fetch
```
- Adds complexity to app code
- Dev-only problem shouldn't affect app logic

### 4. Simple Sleep ✅ (Chosen)
```bash
"dev": "sleep 2 && vite"
```
- Simplest solution
- No new dependencies
- 2 seconds is enough for NestJS to compile
- Only affects dev startup (1-time cost)

## Trade-offs

**Pros:**
- Dead simple
- No new dependencies
- Fixes the visual noise in console
- Doesn't affect application code

**Cons:**
- Adds 2 seconds to initial startup
- Platform-specific (`sleep` is Unix/Mac command)

### Cross-Platform Note

For Windows compatibility, could use:
```json
"dev": "node -e \"setTimeout(()=>{},2000)\" && vite"
```

But since this is a starter for the user's personal projects (Mac user), `sleep` is fine.

## Impact

- **Before:** Immediate frontend start → 4-5 proxy errors → backend ready
- **After:** 2-second delay → clean startup, no errors

## Future Consideration

If we add more services or the backend takes longer to start, we might revisit with a proper readiness check using `wait-on`. For now, the simple solution works perfectly.

## Files Modified

- `apps/frontend/package.json` - Added `sleep 2 &&` to dev script

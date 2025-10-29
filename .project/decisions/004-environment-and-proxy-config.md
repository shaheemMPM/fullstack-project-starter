# ADR 004: Environment Variables and Development Proxy

**Date:** 2025-10-29
**Status:** Implemented

## Changes

### 1. Environment Variables with dotenv
**Decision:** Use a single `.env` file at monorepo root, loaded by backend.

**Implementation:**
- Installed `dotenv` as dev dependency (not needed in production)
- Load env vars in `main.ts` before bootstrap
- Path points to root: `dotenv.config({ path: join(__dirname, '..', '..', '..', '.env') })`
- Created `.env.example` with all variables documented

**Rationale:**
- Production environments provide env vars natively (Docker, cloud platforms)
- dotenv only needed for local development
- Single `.env` at root keeps config centralized
- `.env.example` serves as documentation

### 2. Conditional CORS (Development Only)
**Decision:** Enable CORS only in non-production environments.

**Before:**
```ts
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
```

**After:**
```ts
if (process.env.NODE_ENV !== 'production') {
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });
}
```

**Rationale:**
- CORS not needed in production (same origin - backend serves frontend)
- Uses env variable for flexibility
- Conditional check prevents unnecessary CORS in production

### 3. Vite Proxy for Development
**Decision:** Use Vite's built-in proxy to forward `/api/*` requests to backend.

**Configuration:**
```ts
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

**Frontend Code:**
```ts
// Development: fetch('/api/health') -> proxied to http://localhost:3000/api/health
// Production: fetch('/api/health') -> same origin, no proxy needed
fetch('/api/health')
```

**Rationale:**
- Same code works in both dev and production
- No hardcoded URLs in frontend
- Vite proxy only active in development
- Production: backend serves frontend, so `/api/health` is already correct origin

### 4. Environment Variables

**Current Variables:**
```env
NODE_ENV=development          # Environment (development/production)
PORT=3000                     # Backend server port
CORS_ORIGIN=http://localhost:5173  # Frontend URL for CORS (dev only)
```

## How It Works

### Development Mode
1. Frontend runs on `http://localhost:5173` (Vite)
2. Backend runs on `http://localhost:3000` (NestJS)
3. Frontend calls `/api/health`
4. Vite proxy forwards to `http://localhost:3000/api/health`
5. Backend CORS allows origin `http://localhost:5173`

### Production Mode
1. Frontend built to `apps/frontend/dist`
2. Backend serves frontend from root
3. Both on same origin `http://localhost:3000`
4. Frontend calls `/api/health` (same origin, no proxy)
5. No CORS needed

## Consequences

**Positive:**
- Clean, environment-aware configuration
- No hardcoded URLs in codebase
- Same frontend code for dev and production
- Centralized environment variables
- CORS only when needed

**Negative:**
- None - this is industry best practice

## Files Modified
- `apps/backend/src/main.ts` - Added dotenv, conditional CORS, env var usage
- `apps/frontend/vite.config.ts` - Added proxy configuration
- `apps/frontend/src/App.tsx` - Changed to relative URLs
- `.env.example` - Created with documented variables
- `.env` - Created for local development
- `.gitignore` - Ensures `.env.example` is tracked

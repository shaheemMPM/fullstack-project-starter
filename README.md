# Project Starter

A full-stack monorepo starter template for quickly bootstrapping hobby side projects with authentication, type-safe API client, and modern tooling.

## Tech Stack

- **Backend**: NestJS + PostgreSQL + Drizzle ORM + JWT Auth
- **Frontend**: React 19 + Vite + React Router v7 + Tailwind CSS v4
- **Shared**: Type-safe API client package
- **Tooling**: pnpm workspaces + Turborepo + Biome
- **Language**: TypeScript everywhere

## Features

- JWT authentication with protected routes
- Type-safe API calls between frontend and backend
- PostgreSQL database with Drizzle ORM
- Hot module reload for both frontend and backend
- Path aliases for clean imports
- Monorepo setup with shared packages
- Dark mode support

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env with your DATABASE_URL and JWT_SECRET

# Push database schema
pnpm --filter backend db:push
```

### Development

```bash
# Start both backend and frontend
pnpm dev
```

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api

### Available Commands

```bash
pnpm dev            # Start all apps in dev mode
pnpm build          # Build all apps
pnpm lint           # Lint all code with Biome
pnpm format         # Format all code with Biome
pnpm check          # Type check all apps

# Backend specific
pnpm --filter backend dev        # Start backend only
pnpm --filter backend db:push    # Push database schema
pnpm --filter backend db:studio  # Open Drizzle Studio

# Frontend specific
pnpm --filter frontend dev       # Start frontend only
pnpm --filter frontend build     # Build frontend for production
```

## Project Structure

```
project-starter/
├── apps/
│   ├── backend/              # NestJS API
│   │   ├── src/
│   │   │   ├── modules/      # Auth, Health, etc.
│   │   │   ├── db/           # Database schema and client
│   │   │   └── types/        # Shared type exports
│   │   └── drizzle.config.ts
│   │
│   └── frontend/             # React SPA
│       ├── src/
│       │   ├── components/   # Layout, ProtectedRoute, etc.
│       │   ├── pages/        # Page components
│       │   ├── context/      # React contexts (Auth)
│       │   ├── lib/          # API client instance
│       │   └── examples/     # Example components
│       └── vite.config.ts
│
├── packages/
│   └── api-client/           # Type-safe API client
│       └── src/
│           ├── api.ts        # Main API class
│           ├── client.ts     # HTTP client
│           ├── endpoints/    # Typed endpoints
│           └── types.ts      # Shared types from backend
│
├── .claude/                  # AI assistant context
├── turbo.json                # Turborepo config
└── biome.json                # Biome config
```

## Key Conventions

- **Arrow functions**: Always use arrow functions (enforced by Biome)
- **Path aliases**: Use `@` prefixed imports (`@modules/*`, `@components/*`, etc.)
- **Type sharing**: Types defined in backend, re-exported through api-client
- **Code style**: Biome handles linting and formatting (runs on save in VSCode)

## Environment Variables

### Backend (`apps/backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Authentication Flow

1. User signs up/logs in → JWT token stored in localStorage
2. API client automatically includes token in requests
3. Protected routes check authentication status
4. Invalid/expired tokens trigger automatic logout

## Adding New Features

### Backend Endpoint

1. Create module in `apps/backend/src/modules/`
2. Define types in module's `.types.ts` file
3. Export types through `apps/backend/src/types/index.ts`
4. Add controller and service

### Frontend Page

1. Create page component in `apps/frontend/src/pages/`
2. Add route in `apps/frontend/src/App.tsx`
3. Wrap with `<ProtectedRoute>` if authentication required

### API Client Endpoint

1. Add types to `packages/api-client/src/types.ts`
2. Create endpoint class in `packages/api-client/src/endpoints/`
3. Register in `packages/api-client/src/api.ts`

## License

MIT

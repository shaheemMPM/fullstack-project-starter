# Project Starter

A full-stack monorepo starter template with NestJS backend and React frontend, managed with pnpm workspace and Turborepo.

## Stack

- **Monorepo:** pnpm workspace + Turborepo
- **Backend:** NestJS (TypeScript)
- **Frontend:** React + Vite (TypeScript)
- **Package Manager:** pnpm

## Structure

```
project-starter/
├── apps/
│   ├── backend/       # NestJS API
│   └── frontend/      # React SPA (Vite)
├── packages/          # Shared packages (future)
├── .project/          # Project planning & context (for Claude Code)
├── turbo.json         # Turborepo configuration
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (`npm install -g pnpm`)

### Installation

```bash
pnpm install
```

### Development

Start both backend and frontend with a single command:

```bash
pnpm dev
```

- **Backend API:** http://localhost:3000/api
- **Frontend:** http://localhost:5173

### Building for Production

```bash
pnpm build
```

This builds both apps. The backend will serve the frontend static files in production.

### Running Production Build

```bash
# First, build the frontend
cd apps/frontend && pnpm build

# Then start the backend
cd ../backend && pnpm start
```

The backend will serve the React app at http://localhost:3000

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both dev servers |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm test` | Run tests in all apps |

## Architecture

### Development Mode
- Backend runs on port 3000 with CORS enabled
- Frontend runs on port 5173 with Vite's HMR
- Frontend fetches from backend API at `/api`

### Production Mode
- Backend serves React build as static files
- All routes except `/api/*` serve the React SPA
- Single server on port 3000

## Customization

When cloning for a new project:

1. Update `name` in root `package.json`
2. Update `name` in `apps/backend/package.json`
3. Update `name` in `apps/frontend/package.json`
4. Update this README with your project details

## Notes

- ESLint/Prettier configs are minimal (will be replaced with Biome later)
- TypeScript strict mode enabled for better type safety
- Turborepo provides smart caching for faster builds

# Tech Stack

**Last Updated:** 2025-10-29

## Core Stack

| Category | Technology | Rationale |
|----------|-----------|-----------|
| **Monorepo** | pnpm workspace | User preference, efficient, modern |
| **Package Manager** | pnpm | Fast, disk-efficient, strict by default |
| **Task Runner** | Turborepo | Caching, smart parallelization, scales well |
| **Backend Framework** | NestJS | Structured, TypeScript-first, scalable |
| **Frontend Framework** | React (Vite) | Popular, flexible, rich ecosystem, fast HMR |
| **Language** | TypeScript | Type safety, better DX, scalability |

## Project Structure

```
project-starter/
├── apps/
│   ├── backend/       # NestJS app
│   └── frontend/      # React SPA (Vite)
├── packages/          # Shared packages (future)
├── .project/          # Project management (Claude context)
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Development Philosophy

- **TypeScript everywhere** - Types on everything for long-term maintainability
- **Not overly strict** - Pragmatic type checking, adjustable as needed
- **Minimal to start** - Basic structure first, expand later
- **Single command dev** - Start everything with one command
- **Learn new tools** - Don't compromise on better tech just for familiarity

## Development Server Strategy ✅

**Decision: Separate Servers with Turbo**

- **Backend:** http://localhost:3000 (NestJS)
- **Frontend:** http://localhost:5173 (Vite)
- **Command:** `pnpm dev` (runs both via Turbo)
- **Production:** NestJS serves React static build

**Benefits:**
- Independent dev servers (easier debugging, better HMR)
- Turbo handles parallel execution + caching
- Simple CORS config for dev
- Scales as project grows

## Tooling (To Be Added)

- [ ] Linting: ESLint
- [ ] Formatting: Prettier
- [ ] Git Hooks: Husky + lint-staged
- [ ] Testing: Jest/Vitest
- [ ] CI/CD: TBD

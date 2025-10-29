# ADR 001: Use Turborepo for Task Running

**Date:** 2025-10-29
**Status:** Accepted

## Context

Need to run multiple dev servers (NestJS + React) with a single command in pnpm workspace monorepo.

## Decision

Use **Turborepo** instead of concurrently.

## Rationale

### Why Turbo:
1. **Caching** - Builds are cached, huge time savings as project grows
2. **Parallelization** - Smart dependency-aware parallel execution
3. **Developer Experience** - Better logging, clear task visualization
4. **Scales with project** - When we add linting, testing, building multiple apps
5. **Industry standard** - Used by Vercel, widely adopted, well-maintained
6. **Learning value** - User explicitly wants to learn new tech in side projects

### Why not concurrently:
- Just runs commands in parallel, no intelligence
- No caching (rebuild everything every time)
- Doesn't scale well with multiple tasks/apps
- Logs can be messy with multiple processes

## Implementation

- Install `turbo` as dev dependency at root
- Create `turbo.json` for task pipeline configuration
- Define tasks: `dev`, `build`, `lint`, `test`
- Root scripts delegate to turbo

## Consequences

**Positive:**
- Future-proof for multiple apps/packages
- Faster builds with caching
- Better DX for running scripts
- User learns modern monorepo tooling

**Negative:**
- One more config file to understand (minimal)
- Slightly more setup than concurrently (worth it)

## Notes

User context: 7+ years coding experience, wants to learn new tools, values efficiency over familiarity.

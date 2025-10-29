# Project Context

**Last Updated:** 2025-10-29

## Project Overview

**Name:** project-starter
**Purpose:** Reusable template for quickly starting hobby side projects
**Owner:** Shaheem
**Primary Use:** Clone and customize for new projects instead of repeating setup work

## Key Requirements

1. **Easy Customization**
   - Simple renaming of project names
   - Package name replacements
   - Configuration updates

2. **Time Savings**
   - Eliminate repetitive setup tasks
   - Pre-configured development environment
   - Ready-to-use tooling
   - **Single command to start dev server**

3. **Scalability**
   - Support different project types
   - Extensible architecture
   - Maintainable structure

## Important Constraints

- User has limited time (working on this after full-time job)
- Focus on practicality and perfection
- Should reduce friction, not add complexity

## Tech Stack Decisions

### Project Type
- **Primary Focus:** Web applications (full-stack)

### Monorepo Setup
- **Tool:** pnpm workspace
- **Package Manager:** pnpm (for all internal apps)
- **Structure:** Single repo for single project (backend + frontend together)
- **Task Runner:** Turborepo

### Backend
- **Framework:** NestJS
- **Language:** TypeScript (mandatory, types everywhere)
- **Start with:** Minimal setup, single endpoint, basic structure

### Frontend
- **Framework:** React SPA (Vite)
- **Language:** TypeScript (mandatory, types everywhere)
- **Start with:** Minimal setup, single page, single component

### Production Serving
- NestJS serves React build as static files from root endpoint

### Development Serving
- **Separate servers with Turborepo**
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Command: `pnpm dev` (runs both)

### Tooling Notes
- **ESLint/Prettier:** Keep minimal config (will replace with Biome later)
- **Future:** Biome for linting + formatting

## Session Memory Reminders

- **ALWAYS** update `.project` files when taking on big sub-tasks
- Reference these files at the start of new sessions for context
- Keep task tracking up-to-date for continuity
- Document major decisions in `decisions/` directory

## User Context
- 7+ years coding experience
- Wants to learn new tools, don't compromise on better tech
- Using AI for speed and efficiency

## Current Focus

Setting up initial monorepo with pnpm workspace + Turborepo + NestJS + React (Vite).

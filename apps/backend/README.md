# Backend

NestJS REST API with JWT authentication, PostgreSQL database, and Drizzle ORM.

## Features

- JWT authentication with bcrypt password hashing
- PostgreSQL database with Drizzle ORM
- Global authentication guard with `@Public()` decorator
- Type-safe database queries
- Path aliases for clean imports
- Hot reload in development

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: JWT + Passport + bcrypt
- **Validation**: class-validator + class-transformer

## Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/              # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.types.ts  # Shared types
│   │   │   ├── guards/        # JWT guard
│   │   │   ├── strategies/    # JWT strategy
│   │   │   └── decorators/    # @Public() decorator
│   │   │
│   │   └── health/            # Health check module
│   │       ├── health.controller.ts
│   │       └── health.types.ts
│   │
│   ├── db/
│   │   ├── schema.ts          # Drizzle schema
│   │   └── index.ts           # Database client
│   │
│   ├── types/
│   │   └── index.ts           # Central type exports
│   │
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application entry point
│
├── drizzle.config.ts          # Drizzle configuration
└── tsconfig.json              # TypeScript config with path aliases
```

## Development

```bash
# Start in development mode
pnpm dev

# Push database schema changes
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Build for production
pnpm build

# Start production build
pnpm start
```

## Environment Variables

Create `.env` file in this directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Path Aliases

- `@modules/*` → `src/modules/*`
- `@db` → `src/db/index.ts`
- `@db/*` → `src/db/*`
- `@types` → `src/types/index.ts`
- `@types/*` → `src/types/*`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Health

- `GET /api/health` - Health check (public)

## Adding New Modules

1. Create module directory in `src/modules/`
2. Define types in `.types.ts` file (no dependencies)
3. Export types through `src/types/index.ts`
4. Create controller and service
5. Import module in `app.module.ts`
6. Use `@Public()` decorator for public endpoints

## Database Schema Changes

```bash
# After modifying schema.ts, push changes
pnpm db:push

# For production, generate migrations instead
pnpm db:generate
```

## Authentication

- Global JWT guard applied to all routes
- Use `@Public()` decorator to bypass authentication
- Tokens expire based on JWT_SECRET configuration
- Passwords hashed with bcrypt (10 rounds)

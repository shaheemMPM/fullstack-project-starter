# ADR 013: Drizzle ORM + PostgreSQL Setup

**Date:** 2025-10-29
**Status:** Implemented

## Context

User requested database setup with:
- PostgreSQL as the database
- An ORM with good DX and query optimization
- Simple user table for authentication starter

## Decision: Drizzle ORM

After discussing Prisma vs Drizzle vs Kysely, chose **Drizzle ORM** for the following reasons:

### Why Drizzle Over Prisma

**Performance:**
- Generates optimal SQL queries (thin abstraction layer)
- 20-50% faster for complex queries
- No query bloat like Prisma

**Full SQL Power:**
- Access to all Postgres features (jsonb, arrays, CTEs, window functions)
- Can write raw SQL when needed
- Better for production optimization

**Bundle Size:**
- Lighter runtime
- Less generated code

**User's Experience:**
- User has experienced Prisma query issues in production
- User uses both Prisma and Drizzle interchangeably
- User prefers good query optimization out of the box

### Trade-offs

**Pros:**
- ✅ Better performance
- ✅ Full Postgres control
- ✅ Lighter bundle
- ✅ Great type safety
- ✅ Clean relational query API (Prisma-like DX)

**Cons:**
- ⚠️ Migration system less mature than Prisma
- ⚠️ Need to know SQL well
- ⚠️ More verbose than Prisma for simple cases

## Implementation

### 1. Dependencies Installed

**Production:**
```json
{
  "drizzle-orm": "^0.44.7",
  "postgres": "^3.4.7"
}
```

**Development:**
```json
{
  "drizzle-kit": "^0.31.6"
}
```

### 2. Database Setup

```bash
# Created database
createdb project_starter_dev
```

**Environment variables:**
```env
DATABASE_URL=postgresql://localhost:5432/project_starter_dev
```

### 3. Project Structure

```
apps/backend/
├── drizzle.config.ts       # Drizzle Kit configuration
├── src/
│   ├── db/
│   │   ├── schema/
│   │   │   ├── index.ts           # Export all schemas
│   │   │   └── users.schema.ts    # User table schema
│   │   ├── migrations/            # Generated SQL migrations
│   │   ├── client.ts              # Drizzle client setup
│   │   └── index.ts               # Public exports
│   ├── modules/
│   │   └── users/                 # Example CRUD module
│   │       ├── users.service.ts
│   │       ├── users.controller.ts
│   │       └── users.module.ts
└── tsconfig.json           # Added path aliases
```

### 4. User Schema

**File:** `apps/backend/src/db/schema/users.schema.ts`

```ts
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

**Features:**
- Auto-incrementing ID
- Unique email constraint
- Timestamps with auto defaults
- Type inference for Select and Insert

### 5. Database Client

**File:** `apps/backend/src/db/client.ts`

```ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

**Features:**
- Schema passed to enable relational queries
- Environment variable validation
- Singleton client

### 6. TypeScript Path Aliases

Updated `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Usage:**
```ts
import { db } from '@/db';
import { users } from '@/db';
```

### 7. Package Scripts

Added to `apps/backend/package.json`:
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "dotenv -e ../../.env -- drizzle-kit migrate",
    "db:push": "dotenv -e ../../.env -- drizzle-kit push",
    "db:studio": "dotenv -e ../../.env -- drizzle-kit studio"
  }
}
```

**Commands:**
- `pnpm db:generate` - Generate migration from schema changes
- `pnpm db:push` - Push schema directly to DB (dev only)
- `pnpm db:migrate` - Run pending migrations
- `pnpm db:studio` - Open Drizzle Studio (DB GUI)

### 8. Example: Users Module

**Service** (`users.service.ts`):
```ts
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import type { NewUser, User } from '@/db';
import { users } from '@/db';

@Injectable()
export class UsersService {
  // Relational query (Prisma-like)
  async findOne(id: number): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  // SQL-style query
  async findByEmail(email: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async create(newUser: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(newUser).returning();
    return user;
  }
}
```

**Features:**
- Prisma-like relational queries (`db.query.users.findFirst`)
- SQL-style queries when needed
- Full type safety
- CRUD operations

**Controller** (`users.controller.ts`):
```ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Post()
  async create(@Body() newUser: NewUser): Promise<User> {
    return await this.usersService.create(newUser);
  }
}
```

**Endpoints:**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get one user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Drizzle vs Prisma DX Comparison

### Prisma Style:
```ts
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
});
```

### Drizzle Style (Relational):
```ts
const user = await db.query.users.findFirst({
  where: eq(users.id, 1),
  with: { posts: true }
});
```

### Drizzle Style (SQL):
```ts
const user = await db
  .select()
  .from(users)
  .where(eq(users.id, 1))
  .leftJoin(posts, eq(posts.userId, users.id));
```

**DX Notes:**
- Relational API feels very Prisma-like
- SQL API gives full control for optimization
- Type inference works excellently
- Import `eq`, `and`, `or` from `drizzle-orm` for conditions

## Benefits

1. **Performance** - Optimal SQL generation
2. **Type Safety** - Full TypeScript inference
3. **Flexibility** - Use relational or SQL style
4. **Postgres Features** - Access to all DB capabilities
5. **Clean DX** - Prisma-inspired relational queries
6. **Future-proof** - Easy to optimize specific queries

## Migration Workflow

**Development:**
1. Update schema file
2. Run `pnpm db:generate` to create migration
3. Run `pnpm db:push` to apply (or use `db:migrate` for staging/prod)

**Production:**
1. Run migrations in CI/CD
2. Use `drizzle-kit migrate` command

## Future Considerations

### Adding Relations

When adding related tables (e.g., posts):

```ts
// In schema
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

// Query with relations
const user = await db.query.users.findFirst({
  with: { posts: true }
});
```

### Complex Queries

For advanced queries, use SQL builder:
```ts
const results = await db
  .select({
    userId: users.id,
    email: users.email,
    postCount: count(posts.id),
  })
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id))
  .groupBy(users.id);
```

## Conclusion

Drizzle provides:
- **Best-in-class performance** for PostgreSQL
- **Great DX** with Prisma-like relational queries
- **Full SQL control** when optimization is needed
- **Lightweight** runtime and bundle size
- **Production-ready** for complex applications

Perfect choice for a starter template that prioritizes query performance and developer experience.

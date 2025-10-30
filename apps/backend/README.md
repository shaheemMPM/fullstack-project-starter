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
- `@common` → `src/common/index.ts`
- `@common/*` → `src/common/*`

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

## Error Handling

The backend uses a global exception filter that provides consistent error responses across all endpoints. All errors are automatically caught and formatted into a standard structure.

### Error Response Format

All error responses follow this structure:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "BadRequestException",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/auth/login"
}
```

For validation errors, an additional `validationErrors` field is included:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BadRequestException",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/auth/signup",
  "validationErrors": {
    "general": [
      "email must be an email",
      "password must be longer than or equal to 8 characters"
    ]
  }
}
```

### Using Built-in NestJS Exceptions

NestJS provides many built-in exception classes. Use these for common HTTP errors:

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

// 400 Bad Request - Invalid input
throw new BadRequestException('Invalid email format');

// 401 Unauthorized - Authentication required
throw new UnauthorizedException('Invalid credentials');

// 403 Forbidden - Authenticated but not allowed
throw new ForbiddenException('You do not have permission to access this resource');

// 404 Not Found - Resource doesn't exist
throw new NotFoundException('User not found');

// 409 Conflict - Resource conflict (e.g., duplicate email)
throw new ConflictException('Email already registered');

// 500 Internal Server Error - Something went wrong
throw new InternalServerErrorException('Failed to process request');
```

### Using Custom Business Exceptions

For domain-specific business logic errors, use the `BusinessException`:

```typescript
import { BusinessException } from '@common';

// Simple usage (defaults to 400 Bad Request)
throw new BusinessException('Insufficient balance to complete transaction');

// With custom status code
import { HttpStatus } from '@nestjs/common';
throw new BusinessException('Payment processing failed', HttpStatus.PAYMENT_REQUIRED);
```

### Exception Handling Best Practices

#### 1. **Use Specific Exceptions**
Choose the most appropriate exception for your error case:

```typescript
// ❌ Bad - Generic error
throw new Error('Something went wrong');

// ✅ Good - Specific exception
throw new NotFoundException('Post with ID 123 not found');
```

#### 2. **Provide Clear Error Messages**
Write error messages that help users understand what went wrong:

```typescript
// ❌ Bad - Vague message
throw new BadRequestException('Invalid input');

// ✅ Good - Clear, actionable message
throw new BadRequestException('Email must be a valid email address');
```

#### 3. **Don't Expose Sensitive Information**
Never include sensitive data in error messages:

```typescript
// ❌ Bad - Exposes database details
throw new InternalServerErrorException(`Database error: ${dbError.stack}`);

// ✅ Good - Generic message, log details internally
console.error('Database error:', dbError);
throw new InternalServerErrorException('Failed to save user');
```

#### 4. **Validate Early**
Let validation pipes catch invalid input before it reaches your service:

```typescript
// DTOs with class-validator automatically throw validation errors
export class CreatePostDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;
}
```

#### 5. **Handle Database Errors**
Catch and transform database errors into meaningful HTTP exceptions:

```typescript
async createUser(email: string) {
  try {
    const user = await db.insert(users).values({ email }).returning();
    return user;
  } catch (error) {
    // Check for unique constraint violation
    if (error.code === '23505') {
      throw new ConflictException('Email already exists');
    }
    // Log unexpected errors
    console.error('Database error:', error);
    throw new InternalServerErrorException('Failed to create user');
  }
}
```

### Real-World Examples

#### Example 1: User Service
```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { BusinessException } from '@common';
import { db, users } from '@/db';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  async getUserById(id: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateUserEmail(userId: number, newEmail: string) {
    // Check if email is already taken
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, newEmail),
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Email is already in use');
    }

    // Update the email
    const [updated] = await db
      .update(users)
      .set({ email: newEmail })
      .where(eq(users.id, userId))
      .returning();

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }

  async deactivateUser(userId: number) {
    const user = await this.getUserById(userId);

    // Business logic check
    if (user.hasActiveSubscription) {
      throw new BusinessException(
        'Cannot deactivate user with active subscription. Please cancel subscription first.'
      );
    }

    await db
      .update(users)
      .set({ isActive: false })
      .where(eq(users.id, userId));
  }
}
```

#### Example 2: Controller with Try-Catch
```typescript
import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    try {
      return await this.postsService.create(createPostDto);
    } catch (error) {
      // If error is already an HttpException, it will be handled by the filter
      if (error instanceof HttpException) {
        throw error;
      }

      // Log unexpected errors
      console.error('Unexpected error creating post:', error);
      throw new InternalServerErrorException('Failed to create post');
    }
  }
}
```

### Common HTTP Status Codes

| Code | Exception | When to Use |
|------|-----------|-------------|
| 400 | `BadRequestException` | Invalid input, malformed request |
| 401 | `UnauthorizedException` | Not authenticated, invalid credentials |
| 403 | `ForbiddenException` | Authenticated but not authorized |
| 404 | `NotFoundException` | Resource doesn't exist |
| 409 | `ConflictException` | Duplicate resource, constraint violation |
| 422 | `UnprocessableEntityException` | Valid format but business logic fails |
| 500 | `InternalServerErrorException` | Server error, unexpected failure |

### Error Logging

The global exception filter automatically logs errors to the console. For production, you should integrate a proper logging service (Winston, Pino, or Sentry):

```typescript
// Current: Console logging (development only)
console.error('[2024-01-15T10:30:00.000Z] POST /api/auth/login - 401 - Invalid credentials');

// Future: Structured logging with Winston/Pino
logger.error('Authentication failed', {
  method: 'POST',
  path: '/api/auth/login',
  statusCode: 401,
  userId: null,
  ip: req.ip,
});
```

### Testing Error Handling

When writing tests, verify that your endpoints throw the correct exceptions:

```typescript
describe('AuthService', () => {
  it('should throw UnauthorizedException for invalid credentials', async () => {
    await expect(
      authService.login({ email: 'test@example.com', password: 'wrong' })
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw ConflictException for duplicate email', async () => {
    await expect(
      authService.signup({ email: 'existing@example.com', password: 'pass123' })
    ).rejects.toThrow(ConflictException);
  });
});
```

### Quick Reference

```typescript
// Import what you need
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { BusinessException } from '@common';

// Throw exceptions anywhere in your service/controller
throw new BadRequestException('Clear error message');
throw new UnauthorizedException('Invalid credentials');
throw new NotFoundException('Resource not found');
throw new BusinessException('Custom business logic error');

// The global filter handles everything else automatically!
```

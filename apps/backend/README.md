# Backend

NestJS REST API with JWT authentication, PostgreSQL database, and Drizzle ORM.

## Features

- JWT authentication with bcrypt password hashing
- PostgreSQL database with Drizzle ORM
- Global authentication guard with `@Public()` decorator
- Type-safe database queries
- Path aliases for clean imports
- Hot reload in development
- Background job processing with BullMQ
- Bull Board dashboard for queue monitoring
- Global error handling with custom filters

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: JWT + Passport + bcrypt
- **Validation**: class-validator + class-transformer
- **Job Queue**: BullMQ + Redis
- **Queue Dashboard**: Bull Board

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
│   │   ├── email/             # Email queue module
│   │   │   ├── email.controller.ts
│   │   │   ├── email.service.ts
│   │   │   ├── email.processor.ts  # Background job processor
│   │   │   └── email.module.ts
│   │   │
│   │   └── health/            # Health check module
│   │       ├── health.controller.ts
│   │       └── health.types.ts
│   │
│   ├── shared/                # Global shared module
│   │   ├── services/          # Shared services
│   │   │   ├── config.service.ts    # Environment config
│   │   │   └── redis.service.ts     # Redis operations
│   │   └── shared.module.ts   # Shared module definition
│   │
│   ├── common/
│   │   ├── filters/           # Global exception filters
│   │   └── exceptions/        # Custom exceptions
│   │
│   ├── constants/
│   │   └── queues.ts          # Queue and job name constants
│   │
│   ├── db/
│   │   ├── schema/            # Drizzle schemas
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
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Redis (for BullMQ queues and caching)
# Format: redis://[username:password@]host[:port][?family=0]
REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Path Aliases

- `@modules/*` → `src/modules/*`
- `@shared` → `src/shared/shared.module.ts`
- `@shared/*` → `src/shared/*`
- `@db` → `src/db/index.ts`
- `@db/*` → `src/db/*`
- `@types` → `src/types/index.ts`
- `@types/*` → `src/types/*`
- `@common` → `src/common/index.ts`
- `@common/*` → `src/common/*`
- `@constants` → `src/constants/index.ts`
- `@constants/*` → `src/constants/*`

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

## Shared Module

The **SharedModule** is a global module that provides shared services to all modules in the application. It's registered in `app.module.ts` with the `@Global()` decorator, making its services available without needing to import it in every module.

### ConfigService

Centralized service for accessing environment variables. **Always use ConfigService instead of `process.env` directly** to ensure type safety and consistent defaults.

#### Available Getters

```typescript
import { ConfigService } from '@shared/services/config.service';

@Injectable()
export class YourService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    // Environment checks
    if (this.configService.isDevelopment) {
      // Development-only code
    }
    if (this.configService.isProduction) {
      // Production-only code
    }

    // Get environment variable as string
    const apiKey = this.configService.get('API_KEY');

    // Get environment variable as number
    const timeout = this.configService.getNumber('TIMEOUT');

    // Predefined configuration getters
    const nodeEnv = this.configService.nodeEnv;           // 'development' | 'production'
    const dbUrl = this.configService.databaseUrl;         // string
    const jwtSecret = this.configService.jwtSecret;       // string
    const jwtExpires = this.configService.jwtExpiresIn;   // string | number
    const corsOrigin = this.configService.corsOrigin;     // string
    const port = this.configService.port;                 // number

    // Redis configuration (parsed from REDIS_URL)
    const redisConfig = this.configService.redisConfig;
    // Returns: { username, password, port, host, family }
  }
}
```

#### Usage Examples

**In Services:**
```typescript
import { ConfigService } from '@shared/services/config.service';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendEmail() {
    const apiKey = this.configService.get('SENDGRID_API_KEY');
    // Use apiKey...
  }
}
```

**In Module Configuration:**
```typescript
import { ConfigService } from '@shared/services/config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: configService.jwtExpiresIn,
        },
      }),
    }),
  ],
})
export class AuthModule {}
```

**In main.ts:**
```typescript
const app = await NestFactory.create(AppModule);
const configService = app.get(ConfigService);

const port = configService.port;
await app.listen(port);
```

#### Why Use ConfigService?

✅ **Type Safety**: Get typed values (number, string) instead of string | undefined
✅ **Defaults**: Sensible defaults for missing environment variables
✅ **Centralized**: Single source of truth for all configuration
✅ **Testable**: Easy to mock in tests
✅ **Refactorable**: Change env var names in one place

### RedisService

Wrapper around `ioredis` that provides common Redis operations with proper lifecycle management.

#### Available Methods

```typescript
import { RedisService } from '@shared/services/redis.service';

@Injectable()
export class YourService {
  constructor(private redisService: RedisService) {}

  async cacheExample() {
    // Set string value
    await this.redisService.set('user:123', 'John Doe', 3600);  // TTL in seconds

    // Get string value
    const name = await this.redisService.get('user:123');  // 'John Doe' | null

    // Set JSON value (automatically serialized)
    await this.redisService.setJson('user:123', { name: 'John', age: 30 }, 3600);

    // Get JSON value (automatically deserialized)
    const user = await this.redisService.getJson<User>('user:123');  // User | null

    // Delete key
    await this.redisService.del('user:123');

    // Check if key exists
    const exists = await this.redisService.exists('user:123');  // boolean

    // Set expiration (TTL in seconds)
    await this.redisService.expire('user:123', 7200);

    // Get remaining TTL
    const ttl = await this.redisService.ttl('user:123');  // seconds remaining

    // Access raw Redis client for advanced operations
    const client = this.redisService.getClient();
    await client.lpush('queue', 'item1', 'item2');
  }
}
```

#### Usage Examples

**Caching Database Queries:**
```typescript
@Injectable()
export class UserService {
  constructor(
    private redisService: RedisService,
  ) {}

  async getUserById(id: number) {
    // Try cache first
    const cacheKey = `user:${id}`;
    const cached = await this.redisService.getJson<User>(cacheKey);
    if (cached) {
      return cached;
    }

    // Cache miss - fetch from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cache for 1 hour
    await this.redisService.setJson(cacheKey, user, 3600);

    return user;
  }

  async updateUser(id: number, data: UpdateUserDto) {
    const updated = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();

    // Invalidate cache
    await this.redisService.del(`user:${id}`);

    return updated[0];
  }
}
```

**Session Management:**
```typescript
@Injectable()
export class SessionService {
  constructor(private redisService: RedisService) {}

  async createSession(userId: number, sessionData: any) {
    const sessionId = randomUUID();
    const key = `session:${sessionId}`;

    // Store session for 24 hours
    await this.redisService.setJson(key, { userId, ...sessionData }, 86400);

    return sessionId;
  }

  async getSession(sessionId: string) {
    return await this.redisService.getJson(`session:${sessionId}`);
  }

  async destroySession(sessionId: string) {
    await this.redisService.del(`session:${sessionId}`);
  }
}
```

**Rate Limiting:**
```typescript
@Injectable()
export class RateLimitService {
  constructor(private redisService: RedisService) {}

  async checkRateLimit(userId: number, limit: number = 100): Promise<boolean> {
    const key = `rate:${userId}`;
    const client = this.redisService.getClient();

    const count = await client.incr(key);

    if (count === 1) {
      // First request - set TTL to 1 hour
      await this.redisService.expire(key, 3600);
    }

    return count <= limit;
  }
}
```

#### Why Use RedisService?

✅ **Lifecycle Management**: Automatic connection setup and cleanup
✅ **Type Safety**: TypeScript support with generics for JSON methods
✅ **Convenience**: Common operations wrapped in simple methods
✅ **Flexibility**: Access raw client for advanced use cases
✅ **Testable**: Easy to mock in tests

### When to Use What

| Use Case | Service | Method |
|----------|---------|--------|
| Read environment variables | ConfigService | `configService.get('KEY')` |
| Cache database queries | RedisService | `redisService.setJson()` / `getJson()` |
| Session storage | RedisService | `redisService.setJson()` with TTL |
| Rate limiting | RedisService | `getClient().incr()` |
| Background jobs | BullMQ | Uses RedisService internally |
| Feature flags | ConfigService | `configService.get('FEATURE_X_ENABLED')` |

### Shared Module Best Practices

#### 1. Always Use ConfigService for Environment Variables

```typescript
// ❌ Bad - Direct access
const port = process.env.PORT || 3000;

// ✅ Good - Through ConfigService
const port = this.configService.port;
```

#### 2. Cache Expensive Operations

```typescript
// ✅ Good - Cache database queries
const cacheKey = `expensive-query:${params}`;
let result = await this.redisService.getJson(cacheKey);

if (!result) {
  result = await this.performExpensiveQuery(params);
  await this.redisService.setJson(cacheKey, result, 3600);
}
```

#### 3. Invalidate Cache on Updates

```typescript
// ✅ Good - Clear cache after updates
async updateUser(id: number, data: UpdateUserDto) {
  const updated = await db.update(users).set(data);
  await this.redisService.del(`user:${id}`);  // Clear cache
  return updated;
}
```

#### 4. Use Appropriate TTLs

```typescript
// Short TTL for frequently changing data
await this.redisService.setJson('stock-price', price, 60);  // 1 minute

// Long TTL for rarely changing data
await this.redisService.setJson('app-config', config, 86400);  // 24 hours

// No TTL for permanent data (use with caution)
await this.redisService.set('feature-flag', 'enabled');
```

#### 5. Handle Redis Connection Failures Gracefully

```typescript
async getUserById(id: number) {
  try {
    // Try cache
    const cached = await this.redisService.getJson(`user:${id}`);
    if (cached) return cached;
  } catch (error) {
    // Log but don't fail - fallback to database
    console.error('Redis error:', error);
  }

  // Fetch from database
  return await db.query.users.findFirst({ where: eq(users.id, id) });
}
```

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
import { db, users } from '@db';
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


## Background Jobs & Queues

The backend uses **BullMQ** for processing background jobs asynchronously with **Redis** as the message broker. **Bull Board** provides a web UI for monitoring queues.

### Architecture

- **BullMQ** is registered globally in `app.module.ts` (shared by all queue modules)
- Each module registers its own queues (e.g., `EmailModule` registers the email queue)
- Queue and job names are defined in `src/constants/queues.ts` to avoid typos
- Processors are colocated with their modules

### Prerequisites

**Redis must be running** for the queue system to work:

```bash
# Install Redis (macOS)
brew install redis

# Start Redis
brew services start redis

# Or run Redis in foreground
redis-server
```

### Queue Dashboard (Bull Board)

Access the queue monitoring dashboard at:
```
http://localhost:3000/admin/queues
```

**Features:**
- View all queues and their jobs
- Monitor job statuses (waiting, active, completed, failed)
- Retry failed jobs manually
- View job data and logs
- Track job performance metrics

### Using Queues

#### 1. Add Jobs to Queue

```typescript
import { EmailService } from '@modules/email/email.service';

@Injectable()
export class AuthService {
  constructor(private emailService: EmailService) {}

  async signup(signupDto: SignupDto) {
    const user = await this.createUser(signupDto);
    
    // Add email to queue (non-blocking)
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Welcome!',
      body: 'Thanks for signing up'
    });
    
    return user;
  }
}
```

#### 2. Create a New Queue Module

**Step 1: Add queue and job names to `src/constants/queues.ts`:**

```typescript
export const QUEUE_NAMES = {
  EMAIL: 'email',
  NOTIFICATIONS: 'notifications',  // Add your new queue
} as const;

export const NOTIFICATION_JOBS = {
  SEND_PUSH: 'send-push',
  SEND_SMS: 'send-sms',
} as const;
```

**Step 2: Create module directory `src/modules/notifications/`:**

```bash
mkdir -p src/modules/notifications
```

**Step 3: Create the module `notifications.module.ts`:**

```typescript
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_NAMES } from '@constants';
import { NotificationsController } from './notifications.controller';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    // BullMQ is already registered in app.module.ts
    // Just register your queue here
    BullModule.registerQueue({
      name: QUEUE_NAMES.NOTIFICATIONS,
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}
```

**Step 4: Create the service `notifications.service.ts`:**

```typescript
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { NOTIFICATION_JOBS, QUEUE_NAMES } from '@constants';

export interface SendPushJobData {
  userId: number;
  title: string;
  message: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue(QUEUE_NAMES.NOTIFICATIONS) 
    private notificationQueue: Queue
  ) {}

  async sendPush(data: SendPushJobData) {
    return await this.notificationQueue.add(
      NOTIFICATION_JOBS.SEND_PUSH, 
      data,
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      }
    );
  }

  getNotificationQueue(): Queue {
    return this.notificationQueue;
  }
}
```

**Step 5: Create the processor `notifications.processor.ts`:**

```typescript
import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { QUEUE_NAMES } from '@constants';
import type { SendPushJobData } from './notifications.service';

@Processor(QUEUE_NAMES.NOTIFICATIONS)
export class NotificationsProcessor extends WorkerHost {
  async process(job: Job<SendPushJobData>): Promise<void> {
    const { userId, title, message } = job.data;
    
    console.log(`Sending push to user ${userId}: ${title}`);
    
    // Your notification logic here
    await this.sendPushNotification(userId, title, message);
    
    console.log(`Push sent to user ${userId}`);
  }

  private async sendPushNotification(
    userId: number, 
    title: string, 
    message: string
  ) {
    // Implement your push notification logic
    // e.g., Firebase Cloud Messaging, OneSignal, etc.
  }
}
```

**Step 6: Register module in `app.module.ts`:**

```typescript
@Module({
  imports: [
    BullModule.forRoot({ /* Redis config */ }),
    HealthModule,
    AuthModule,
    EmailModule,
    NotificationsModule,  // Add your module
  ],
})
export class AppModule {}
```

**Step 7: Add to Bull Board in `main.ts`:**

```typescript
const emailService = app.get(EmailService);
const notificationsService = app.get(NotificationsService);

createBullBoard({
  queues: [
    new BullMQAdapter(emailService.getEmailQueue()),
    new BullMQAdapter(notificationsService.getNotificationQueue()),
  ],
  serverAdapter: serverAdapter,
});
```

### Using Queue Constants

Always import and use constants instead of hard-coding strings:

```typescript
// ❌ Bad - prone to typos
@InjectQueue('email') private emailQueue: Queue

// ✅ Good - type-safe, autocomplete, refactor-friendly
import { QUEUE_NAMES } from '@constants';
@InjectQueue(QUEUE_NAMES.EMAIL) private emailQueue: Queue
```

```typescript
// ❌ Bad
await this.queue.add('send-email', data);

// ✅ Good
import { EMAIL_JOBS } from '@constants';
await this.queue.add(EMAIL_JOBS.SEND_EMAIL, data);
```

### Job Options

Configure job behavior when adding to queue:

```typescript
await this.queue.add(EMAIL_JOBS.SEND_EMAIL, data, {
  // Retry options
  attempts: 3,                    // Max retry attempts
  backoff: {
    type: 'exponential',          // or 'fixed'
    delay: 1000,                  // Initial delay in ms
  },
  
  // Priority (lower number = higher priority)
  priority: 1,                    // Jobs with priority 1 run before priority 2
  
  // Delays
  delay: 5000,                    // Delay job execution by 5 seconds
  
  // Remove options
  removeOnComplete: true,         // Remove job when completed
  removeOnFail: false,            // Keep failed jobs for debugging
  
  // Timeout
  timeout: 30000,                 // Fail job if it takes longer than 30s
});
```

### Common Use Cases

#### 1. Send Welcome Email After Signup

```typescript
// auth.service.ts
async signup(signupDto: SignupDto): Promise<AuthResponse> {
  const user = await this.createUser(signupDto);
  
  // Queue welcome email (non-blocking)
  await this.emailService.sendEmail({
    to: user.email,
    subject: 'Welcome to Our Platform!',
    body: `Hi ${user.name}, thanks for signing up!`
  });
  
  return { user, token };
}
```

#### 2. Process Large Data Export

```typescript
// Create export queue for heavy operations
@Processor(QUEUE_NAMES.EXPORTS)
export class ExportProcessor extends WorkerHost {
  async process(job: Job<ExportJobData>): Promise<void> {
    const { userId, format } = job.data;
    
    // Heavy processing happens in background
    const data = await this.fetchLargeDataset(userId);
    const file = await this.generateExport(data, format);
    
    // Send download link via email
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Your export is ready',
      body: `Download: ${file.url}`
    });
  }
}
```

#### 3. Scheduled/Delayed Jobs

```typescript
// Schedule email for later
await this.emailService.sendEmail(
  {
    to: 'user@example.com',
    subject: 'Reminder',
    body: 'Your trial expires in 3 days'
  },
  {
    delay: 1000 * 60 * 60 * 24 * 4,  // Send in 4 days
  }
);
```

### Testing the Queue System

#### Test Endpoint

Use the test endpoint to queue an email:

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "body": "This is a test email from the queue"
  }'
```

Response:
```json
{
  "jobId": "1",
  "message": "Email queued successfully"
}
```

Then visit `http://localhost:3000/admin/queues` to see the job being processed!

### Monitoring & Debugging

#### Bull Board Dashboard

The dashboard shows:
- **Waiting**: Jobs queued but not started
- **Active**: Jobs currently being processed
- **Completed**: Successfully finished jobs
- **Failed**: Jobs that failed (with error details)
- **Delayed**: Jobs scheduled for later

#### View Job Details

Click on any job in Bull Board to see:
- Job data (input parameters)
- Job progress
- Error stack traces (for failed jobs)
- Processing time
- Retry attempts

#### Retry Failed Jobs

1. Go to Bull Board
2. Click on "Failed" tab
3. Select the job
4. Click "Retry" button

### Best Practices

#### 1. Keep Jobs Idempotent

Jobs may be retried, so make sure they can be safely re-executed:

```typescript
// ❌ Bad - not idempotent
async process(job: Job) {
  await db.users.increment({ balance: 100 });  // Could add $100 multiple times!
}

// ✅ Good - idempotent
async process(job: Job) {
  const { userId, transactionId } = job.data;
  
  // Check if already processed
  const existing = await db.transactions.findOne({ id: transactionId });
  if (existing) {
    return; // Already processed, skip
  }
  
  await db.transactions.create({ id: transactionId, amount: 100 });
  await db.users.increment({ balance: 100 });
}
```

#### 2. Handle Errors Gracefully

```typescript
async process(job: Job): Promise<void> {
  try {
    await this.sendEmail(job.data);
  } catch (error) {
    console.error(`Failed to send email:`, error);
    throw error;  // Let BullMQ handle retry logic
  }
}
```

#### 3. Use Job Progress

For long-running jobs, update progress:

```typescript
async process(job: Job): Promise<void> {
  const items = await this.fetchItems();
  
  for (let i = 0; i < items.length; i++) {
    await this.processItem(items[i]);
    
    // Update progress (0-100)
    await job.updateProgress((i + 1) / items.length * 100);
  }
}
```

#### 4. Set Appropriate Timeouts

```typescript
// For quick tasks (emails, notifications)
await this.queue.add(EMAIL_JOBS.SEND_EMAIL, data, {
  timeout: 30000,  // 30 seconds
});

// For heavy tasks (exports, image processing)
await this.queue.add(EXPORT_JOBS.GENERATE_REPORT, data, {
  timeout: 300000,  // 5 minutes
});
```

#### 5. Use Constants for Type Safety

```typescript
import { QUEUE_NAMES, EMAIL_JOBS } from '@constants';

// ✅ Type-safe, autocomplete, refactor-friendly
@InjectQueue(QUEUE_NAMES.EMAIL) private queue: Queue
await this.queue.add(EMAIL_JOBS.SEND_EMAIL, data);
```

### Environment Variables

```env
# Redis connection (for BullMQ and caching)
# Format: redis://[username:password@]host[:port][?family=0]
REDIS_URL=redis://localhost:6379
```

### Troubleshooting

**Issue: Jobs not processing**
- Check Redis is running: `redis-cli ping` (should return "PONG")
- Check logs for connection errors
- Verify REDIS_URL in `.env` is correct

**Issue: Jobs failing repeatedly**
- Check job error in Bull Board
- Verify processor logic
- Check if external services (email, APIs) are available

**Issue: Queue dashboard not loading**
- Verify backend is running
- Check `http://localhost:3000/admin/queues`
- Check console for Bull Board setup errors

**Issue: "Cannot find module '@constants'"**
- TypeScript compiled code uses relative paths
- Constants are imported at compile time, not runtime
- This is normal and works correctly

### Quick Reference

```typescript
// Import constants
import { QUEUE_NAMES, EMAIL_JOBS } from '@constants';
import { EmailService } from '@modules/email/email.service';

// Inject service
constructor(private emailService: EmailService) {}

// Add job to queue
await this.emailService.sendEmail({ to, subject, body });

// Create new module with queue
// 1. Add to @constants/queues.ts
// 2. Create module in @modules/your-module/
// 3. Import BullModule.registerQueue in your module
// 4. Create service, processor, controller
// 5. Register in app.module.ts
// 6. Add to Bull Board in main.ts

// Access dashboard
http://localhost:3000/admin/queues
```

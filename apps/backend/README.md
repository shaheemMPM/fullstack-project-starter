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

## Background Jobs & Queues

The backend uses **BullMQ** for processing background jobs asynchronously with **Redis** as the message broker. **Bull Board** provides a web UI for monitoring queues.

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
import { QueueService } from './queue/queue.service';

@Injectable()
export class YourService {
  constructor(private queueService: QueueService) {}

  async someMethod() {
    // Add email to queue
    await this.queueService.sendEmail({
      to: 'user@example.com',
      subject: 'Welcome!',
      body: 'Thanks for signing up'
    });
  }
}
```

#### 2. Create a New Queue

**Step 1: Register the queue in `queue.module.ts`:**

```typescript
BullModule.registerQueue({
  name: 'notifications',  // Your queue name
}),
```

**Step 2: Create a processor:**

```typescript
// src/queue/processors/notification.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export interface NotificationJobData {
  userId: number;
  message: string;
}

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  async process(job: Job<NotificationJobData>): Promise<void> {
    const { userId, message } = job.data;
    
    console.log(`Sending notification to user ${userId}: ${message}`);
    
    // Your notification logic here
    await this.sendNotification(userId, message);
    
    console.log(`Notification sent to user ${userId}`);
  }

  private async sendNotification(userId: number, message: string) {
    // Implement your notification logic
  }
}
```

**Step 3: Add queue methods to `queue.service.ts`:**

```typescript
@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('notifications') private notificationQueue: Queue,
  ) {}

  async sendNotification(data: NotificationJobData) {
    return await this.notificationQueue.add('send-notification', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  getNotificationQueue(): Queue {
    return this.notificationQueue;
  }
}
```

**Step 4: Register the processor in `queue.module.ts`:**

```typescript
providers: [QueueService, EmailProcessor, NotificationProcessor],
```

**Step 5: Add to Bull Board (in `main.ts`):**

```typescript
createBullBoard({
  queues: [
    new BullMQAdapter(queueService.getEmailQueue()),
    new BullMQAdapter(queueService.getNotificationQueue()),
  ],
  serverAdapter: serverAdapter,
});
```

### Job Options

Configure job behavior when adding to queue:

```typescript
await this.queue.add('job-name', data, {
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
  await this.queueService.sendEmail({
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
@Processor('exports')
export class ExportProcessor extends WorkerHost {
  async process(job: Job<ExportJobData>): Promise<void> {
    const { userId, format } = job.data;
    
    // Heavy processing happens in background
    const data = await this.fetchLargeDataset(userId);
    const file = await this.generateExport(data, format);
    
    // Send download link via email
    await this.emailService.send({
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
await this.queueService.sendEmail(
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
curl -X POST http://localhost:3000/api/queue/test-email \
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
await this.queue.add('send-email', data, {
  timeout: 30000,  // 30 seconds
});

// For heavy tasks (exports, image processing)
await this.queue.add('generate-report', data, {
  timeout: 300000,  // 5 minutes
});
```

### Environment Variables

```env
# Redis connection
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Troubleshooting

**Issue: Jobs not processing**
- Check Redis is running: `redis-cli ping` (should return "PONG")
- Check logs for connection errors
- Verify REDIS_HOST and REDIS_PORT in `.env`

**Issue: Jobs failing repeatedly**
- Check job error in Bull Board
- Verify processor logic
- Check if external services (email, APIs) are available

**Issue: Queue dashboard not loading**
- Verify backend is running
- Check `http://localhost:3000/admin/queues`
- Check console for Bull Board setup errors

### Quick Reference

```typescript
// Add job to queue
await this.queueService.sendEmail({ to, subject, body });

// Add with options
await this.queue.add('job-name', data, {
  attempts: 3,
  delay: 5000,
  priority: 1,
});

// Create processor
@Processor('queue-name')
export class MyProcessor extends WorkerHost {
  async process(job: Job): Promise<void> {
    // Process job
  }
}

// Access dashboard
http://localhost:3000/admin/queues
```


# @repo/api-client

Type-safe API client for communicating with the NestJS backend.

## Features

- ✅ Full TypeScript type safety
- ✅ Automatic token management with localStorage
- ✅ Authentication error handling
- ✅ Simple, intuitive API
- ✅ No code generation required
- ✅ Works in monorepo with shared types

## Installation

The package is already installed in the frontend workspace. No additional setup needed.

## Usage

### Basic Setup

```typescript
import { Api } from '@repo/api-client';

// Create API instance
export const api = new Api({
  baseUrl: 'http://localhost:3000',
  onAuthError: () => {
    // Handle auth errors (e.g., redirect to login)
    console.error('Please log in again');
  },
});
```

### Authentication

```typescript
// Signup
const response = await api.auth.signup({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe', // optional
});
// Token is automatically saved and set

// Login
const response = await api.auth.login({
  email: 'user@example.com',
  password: 'password123',
});
// Token is automatically saved and set

// Get current user (requires authentication)
const user = await api.auth.me();
console.log(user.email);

// Change password (requires authentication)
await api.auth.changePassword({
  currentPassword: 'oldpassword',
  newPassword: 'newpassword',
});

// Logout
api.auth.logout();
// Token is cleared from storage

// Check if authenticated
if (api.isAuthenticated()) {
  console.log('User is logged in');
}
```

### Health Check

```typescript
const health = await api.health.check();
console.log(health.status); // "ok"
```

### Error Handling

```typescript
import { ApiClientError } from '@repo/api-client';

try {
  await api.auth.login({ email: 'wrong@example.com', password: 'wrong' });
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
    console.error('API Error:', error.apiError);
  }
}
```

### Custom Token Storage

By default, tokens are stored in localStorage. You can provide a custom storage implementation:

```typescript
import { Api, MemoryTokenStorage } from '@repo/api-client';

// Use memory storage (useful for SSR or testing)
const api = new Api({
  baseUrl: 'http://localhost:3000',
  tokenStorage: new MemoryTokenStorage(),
});

// Or create your own storage
class CookieTokenStorage implements TokenStorage {
  getToken() {
    // Read from cookie
  }
  setToken(token: string) {
    // Save to cookie
  }
  removeToken() {
    // Remove cookie
  }
}
```

## Architecture

The API client is organized into:

- **Client** (`client.ts`): Core HTTP client with authentication support
- **Endpoints** (`endpoints/`): Typed endpoint methods grouped by resource
- **Types** (`types.ts`): Shared TypeScript types matching backend DTOs
- **Storage** (`storage.ts`): Token persistence layer
- **API** (`api.ts`): Main entry point that brings everything together

## Adding New Endpoints

When you add new endpoints to the backend:

1. Update `types.ts` with new request/response types
2. Create or update endpoint class in `endpoints/`
3. Export from `index.ts`
4. Rebuild the package: `pnpm --filter @repo/api-client build`

Example:

```typescript
// types.ts
export interface CreatePostDto {
  title: string;
  content: string;
}

// endpoints/posts.ts
export class PostsEndpoints {
  constructor(private client: ApiClient) {}

  async create(data: CreatePostDto) {
    return this.client.post('/api/posts', data);
  }
}

// api.ts
export class Api {
  public readonly posts: PostsEndpoints;

  constructor(config: ApiConfig) {
    // ...
    this.posts = new PostsEndpoints(this.client);
  }
}
```

## Development

```bash
# Build the package
pnpm --filter @repo/api-client build

# Watch mode
pnpm --filter @repo/api-client dev

# Check code quality
pnpm --filter @repo/api-client check
```

# @repo/api-client

Type-safe API client for communicating with the NestJS backend. Shared between frontend and any other clients.

## Features

- Full TypeScript type safety
- Automatic token management with localStorage
- Authentication error handling
- Simple, intuitive API
- No code generation required
- Shared types from backend

## Usage

### Setup

```typescript
import { Api } from '@repo/api-client';

export const api = new Api({
  baseUrl: 'http://localhost:3000',
  onAuthError: () => {
    // Handle 401 errors (e.g., redirect to login)
  },
});
```

### Authentication

```typescript
// Signup
await api.auth.signup({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe', // optional
});

// Login
await api.auth.login({
  email: 'user@example.com',
  password: 'password123',
});

// Get current user
const user = await api.auth.me();

// Change password
await api.auth.changePassword({
  currentPassword: 'old',
  newPassword: 'new',
});

// Logout
api.auth.logout();

// Check authentication
if (api.isAuthenticated()) {
  // User is logged in
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
  await api.auth.login({ email, password });
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
  }
}
```

## Architecture

```
api-client/
├── src/
│   ├── api.ts          # Main API class
│   ├── client.ts       # HTTP client with auth support
│   ├── endpoints/
│   │   ├── auth.ts     # Auth endpoints
│   │   └── health.ts   # Health endpoints
│   ├── storage.ts      # Token storage (localStorage/memory)
│   ├── types.ts        # Shared types from backend
│   └── index.ts        # Public exports
└── package.json
```

## How It Works

### Type Sharing

1. Backend defines types in `.types.ts` files (no decorators)
2. Backend exports types through `src/types/index.ts`
3. API client re-exports these types in `types.ts`
4. Frontend imports types from `@repo/api-client`

### Token Management

1. Login/signup automatically saves JWT to localStorage
2. HTTP client includes token in Authorization header
3. On 401 error, token is cleared and `onAuthError` is called
4. Custom storage can be provided (e.g., cookies, memory)

## Adding New Endpoints

When adding a new backend endpoint:

1. **Add types** to `src/types.ts`:
```typescript
export interface CreatePostDto {
  title: string;
  content: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
}
```

2. **Create endpoint class** in `src/endpoints/posts.ts`:
```typescript
import type { ApiClient } from '../client';
import type { CreatePostDto, Post } from '../types';

export class PostsEndpoints {
  constructor(private client: ApiClient) {}

  async create(data: CreatePostDto): Promise<Post> {
    return this.client.post<Post>('/api/posts', data);
  }

  async list(): Promise<Post[]> {
    return this.client.get<Post[]>('/api/posts');
  }
}
```

3. **Register in API class** in `src/api.ts`:
```typescript
import { PostsEndpoints } from './endpoints/posts';

export class Api {
  public readonly posts: PostsEndpoints;

  constructor(config: ApiConfig) {
    // ...
    this.posts = new PostsEndpoints(this.client);
  }
}
```

4. **Export types** from `src/index.ts`:
```typescript
export type { CreatePostDto, Post } from './types';
```

## Custom Token Storage

```typescript
import { Api, MemoryTokenStorage, type TokenStorage } from '@repo/api-client';

// Use memory storage (for SSR or testing)
const api = new Api({
  baseUrl: 'http://localhost:3000',
  tokenStorage: new MemoryTokenStorage(),
});

// Or implement custom storage
class CookieTokenStorage implements TokenStorage {
  getToken(): string | null {
    // Read from cookie
  }
  setToken(token: string): void {
    // Save to cookie
  }
  removeToken(): void {
    // Remove cookie
  }
}
```

## Development

```bash
# Build the package
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm check
```

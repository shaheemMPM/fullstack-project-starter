# ADR 009: Biome Type Imports vs NestJS Decorator Metadata

**Date:** 2025-10-29
**Status:** Documented

## Problem

Biome's import sorting converted this:
```ts
import { HealthService, HealthResponse } from './health.service';
```

To this:
```ts
import type { HealthResponse, HealthService } from './health.service';
```

This breaks NestJS dependency injection because `HealthService` needs to be a **value** import, not a type-only import.

## Root Cause

NestJS uses TypeScript's `emitDecoratorMetadata` compiler option. When you write:
```ts
constructor(private readonly healthService: HealthService) {}
```

TypeScript emits runtime metadata that includes the **actual class reference** to `HealthService`. This is how NestJS knows what to inject.

When imported as `import type`, TypeScript **strips it at compile time** - no metadata is emitted, and NestJS dependency injection fails.

## Solution

**Split the imports:** Type-only for interfaces, regular for classes used in DI.

### Before (Broken):
```ts
import type { HealthResponse, HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {} // ❌ Fails - no metadata
}
```

### After (Fixed):
```ts
import type { HealthResponse } from './health.service';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {} // ✅ Works - has metadata
}
```

## Why This Happens

1. **HealthResponse** - Pure interface, only used as type annotation → Safe for `type` import
2. **HealthService** - Class used in constructor → NestJS needs it at runtime → Must be regular import

## Rules to Follow

### Use `type` import for:
- Interfaces
- Type aliases
- Types only used in type annotations

### Use regular import for:
- Classes used in dependency injection
- Classes instantiated directly
- Decorators
- Anything needed at runtime

## Biome Configuration Options

**UPDATE (2025-10-29):** We discovered that Biome's `useImportType` rule repeatedly converts DI imports back to type-only imports, breaking NestJS. This is a known issue with Biome and decorator-based frameworks.

### Solution: Disable `useImportType` Rule for Backend Only

Added to `biome.json`:
```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "style": {
        "useImportType": "error"  // Enabled globally
      }
    }
  },
  "overrides": [
    {
      "includes": ["apps/backend/**"],
      "linter": {
        "rules": {
          "style": {
            "useImportType": "off"  // Disabled only for backend
          }
        }
      }
    }
  ]
}
```

**Why this approach:**
- ✅ Biome cannot detect when a type is used by decorator metadata
- ✅ This is a known limitation with NestJS, Angular, and other decorator-based frameworks
- ✅ Disabling the rule **only for backend** prevents Biome from breaking DI
- ✅ Frontend still gets the benefit of automatic `useImportType` enforcement
- ✅ We can still use inline `type` syntax manually: `import { type HealthResponse, HealthService }`

**Preferred import style in backend:**
```ts
import { type HealthResponse, HealthService } from './health.service';
```

This way:
- `HealthResponse` is clearly a type-only import
- `HealthService` is a value import (needed for DI)
- Biome won't automatically convert it in backend files
- Frontend files still get automatic type import enforcement

## Alternative Solutions Considered

### 1. Disable `useImportType` rule globally ❌
```json
{
  "linter": {
    "rules": {
      "style": {
        "useImportType": "off"
      }
    }
  }
}
```
**Why not:** Loses type-only import benefits everywhere, including frontend where it's safe and beneficial.

### 2. Disable for backend only via separate config ❌
Create separate `biome.json` in backend folder.
**Why not:** Adds complexity, splits configuration across multiple files

### 3. Use overrides to disable for backend only ✅ (Chosen)
Use Biome's `overrides` feature to disable the rule only for `apps/backend/**`.
**Why yes:** Best of both worlds - backend gets exception for NestJS DI, frontend keeps type import enforcement

### 4. Use overrides for specific patterns ❌
```json
{
  "overrides": [{
    "include": ["**/*.controller.ts", "**/*.module.ts"],
    "linter": {
      "rules": {
        "style": {
          "useImportType": "off"
        }
      }
    }
  }]
}
```
**Why not:** Too broad, misses other DI cases (services, guards, interceptors, etc.)

### 5. Split imports manually ❌
Be explicit about what's a type vs what's needed at runtime.

**Why not:**
- Biome would still convert these back to type-only imports (without overrides)
- Requires constant manual fixing after every format/check
- Not sustainable in practice

## Impact on Codebase

This pattern appears in:
- **Controllers** - Injecting services
- **Services** - Injecting other services/repositories
- **Modules** - Using class references in metadata
- **Guards/Interceptors** - Injecting dependencies

## Best Practices Going Forward

1. **Controllers/Services** - Always import DI classes normally
2. **Interfaces/Types** - Use `type` import
3. **When Biome converts** - Check if it's used in DI, fix if needed
4. **Code review** - Watch for `type` imports of classes in constructors

## Example Patterns

### ✅ Correct:
```ts
import type { CreateUserDto, UserResponse } from './dto';
import { UserService } from './user.service';

export class UserController {
  constructor(private userService: UserService) {}
}
```

### ❌ Incorrect:
```ts
import type { CreateUserDto, UserResponse, UserService } from './types';

export class UserController {
  constructor(private userService: UserService) {} // Breaks!
}
```

## Related TypeScript Config

Our `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

These are required for NestJS DI to work.

## Conclusion

- **Disabled Biome's `useImportType` rule for backend only** using overrides
- Frontend keeps the rule enabled for automatic type import enforcement
- Use inline `type` syntax manually in backend: `import { type Interface, Class } from './file'`
- This is a known limitation with Biome and decorator metadata frameworks
- Overrides provide the best solution: backend stability + frontend type safety
- No trade-offs: Each part of the monorepo gets the configuration it needs

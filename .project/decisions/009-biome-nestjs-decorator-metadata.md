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

We could disable the type import rule, but that loses benefits. Instead, we'll:

1. **Keep the rule enabled** (it's generally good)
2. **Manually fix DI classes** when Biome converts them
3. **Add a comment** to prevent future auto-conversion:

```ts
// @ts-expect-error - Need value import for DI metadata
import { HealthService } from './health.service';
```

Or better, just split imports clearly:

```ts
// Types only
import type { HealthResponse } from './health.service';
// Classes for DI
import { HealthService } from './health.service';
```

## Alternative Solutions Considered

### 1. Disable `useImportType` rule ❌
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
**Why not:** Loses type-only import benefits everywhere

### 2. Disable for backend only ❌
Create separate `biome.json` in backend folder.
**Why not:** Adds complexity, splits configuration

### 3. Use overrides for specific patterns ❌
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

### 4. Split imports manually ✅ (Chosen)
Be explicit about what's a type vs what's needed at runtime.

**Why yes:**
- Clearest intent
- No rule changes needed
- Works consistently
- Easy to spot and fix

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

- Keep Biome's `useImportType` rule enabled (it's good)
- Manually split imports when classes are used in DI
- This is a known pattern with decorator metadata
- Clear, explicit imports are better than disabling rules

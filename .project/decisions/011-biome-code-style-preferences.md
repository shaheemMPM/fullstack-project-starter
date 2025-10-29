# ADR 011: Biome Code Style Preferences

**Date:** 2025-10-29
**Status:** Implemented

## Context

User identified 3 specific code style preferences that need to be enforced across the codebase:

1. **Prefer arrow functions over function declarations**
2. **No unnecessary braces in JSX string props** (e.g., prefer `type="small"` over `type={'small'}`)
3. **Prefer async/await over .then().catch() chains** (for consistency)

## Findings

### 1. Arrow Functions: `useArrowFunction`

**Biome Rule:** `complexity/useArrowFunction`

- Enforces arrow function expressions instead of regular function expressions
- Only applies to function expressions, **not top-level function declarations**
- Provides safe auto-fix

**Example:**
```ts
// ❌ Flagged
const z = function() {
  return 0;
}

// ✅ Fixed
const z = () => 0
```

**Configuration:**
```json
{
  "linter": {
    "rules": {
      "complexity": {
        "useArrowFunction": "error"
      }
    }
  }
}
```

**Limitation:** This rule only applies to function expressions, not top-level function declarations like:
```ts
function App() { ... }  // Not caught by rule
```

These need to be manually converted to:
```ts
const App = () => { ... }  // Preferred style
```

### 2. JSX String Literals Without Braces: `useConsistentCurlyBraces`

**Biome Rule:** `style/useConsistentCurlyBraces`

- Enforces consistent use of curly braces in JSX
- Flags unnecessary braces around string literals
- Provides unsafe auto-fix (removes braces)

**Examples:**
```tsx
// ❌ Invalid
<Foo>{'Hello world'}</Foo>
<Foo foo={'bar'} />

// ✅ Valid
<Foo>Hello world</Foo>
<Foo foo="bar" />
```

**Configuration:**
```json
{
  "linter": {
    "rules": {
      "style": {
        "useConsistentCurlyBraces": "error"
      }
    }
  }
}
```

### 3. Prefer async/await Over Promises

**Biome Status:** No specific rule exists

Biome does **not** have a rule to enforce async/await over `.then().catch()` chains. The related rules are:

- `useAwait` - Requires await in async functions
- `noAsyncPromiseExecutor` - Disallows async Promise executors
- `noFloatingPromises` - Requires promises to be handled

**Manual Fix Required:** This is a style preference that must be enforced through code review and manual refactoring.

**Pattern:**
```ts
// ❌ Avoid (in most cases)
useEffect(() => {
  fetch('/api/health')
    .then((res) => res.json())
    .then((data) => setHealth(data))
    .catch(() => setError('Failed'));
}, []);

// ✅ Prefer
useEffect(() => {
  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch {
      setError('Failed');
    }
  };

  fetchHealth();
}, []);
```

**Exception:** Simple top-level calls like `bootstrap().catch()` are acceptable for clarity.

## Decision

Updated `biome.json` to enforce available rules:

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "off"
      },
      "style": {
        "noNonNullAssertion": "off",
        "useConsistentCurlyBraces": "error"
      },
      "complexity": {
        "useArrowFunction": "error"
      }
    }
  }
}
```

## Changes Applied

### Fixed in `apps/frontend/src/App.tsx`:

1. **Function declaration to arrow function:**
   ```diff
   - function App() {
   + const App = () => {
   ```

2. **Promise chain to async/await:**
   ```diff
   - useEffect(() => {
   -   fetch('/api/health')
   -     .then((res) => res.json())
   -     .then((data) => setHealth(data))
   -     .catch(() => setError('Failed to connect to backend'));
   - }, []);
   + useEffect(() => {
   +   const fetchHealth = async () => {
   +     try {
   +       const res = await fetch('/api/health');
   +       const data = await res.json();
   +       setHealth(data);
   +     } catch {
   +       setError('Failed to connect to backend');
   +     }
   +   };
   +
   +   fetchHealth();
   + }, []);
   ```

Biome auto-fixed 2 additional files when running `pnpm check:write`.

## Manual Enforcement Required

Since Biome doesn't have rules for:
- Top-level function declarations → arrow functions
- Prefer async/await over promises

These must be enforced through:
1. Code review
2. Manual refactoring
3. Team conventions

## Best Practices Going Forward

1. **Arrow functions:** Always use arrow functions for React components and utility functions
2. **JSX strings:** Never use braces around string literals - Biome will catch this
3. **Async/await:** Prefer async/await for consistency, except for simple top-level calls
4. **Run checks:** Always run `pnpm check:write` before committing to catch violations

## Impact

- ✅ **useConsistentCurlyBraces**: Fully automated
- ✅ **useArrowFunction**: Automated for function expressions only
- ⚠️ **Prefer async/await**: Manual enforcement required
- ⚠️ **Top-level function declarations**: Manual conversion required

## Summary

Two of three style preferences can be enforced automatically by Biome:
1. ✅ Arrow functions (for function expressions)
2. ✅ No braces around JSX strings
3. ⚠️ Prefer async/await (manual)

The codebase now adheres to all three preferences, and future violations of #1 and #2 will be caught automatically by Biome.

# ADR 012: Tailwind CSS v4 Setup

**Date:** 2025-10-29
**Status:** Implemented

## Context

User requested a minimal Tailwind CSS setup for the React frontend app that is:
- Easy to understand
- Does its job without complexity
- Can be set up quickly (historically time-consuming for the user)

## Decision

Implemented Tailwind CSS v4 with Vite, which has significantly simplified configuration compared to v3.

## Implementation

### 1. Install Dependencies

```bash
pnpm --filter frontend add -D tailwindcss @tailwindcss/vite autoprefixer postcss
```

**Installed:**
- `tailwindcss@4.1.16` - Tailwind CSS v4
- `@tailwindcss/vite` - Vite plugin for Tailwind v4
- `autoprefixer` - PostCSS plugin (dependency)
- `postcss` - CSS processor (dependency)

### 2. Configure Vite

**File:** `apps/frontend/vite.config.ts`

```ts
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
			},
		},
	},
});
```

**Key change:** Added `tailwindcss()` plugin to the plugins array.

### 3. Update CSS

**File:** `apps/frontend/src/index.css`

**Before:** ~70 lines of custom CSS (Vite defaults)

**After:**
```css
@import 'tailwindcss';
```

That's it! One line.

### 4. Replace Inline Styles with Tailwind Classes

**File:** `apps/frontend/src/App.tsx`

Replaced all inline styles with Tailwind utility classes:

**Before:**
```tsx
<div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
  <h1>Project Starter</h1>
  <div style={{
    padding: '1rem',
    background: '#fee',
    border: '1px solid #c33',
    borderRadius: '4px',
    color: '#c33',
  }}>
    {error}
  </div>
</div>
```

**After:**
```tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 font-sans">
  <div className="max-w-4xl mx-auto">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
      Project Starter
    </h1>
    <div className="p-4 bg-red-50 border border-red-300 rounded text-red-700 mb-6">
      {error}
    </div>
  </div>
</div>
```

**Benefits:**
- Much cleaner JSX
- Responsive by default
- Dark mode support included
- Better consistency across components

### 5. Removed Files

- `apps/frontend/src/App.css` - No longer needed, replaced with Tailwind classes

## Key Differences: Tailwind v4 vs v3

### Tailwind v3 (Old Way)
```bash
# More packages needed
npm install -D tailwindcss postcss autoprefixer

# Needed tailwind.config.js
npx tailwindcss init

# Complex tailwind.config.js with content paths
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

# Needed postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

# CSS file needed 3 directives
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Tailwind v4 (New Way)
```bash
# Only 2 packages needed
npm install -D tailwindcss @tailwindcss/vite

# No tailwind.config.js needed (optional for advanced use)
# No postcss.config.js needed
# No content paths configuration

# CSS file needs 1 line
@import 'tailwindcss';
```

**Simplifications:**
- ✅ No `tailwind.config.js` (unless you need customization)
- ✅ No `postcss.config.js`
- ✅ No content glob configuration
- ✅ Single CSS import instead of 3 directives
- ✅ Vite plugin handles everything automatically

## Styling Approach

**Colors and Theme:**
- Light mode: `bg-gray-50` background with `text-gray-900`
- Dark mode: `dark:bg-gray-900` with `dark:text-white`
- Error state: Red palette (`bg-red-50`, `border-red-300`, `text-red-700`)
- Code blocks: Dark gray (`bg-gray-800`, `text-gray-200`)

**Layout:**
- Full height screen: `min-h-screen`
- Centered content: `max-w-4xl mx-auto`
- Consistent spacing: `p-4`, `p-8`, `mb-4`, `mb-6`, `mb-8`
- Rounded corners: `rounded`, `rounded-lg`

**Typography:**
- Headings: `text-4xl font-bold`, `text-2xl font-semibold`
- Code blocks: `text-sm leading-relaxed`
- System font stack: `font-sans` (Tailwind default)

## TypeScript Import Issue Fixed

**Issue:** After Biome formatting, the health controller had a TypeScript error:
```
A type referenced in a decorated signature must be imported with 'import type'
```

**Fix:** Split the imports:
```ts
// Before (caused error)
import { type HealthResponse, HealthService } from './health.service';

// After (works)
import type { HealthResponse } from './health.service';
import { HealthService } from './health.service';
```

This is consistent with our Biome override configuration for the backend (ADR 009).

## Benefits

1. **Minimal setup** - One Vite plugin, one CSS import line
2. **Zero configuration files** - No tailwind.config.js or postcss.config.js
3. **Clean JSX** - No inline styles cluttering components
4. **Dark mode support** - Built-in with `dark:` prefix
5. **Responsive by default** - Tailwind's mobile-first approach
6. **Type-safe** - Works seamlessly with TypeScript
7. **Fast development** - Vite HMR + Tailwind JIT compiler

## Testing

Verified:
- ✅ Dev server starts successfully
- ✅ Vite compiles without errors
- ✅ Tailwind classes are applied (visible in browser)
- ✅ Dark mode works
- ✅ No console errors
- ✅ Biome formatting doesn't break anything

## Future Customization

If needed, create `tailwind.config.js` for:
- Custom colors
- Custom fonts
- Custom breakpoints
- Additional plugins

But for now, the defaults work perfectly.

## Conclusion

Tailwind CSS v4 provides a dramatically simpler setup experience compared to v3. The entire configuration is:
1. Install 2 packages
2. Add 1 plugin to Vite config
3. Add 1 import line to CSS

No more wrestling with configuration files - just start using Tailwind classes immediately.

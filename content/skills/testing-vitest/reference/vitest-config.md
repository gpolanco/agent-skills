# Vitest Configuration Guide

Complete setup and configuration for Vitest in Next.js projects.

---

## vitest.config.ts

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: "jsdom",

    // Setup files
    setupFiles: ["./tests/setup/test-setup.ts"],

    // Global test utilities
    globals: true,

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "tests/",
        "*.config.*",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/types/**",
      ],
      // Coverage thresholds
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },

    // Include/exclude patterns
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", ".next"],

    // Test timeout
    testTimeout: 10000,

    // Watch options
    watch: false,
  },

  // Path aliases (match tsconfig.json)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/domains": path.resolve(__dirname, "./src/domains"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/types": path.resolve(__dirname, "./src/types"),
    },
  },
});
```

---

## Test Setup File

```typescript
// File: tests/setup/test-setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      pathname: '/',
      query: {},
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

---

## package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:ci": "vitest run --coverage --reporter=verbose"
  }
}
```

---

## TypeScript Configuration

```json
// tsconfig.json additions for tests
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["tests/**/*"]
}
```

---

## ESLint Configuration

```javascript
// .eslintrc.js additions
module.exports = {
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx"],
      env: {
        "vitest/env": true,
      },
      plugins: ["testing-library"],
      extends: ["plugin:testing-library/react"],
      rules: {
        "testing-library/prefer-screen-queries": "error",
        "testing-library/no-unnecessary-act": "error",
      },
    },
  ],
};
```

---

## GitHub Actions CI

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Common Issues & Solutions

### Issue: Path aliases not working

**Solution**: Ensure `vitest.config.ts` `resolve.alias` matches `tsconfig.json` paths.

### Issue: Tests fail in CI but pass locally

**Solution**: Check environment variables and add `--run` flag to disable watch mode.

### Issue: Coverage reports are inaccurate

**Solution**: Review `coverage.exclude` patterns and ensure test files are properly excluded.

### Issue: Async tests timing out

**Solution**: Increase `testTimeout` in config or use `waitFor` with custom timeout.

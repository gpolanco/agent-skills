---
name: testing-vitest
description: >
  Comprehensive testing patterns using Vitest and React Testing Library for modern React applications.
  Trigger: Use when writing tests, setting up test infrastructure, or establishing testing best practices.
license: Apache-2.0
metadata:
  author: devcontext
  version: "1.0.0"
  scope: [root]
  auto_invoke: "Writing tests or test configuration"
allowed-tools: Read, Write, Bash
---

# Testing with Vitest (Hybrid Skill)

## When to Use

Use this skill when:

- Writing unit tests for business logic, utilities, or hooks
- Writing component tests for React components with user interactions
- Writing integration tests for API routes or server actions
- Setting up test infrastructure (config, mocks, utilities)
- Establishing testing conventions and coverage goals
- Debugging failing tests or improving test reliability

---

## Critical Patterns

### ALWAYS

- **Test User Behavior**: Test what users do and see, not implementation details
- **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification phases
- **Descriptive Test Names**: Use `it('should <expected behavior> when <condition>')` format
- **Mock External Dependencies**: Mock API calls, third-party services, and environment variables
- **Test Edge Cases**: Include happy path, error cases, and boundary conditions
- **Clean Up**: Use `beforeEach`/`afterEach` to reset state and clean up side effects
- **Accessibility Testing**: Include ARIA roles and labels in component tests
- **Type Safety**: Import and use proper types in test files

### NEVER

- **Never test implementation details**: Avoid testing internal state, private methods, or class names
- **Never use array indices as test identifiers**: Use stable selectors (roles, labels, test-ids)
- **Never skip error scenarios**: Always test error states and edge cases
- **Never commit `.only` or `.skip`**: These are for local debugging only
- **Never use `any` in test types**: Maintain type safety in tests
- **Never share test state**: Each test should be independent
- **Never test framework internals**: Don't test React internals or library behavior

### DEFAULTS

- **File Location**: `/tests/` directory mirroring `/src/` structure
- **File Naming**: `<component-name>.test.ts(x)` or `<feature-name>.test.ts`
- **Coverage Goals**: Minimum 70% overall, 100% for critical business logic
- **Test Framework**: Vitest (fast, ESM-native, Vite-compatible)
- **Component Testing**: React Testing Library (user-centric)
- **Assertions**: Vitest's `expect` API + Testing Library matchers

---

## Decision Tree

```
Need to test React component? → Use @testing-library/react
Need to test hook? → Use @testing-library/react-hooks
Need to test API/server action? → Use supertest or direct function calls
Need to test pure logic/utility? → Use standard Vitest unit tests
Need to test async behavior? → Use async/await with waitFor
Need to debug test? → Use screen.debug() or test.only
```

---

## Test Structure Patterns

### Unit Test Structure

```typescript
// File: /tests/lib/utils/format-date.test.ts
import { describe, it, expect } from "vitest";
import { formatDate } from "@/lib/utils/format-date";

describe("formatDate", () => {
  // Happy path
  it("should format date in ISO format by default", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("2024-01-15");
  });

  // Edge cases
  it("should handle invalid dates gracefully", () => {
    expect(formatDate(new Date("invalid"))).toBe("Invalid Date");
  });

  // Boundary conditions
  it("should handle leap year dates correctly", () => {
    const leapDate = new Date("2024-02-29");
    expect(formatDate(leapDate)).toBe("2024-02-29");
  });
});
```

### Component Test Structure

```typescript
// File: /tests/components/ui/button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should apply correct variant styles', () => {
    const { container } = render(<Button variant="primary">Primary</Button>)
    expect(container.firstChild).toHaveClass('bg-primary')
  })
})
```

### Integration Test Structure

```typescript
// File: /tests/domains/auth/login.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { loginUser } from "@/domains/auth/actions/login-user";

// Mock external dependencies
vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

describe("Login Feature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should login with valid credentials", async () => {
    const result = await loginUser({
      email: "user@example.com",
      password: "ValidPass123!",
    });

    expect(result.success).toBe(true);
  });

  it("should return error for invalid credentials", async () => {
    const result = await loginUser({
      email: "wrong@example.com",
      password: "WrongPass",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should handle network errors gracefully", async () => {
    // Simulate network failure
    vi.mocked(supabase.auth.signInWithPassword).mockRejectedValue(
      new Error("Network error"),
    );

    const result = await loginUser({
      email: "user@example.com",
      password: "ValidPass123!",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Network error");
  });
});
```

---

## Testing Library Queries

### Query Priority (Use in Order)

```typescript
// ✅ 1. ACCESSIBLE TO EVERYONE
screen.getByRole("button", { name: /submit/i });
screen.getByLabelText(/email/i);
screen.getByPlaceholderText(/search/i);
screen.getByText(/welcome/i);

// ✅ 2. SEMANTIC QUERIES
screen.getByAltText(/profile picture/i);
screen.getByTitle(/close/i);

// ⚠️ 3. TEST IDS (Last Resort)
screen.getByTestId("custom-element");
```

### Query Variants

```typescript
// ❌ DON'T: Throws error if not found
screen.getByRole("button");

// ✅ DO: Returns null if not found (for conditional checks)
screen.queryByRole("button");

// ✅ DO: For async elements
await screen.findByRole("button");
```

---

## Mocking Patterns

### Mock External Modules

```typescript
import { vi } from "vitest";

// Mock entire module
vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

// Mock specific function
vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual("@/lib/api");
  return {
    ...actual,
    fetchUser: vi.fn(),
  };
});
```

### Mock Environment Variables

```typescript
import { beforeEach, afterEach } from "vitest";

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
});

afterEach(() => {
  delete process.env.NEXT_PUBLIC_API_URL;
});
```

### Mock Next.js Router

```typescript
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/test-path",
}));
```

---

## Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for specific file
pnpm test path/to/file.test.ts

# Run tests matching pattern
pnpm test --grep "login"

# Debug tests with UI
pnpm test:ui
```

---

## Actions (Setup)

### Initial Setup

```bash
# Install dependencies
pnpm add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom

# Create vitest config
touch vitest.config.ts

# Create test setup file
mkdir -p tests/setup
touch tests/setup/test-setup.ts
```

### Configuration Files

See [reference/vitest-config.md](reference/vitest-config.md) for complete setup.

---

## Resources

- **Configuration Guide**: [reference/vitest-config.md](reference/vitest-config.md)
- **Advanced Patterns**: [reference/advanced-patterns.md](reference/advanced-patterns.md)
- **Mocking Guide**: [reference/mocking-guide.md](reference/mocking-guide.md)
- **Coverage Strategy**: [reference/coverage-strategy.md](reference/coverage-strategy.md)

---

## Cross-References

- **For React patterns** → See `react-19` skill
- **For file structure** → See `structuring-projects` skill
- **For form testing** → See `forms` skill
- **For type safety** → See `typescript` skill

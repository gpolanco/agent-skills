# Mocking Guide

Essential mocking patterns for Vitest testing.

---

## Mocking Philosophy

**Mock only what you need to isolate the unit under test.**

**When to Mock**:

- External APIs and services
- Database calls
- Third-party libraries with side effects
- Time-dependent functions

**When NOT to Mock**:

- Internal utilities (test the integration)
- Simple pure functions
- Constants

---

## Module Mocking

### Mock Entire Module

```typescript
import { vi } from "vitest";

// Auto-mock all exports
vi.mock("@/lib/analytics");

// Custom implementation
vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}));
```

### Partial Module Mock

```typescript
// Keep original, mock only specific exports
vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual("@/lib/api");
  return {
    ...actual,
    fetchUser: vi.fn(), // Only this is mocked
  };
});
```

---

## Function Mocking

### Return Values

```typescript
const mockFn = vi.fn();

// Single return
mockFn.mockReturnValue("result");

// Different values per call
mockFn
  .mockReturnValueOnce("first")
  .mockReturnValueOnce("second")
  .mockReturnValue("default");

// Async
mockFn.mockResolvedValue({ data: "success" });
mockFn.mockRejectedValue(new Error("Failed"));
```

### Custom Implementation

```typescript
mockFn.mockImplementation((arg) => {
  if (arg > 10) return "high";
  return "low";
});
```

---

## Mocking Next.js

### Router

```typescript
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/test",
  useSearchParams: () => new URLSearchParams(),
}));
```

### Server Actions

```typescript
vi.mock("@/app/actions", () => ({
  submitForm: vi.fn(async (data) => ({
    success: true,
    data: { id: "123" },
  })),
}));
```

---

## Mocking Supabase

```typescript
// File: tests/mocks/supabase.ts
export const createMockSupabaseClient = () => ({
  auth: {
    signIn: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
  },
  from: vi.fn((table: string) => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
});

// Usage
vi.mock("@/lib/supabase/client", () => ({
  supabase: createMockSupabaseClient(),
}));
```

---

## Mocking APIs

### fetch

```typescript
global.fetch = vi.fn();

// Success
vi.mocked(fetch).mockResolvedValue({
  ok: true,
  json: async () => ({ data: "success" }),
} as Response);

// Error
vi.mocked(fetch).mockResolvedValue({
  ok: false,
  status: 404,
} as Response);
```

---

## Mocking Browser APIs

### localStorage

```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
```

### Date/Time

```typescript
// Mock to specific time
vi.setSystemTime(new Date("2024-01-01"));

// Use fake timers for setTimeout/setInterval
vi.useFakeTimers();
vi.advanceTimersByTime(1000); // Fast-forward 1s
vi.useRealTimers(); // Restore
```

---

## Mock Assertions

```typescript
const mockFn = vi.fn();

// Called
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);

// Called with args
expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
expect(mockFn).toHaveBeenLastCalledWith("last");

// Partial matching
expect(mockFn).toHaveBeenCalledWith(
  expect.stringContaining("text"),
  expect.any(String),
);
```

---

## Cleanup

```typescript
import { vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.clearAllMocks(); // Clear call history
});

afterEach(() => {
  vi.restoreAllMocks(); // Restore original implementations
});
```

---

## Best Practices

### ✅ DO

- Mock at the module boundary
- Use `vi.spyOn` to keep original behavior while tracking calls
- Reset mocks between tests
- Provide realistic mock data

### ❌ DON'T

- Don't mock what you're testing
- Don't create overly complex mocks
- Don't share mock state between tests
- Don't mock internal implementation details

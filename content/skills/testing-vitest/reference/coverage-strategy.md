# Coverage Strategy

Strategic approach to test coverage.

---

## Coverage Philosophy

**Goal**: Optimize for high-risk areas, not 100% coverage.

**Key Principle**: 70% coverage with the right tests > 100% coverage with meaningless tests.

---

## Priority Matrix

### Priority 1: Critical Business Logic (100%)

**Why**: Bugs affect revenue, data integrity, or security.

**Examples**: Payment processing, Auth, Permissions, Financial calculations

```typescript
describe("calculateOrderTotal", () => {
  it("should apply discount correctly", () => {
    const total = calculateOrderTotal({
      items: [{ price: 100, quantity: 2 }],
      discountPercent: 10,
    });
    expect(total).toBe(180);
  });

  it("should prevent negative totals", () => {
    const total = calculateOrderTotal({
      items: [{ price: 100, quantity: 1 }],
      discountPercent: 150,
    });
    expect(total).toBeGreaterThanOrEqual(0);
  });
});
```

### Priority 2: Complex Algorithms (80%)

**Why**: Complex logic is error-prone.

**Examples**: Data transformations, State machines, Recursive functions

### Priority 3: User-Facing Features (60-80%)

**Why**: Bugs affect UX but aren't catastrophic.

**Examples**: Form validation, UI components, Navigation

### Priority 4: Utilities (40-60%)

**Why**: Usually simple and low-risk.

**Examples**: String formatting, Array helpers, Type guards

---

## What NOT to Test

### ❌ Framework Internals

```typescript
// ❌ DON'T: Test React/Next.js internals
it("should call useEffect on mount", () => {});
```

### ❌ Third-Party Libraries

```typescript
// ❌ DON'T: Test Zod itself
it("should validate with Zod schema", () => {});

// ✅ DO: Test YOUR schema
it("should reject invalid email format", () => {
  const result = userSchema.safeParse({ email: "invalid" });
  expect(result.success).toBe(false);
});
```

### ❌ Constants and Trivial Functions

```typescript
// ❌ DON'T
it("should have correct API URL", () => {
  expect(API_URL).toBe("https://api.example.com");
});
```

---

## Coverage Thresholds

```javascript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,

      // Strict for critical paths
      include: [
        "src/domains/*/actions/**",
        "src/lib/payments/**",
        "src/lib/auth/**",
      ],
    },
  },
});
```

---

## Testing Strategies

### Strategy 1: Happy Path First

```typescript
describe("createUser", () => {
  // 1. Happy path
  it("should create user with valid data", async () => {
    const user = await createUser({ email: "test@example.com" });
    expect(user.email).toBe("test@example.com");
  });

  // 2. Edge cases
  it("should reject duplicate email", async () => {
    await createUser({ email: "test@example.com" });
    await expect(createUser({ email: "test@example.com" })).rejects.toThrow();
  });
});
```

### Strategy 2: Branch Coverage

Use coverage reports to find untested branches, then add tests for each branch.

---

## Anti-Patterns

### ❌ Testing for Coverage Sake

```typescript
// ❌ DON'T
it("should exist", () => {
  expect(myFunction).toBeDefined();
});

// ✅ DO
it("should return formatted date", () => {
  expect(myFunction(new Date("2024-01-01"))).toBe("Jan 1, 2024");
});
```

### ❌ One Giant Test

Split into focused tests instead of one 100-line test.

### ❌ Ignoring Edge Cases

Always test: happy path + error cases + boundary conditions.

---

## Summary

**Golden Rules**:

1. Prioritize critical business logic (100% coverage)
2. Test complex algorithms thoroughly (80%+)
3. Cover user-facing features (60-80%)
4. Don't obsess over 100% coverage
5. Focus on meaningful tests over metrics

**Remember**: A few high-quality tests beat many low-quality tests.

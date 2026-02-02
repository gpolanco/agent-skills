---
name: typescript
description: >
  TypeScript strict patterns and best practices.
  Trigger: When implementing or refactoring TypeScript in .ts/.tsx (types, interfaces, generics, const maps, type guards, removing any, tightening unknown).
license: Apache-2.0
metadata:
  author: prowler-cloud
  version: "1.0.0"
  scope: [root]
  auto_invoke: "Writing TypeScript types/interfaces"
allowed-tools: Read
---

## When to Use

Use this skill when:

- Writing TypeScript types or interfaces
- Refactoring JavaScript to TypeScript
- Removing `any` types from codebase
- Creating type-safe utilities
- Implementing type guards
- Working with generics

---

## Critical Patterns

### ALWAYS

- **Use const types** - Create const object first, extract type
- **Use flat interfaces** - One level depth, nest via references
- **Use unknown** over any for truly unknown types
- **Use generics** for flexible, reusable types
- **Use type guards** for runtime type checking
- **Use import type** for type-only imports
- **Use strict mode** in tsconfig.json

### NEVER

- **Never use any** - use unknown or generics instead
- **Never inline nested objects** - create dedicated interfaces
- **Never create direct union types** - use const types pattern
- **Never skip type guards** for external data

### DEFAULTS

- Strict mode enabled in tsconfig.json
- Types defined in types/ or feature-specific directories
- Use `interface` for object shapes, `type` for unions/intersections
- Use kebab-case for file names (user-types.ts)

---

## Const Types Pattern

```typescript
// ✅ ALWAYS: Create const object first, then extract type
const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

// ❌ NEVER: Direct union types
type Status = "active" | "inactive" | "pending";
```

**Why?** Single source of truth, runtime values, autocomplete, easier refactoring.

---

## Flat Interfaces

```typescript
// ✅ ALWAYS: One level depth, nested objects → dedicated interface
interface UserAddress {
  street: string;
  city: string;
}

interface User {
  id: string;
  name: string;
  address: UserAddress; // Reference, not inline
}

interface Admin extends User {
  permissions: string[];
}

// ❌ NEVER: Inline nested objects
interface User {
  address: { street: string; city: string }; // NO!
}
```

---

## Never Use `any`

```typescript
// ✅ Use unknown for truly unknown types
function parse(input: unknown): User {
  if (isUser(input)) return input;
  throw new Error("Invalid input");
}

// ✅ Use generics for flexible types
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// ❌ NEVER
function parse(input: any): any {}
```

---

## Utility Types

```typescript
Pick<User, "id" | "name">; // Select fields
Omit<User, "id">; // Exclude fields
Partial<User>; // All optional
Required<User>; // All required
Readonly<User>; // All readonly
Record<string, User>; // Object type
Extract<Union, "a" | "b">; // Extract from union
Exclude<Union, "a">; // Exclude from union
NonNullable<T | null>; // Remove null/undefined
ReturnType<typeof fn>; // Function return type
Parameters<typeof fn>; // Function params tuple
```

---

## Type Guards

```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}
```

---

## Import Types

```typescript
import type { User } from "./types";
import { createUser, type Config } from "./utils";
```

---

## Commands

```bash
# Initialize TypeScript in project
pnpm add -D typescript @types/node

# Create tsconfig.json with strict mode
pnpm tsc --init --strict

# Type check
pnpm tsc --noEmit

# Watch mode
pnpm tsc --watch --noEmit
```

---

## Resources

- **TypeScript Handbook**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- **Utility Types**: [Utility Types Reference](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- **tsconfig Reference**: [tsconfig.json](https://www.typescriptlang.org/tsconfig)

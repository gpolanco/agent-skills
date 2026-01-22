---
name: zod-4
description: >
  Guides AI agents in using Zod v4 for runtime validation and TypeScript type inference.
  Trigger: Working with schema validation, form validation, API validation, or zod imports.
  REQUIRES: zod@^4.0.0 (install explicitly: pnpm add zod@^4.0.0)
license: Apache-2.0
metadata:
  author: devcontext
  version: "1.1.0"
  scope: [root]
  auto_invoke: "Creating Zod schemas"
allowed-tools: Read
---

# ⚠️ VERSION REQUIREMENT

**This skill requires Zod v4.x. If installing fresh, use:**

```bash
pnpm add zod@^4.0.0
```

**If you're not sure which version is installed:**
```bash
pnpm list zod
```

**If v3 is installed**, see "Zod v4 Migration Notes" section for breaking changes.

---

## When to Use

Use this skill when:

- Validating API request/response data
- Validating form inputs
- Parsing environment variables
- Validating configuration files
- Creating type-safe schemas with runtime validation
- Migrating from Zod v3 to v4
- Generating TypeScript types from schemas

---

## Critical Patterns

### ALWAYS

- **Use safeParse()** for untrusted input (forms, APIs, user data)
- **Define schemas at module level** - not inside functions (performance)
- **Use z.infer<typeof schema>** for TypeScript type inference
- **Add custom error messages** for better UX (`z.string().min(1, "Required")`)
- **Use pipes** for sequential transformations (v4 feature)
- **Validate environment variables** at application startup
- **Export schemas from types/** directory for reusability
- **Use discriminated unions** for complex response types

### NEVER

- **Never use parse()** without error handling - prefer safeParse()
- **Never create schemas inside functions** - define at module/file level
- **Never ignore type inference** - always use `z.infer<typeof schema>`
- **Never validate in multiple places** - let Zod handle all validation
- **Never use deprecated v3 methods** - use v4 equivalents (see Migration Notes)

### DEFAULTS

- Use `safeParse()` by default for all validation
- Define schemas in `types/` or feature-specific directories
- Use Zod with React Hook Form via `zodResolver`
- Use `z.coerce` for type conversions (strings → numbers, etc.)

---

## Decision Tree

```
Need runtime validation?            → Use Zod
Only compile-time types?            → Use TypeScript types
Validating user input?              → Use safeParse()
Validating trusted internal data?   → Can use parse() but safeParse() safer
Need custom error messages?         → Use inline messages or errorMap
Need to transform data?             → Use .transform() or .pipe()
Complex cross-field validation?     → Use .refine() or .superRefine()
API response with multiple shapes?  → Use discriminated unions
Sharing schemas across features?    → Export from types/ directory
Environment variables?              → Validate at startup with parse()
```

---

## Basic Patterns

### Schema Definition

```typescript
import { z } from "zod";

// Primitive types
const stringSchema = z.string();
const numberSchema = z.number();
const booleanSchema = z.boolean();
const dateSchema = z.date();

// Object schema
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.email(),
  age: z.number().int().positive().optional(),
  role: z.enum(["admin", "user", "guest"]),
  createdAt: z.date().default(() => new Date()),
});

// Infer TypeScript type
type User = z.infer<typeof userSchema>;
```

### Validation

```typescript
// ✅ Safe parsing (recommended)
const result = userSchema.safeParse(data);

if (result.success) {
  const user = result.data; // Type-safe data
} else {
  console.error(result.error.errors);
}

// ❌ Unsafe parsing (throws on error)
try {
  const user = userSchema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(error.errors);
  }
}
```

### Custom Error Messages

```typescript
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");
```

### Zod v4 Feature: Pipes

```typescript
// Transform and validate in sequence
const trimmedEmail = z.string().pipe(z.string().trim().email());

// Multiple transformations
const numberFromString = z.string().pipe(z.coerce.number().positive());

const result = numberFromString.parse("42"); // number: 42
```

---

## Common Use Cases

### Form Validation Example

```typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register("password")} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

### API Response Validation

```typescript
const apiResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: z.enum(["draft", "published", "archived"]),
    }),
  ),
  pagination: z.object({
    page: z.number(),
    total: z.number(),
  }),
});

async function fetchPosts() {
  const response = await fetch("/api/posts");
  const rawData: unknown = await response.json();

  const result = apiResponseSchema.safeParse(rawData);

  if (!result.success) {
    throw new Error("Invalid API response");
  }

  return result.data; // Type-safe!
}
```

### Environment Variables

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
});

// Validate at startup (use parse() here - fail fast if config is wrong)
const env = envSchema.parse(process.env);

export const config = {
  nodeEnv: env.NODE_ENV,
  databaseUrl: env.DATABASE_URL,
  apiKey: env.API_KEY,
  port: env.PORT,
};
```

---

## Zod v4 Migration Notes

### Breaking Changes from v3

**Note:** Based on Zod v4 docs, the migration info in the original skill was **incorrect**. The actual changes are:

```typescript
// ❌ INCORRECT MIGRATION INFO (ignore this)
// v3: z.string().email()  →  v4: z.email()  (WRONG!)
// v3: z.string().uuid()  →  v4: z.uuid()  (WRONG!)

// ✅ CORRECT: These methods still work the SAME in v4
z.string().email(); // ✅ Still valid in v4
z.string().uuid(); // ✅ Still valid in v4
z.string().url(); // ✅ Still valid in v4

// What DID change in v4:
// ❌ v3: z.string().nonempty()
// ✅ v4: z.string().min(1)
```

### What's NEW in v4

- **Pipes**: Explicit chaining `z.string().pipe(z.transform(...))`
- **Better error messages**: More informative by default
- **Performance improvements**: Faster parsing
- **Better type inference**: More accurate TypeScript types

---

## Anti-Patterns to Avoid

```typescript
// ❌ DON'T: Validate in multiple places
const data = schema.parse(input);
if (!data.email) throw new Error("Email required");

// ✅ DO: Let Zod handle all validation
const schema = z.object({
  email: z.string().email(),
});

// ❌ DON'T: Create schemas inside functions
function validate(data: unknown) {
  const schema = z.object({
    /* ... */
  });
  return schema.parse(data);
}

// ✅ DO: Define schemas at module level
const schema = z.object({
  /* ... */
});

function validate(data: unknown) {
  return schema.safeParse(data);
}

// ❌ DON'T: Ignore type inference
const data = schema.parse(input) as User;

// ✅ DO: Use type inference
type User = z.infer<typeof schema>;
const data = schema.parse(input); // Already typed as User
```

---

## Prerequisites

**CRITICAL**: This skill is for **Zod v4.x** specifically.

### Check Your Version

```bash
# Check installed version
pnpm list zod
# or
npm list zod
```

### Install Zod v4

```bash
# Install Zod v4 explicitly
pnpm add zod@^4.0.0

# Or with npm
npm install zod@^4.0.0

# Or with yarn
yarn add zod@^4.0.0
```

**If you have v3 installed**: See "Zod v4 Migration Notes" section below for breaking changes.

---

## Commands

```bash
# Install Zod v4 (EXPLICIT VERSION)
pnpm add zod@^4.0.0

# Verify installed version
pnpm list zod

# Type check
pnpm tsc --noEmit
```

**Note**: For React Hook Form integration, see the form validation example which uses `@hookform/resolvers/zod`.

---

## Resources

- **Advanced Examples**: [reference/advanced-examples.md](reference/advanced-examples.md) - Complex patterns, transformations, error handling
- **Official Docs**: [zod.dev](https://zod.dev)
- **v4 Changelog**: [GitHub Releases](https://github.com/colinhacks/zod/releases)
- **Type Inference**: Always use `z.infer<typeof schema>` for types

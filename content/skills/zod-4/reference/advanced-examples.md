# Advanced Zod Examples

This reference contains detailed Zod validation patterns for complex scenarios.

---

## Form Validation with React Hook Form

```typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data); // Type-safe and validated
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register("password")} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

---

## API Response Validation

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
    console.error("Invalid API response:", result.error);
    throw new Error("Invalid API response");
  }

  return result.data; // Type-safe!
}
```

---

## Environment Variables

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
});

// Validate at startup
const env = envSchema.parse(process.env);

export const config = {
  nodeEnv: env.NODE_ENV,
  databaseUrl: env.DATABASE_URL,
  apiKey: env.API_KEY,
  port: env.PORT,
};
```

---

## Complex Validation with Refine

```typescript
const passwordChangeSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });
```

---

## Discriminated Unions

```typescript
const successResponse = z.object({
  status: z.literal("success"),
  data: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

const errorResponse = z.object({
  status: z.literal("error"),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

const apiResponse = z.discriminatedUnion("status", [
  successResponse,
  errorResponse,
]);

type ApiResponse = z.infer<typeof apiResponse>;

function handleResponse(response: ApiResponse) {
  if (response.status === "success") {
    console.log(response.data.name); // Type-safe
  } else {
    console.error(response.error.message); // Type-safe
  }
}
```

---

## Transformations

```typescript
// Transform input data
const dateFromString = z.string().transform((str) => new Date(str));

const userInputSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((s) => s.toLowerCase()),
  age: z.string().pipe(z.coerce.number()),
  tags: z.string().transform((s) => s.split(",").map((t) => t.trim())),
});

const result = userInputSchema.parse({
  name: "  JOHN DOE  ",
  age: "25",
  tags: "tag1, tag2, tag3",
});
// { name: "john doe", age: 25, tags: ["tag1", "tag2", "tag3"] }
```

---

## Error Handling Utilities

```typescript
// Format errors for display
function formatZodError(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.errors) {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }

  return errors;
}

// Use in API routes
export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { errors: formatZodError(result.error) },
      { status: 400 },
    );
  }

  // result.data is type-safe
  return Response.json({ success: true });
}
```

---

## Partial Schemas

```typescript
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});

// Make all fields optional
const partialUser = userSchema.partial();

// Make specific fields optional
const updateUser = userSchema.partial({ id: true }).required({ name: true });
```

---

## Extending Schemas

```typescript
const baseUser = z.object({
  id: z.string(),
  name: z.string(),
});

const adminUser = baseUser.extend({
  role: z.literal("admin"),
  permissions: z.array(z.string()),
});
```

---

## Array Validation

```typescript
const tagsSchema = z.array(z.string()).min(1).max(10);

const uniqueTags = z
  .array(z.string())
  .refine((tags) => new Set(tags).size === tags.length, {
    message: "Tags must be unique",
  });
```

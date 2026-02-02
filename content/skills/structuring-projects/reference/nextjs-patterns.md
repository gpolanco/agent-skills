# Next.js Patterns

**This reference is specific to Next.js applications (App Router).**

For universal patterns, see [../SKILL.md](../SKILL.md).  
For DDD patterns, see [ddd-rules.md](ddd-rules.md).

---

## When to Use

- Building Next.js 13+ applications with App Router
- React Server Components (RSC) architecture
- Frontend applications with routing and UI components

---

## Project Structure

```
src/
  app/                    # Next.js App Router (routing layer ONLY)
    (auth)/               # Route groups
      login/
        page.tsx
    dashboard/
      page.tsx
      layout.tsx
    api/
      users/
        route.ts          # API routes
  
  features/              # Business features
    auth/
      components/        # Feature-specific UI
        login-form.tsx
      hooks/             # React hooks
        use-auth.ts
      actions/           # Server actions
        login-action.ts
      types/
        auth.types.ts
      utils/
        validate-email.ts
      index.ts           # Public API
    
    dashboard/
      components/
      hooks/
      actions/
      index.ts
    
    shared/              # Cross-feature infrastructure
      ui/                # Design system components
        button.tsx
        input.tsx
      components/        # Generic components
        error-boundary.tsx
        layout.tsx
      hooks/             # Generic hooks
        use-debounce.ts
        use-local-storage.ts
      types/
        utility-types.ts
  
  styles/                # Global styles
    globals.css
  
  types/                 # Global type augmentations only
    env.d.ts
  
  config/                # App configuration
    site-config.ts

tests/                   # All tests
  unit/
  integration/
  e2e/
```

---

## Critical Rules

### ALWAYS

- **Keep `app/` routing-only**: No business logic, only route definitions
- **Business logic in features**: `features/<domain>/components`, `services`, `actions`
- **Server Actions in features**: `features/<domain>/actions/`, NOT `app/actions`
- **Import from public APIs**: `@/features/auth`, NOT `@/features/auth/utils/internal`

### NEVER

- **Never put Server Actions in `app/actions`**: Move to feature actions
- **Never put business logic in page.tsx**: Extract to feature services/actions
- **Never import feature internals**: Always use public API (index.ts)
- **Never mix tests in src/**: All tests in `/tests` directory

---

## App Router Structure

### Page Files

```tsx
// app/dashboard/page.tsx (routing layer)
import { DashboardView } from "@/features/dashboard";

export default async function DashboardPage() {
  // ✅ OK: Data fetching here (RSC)
  const data = await fetchDashboardData();
  
  // ❌ BAD: Business logic here
  // const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // ✅ GOOD: Delegate to feature component
  return <DashboardView data={data} />;
}
```

### Layout Files

```tsx
// app/dashboard/layout.tsx
import { DashboardNav } from "@/features/dashboard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardNav />
      {children}
    </div>
  );
}
```

### API Routes

```typescript
// app/api/users/route.ts
import { getUsersAction } from "@/features/users";

export async function GET(request: Request) {
  try {
    const users = await getUsersAction();
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
```

---

## Feature Structure (Next.js Specific)

### Complete Feature Example

```
features/auth/
├── components/
│   ├── login-form.tsx       # UI component
│   ├── signup-form.tsx
│   └── auth-provider.tsx    # Context provider
│
├── hooks/
│   ├── use-auth.ts          # Custom hook
│   └── use-session.ts
│
├── actions/
│   ├── login-action.ts      # Server Action
│   ├── logout-action.ts
│   └── signup-action.ts
│
├── types/
│   ├── auth.types.ts
│   └── session.types.ts
│
├── utils/
│   └── validate-password.ts # Private helper
│
├── routes.ts                # Route definitions
└── index.ts                 # Public API
```

### Public API (index.ts)

```typescript
// features/auth/index.ts
export { LoginForm } from "./components/login-form";
export { SignupForm } from "./components/signup-form";
export { AuthProvider } from "./components/auth-provider";

export { useAuth } from "./hooks/use-auth";
export { useSession } from "./hooks/use-session";

export { loginAction } from "./actions/login-action";
export { logoutAction } from "./actions/logout-action";

export type { User, AuthState, Session } from "./types/auth.types";

// ❌ DO NOT export internal utils
// export { validatePassword } from "./utils/validate-password";
```

---

## Server Actions Pattern

### Server Action Location

```
❌ BAD:
app/actions/
  auth-actions.ts    # DON'T put here

✅ GOOD:
features/auth/actions/
  login-action.ts    # Feature-specific actions
```

### Server Action Example

```typescript
// features/auth/actions/login-action.ts
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function loginAction(formData: FormData) {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return { error: "Invalid input" };
  }

  // Validate credentials (use service layer)
  const session = await authService.login(result.data);
  
  if (!session) {
    return { error: "Invalid credentials" };
  }

  redirect("/dashboard");
}
```

### Using Server Actions in Components

```tsx
// features/auth/components/login-form.tsx
"use client";

import { useFormState } from "react-dom";
import { loginAction } from "../actions/login-action";

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      {state?.error && <p>{state.error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Component Patterns

### Client Component

```tsx
// features/dashboard/components/counter.tsx
"use client";

import { useState } from "react";
import { Button } from "@/features/shared/ui/button";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
}
```

### Server Component (Default)

```tsx
// features/dashboard/components/dashboard-view.tsx
import { Card } from "@/features/shared/ui/card";

interface Props {
  data: DashboardData;
}

export async function DashboardView({ data }: Props) {
  // ✅ Can fetch data here
  const stats = await fetchStats();

  return (
    <div>
      <Card>{data.title}</Card>
      <p>{stats.total}</p>
    </div>
  );
}
```

---

## Route Definitions

```typescript
// features/auth/routes.ts
export const AUTH_ROUTES = {
  login: "/login",
  signup: "/signup",
  logout: "/logout",
  resetPassword: "/reset-password",
} as const;

// features/dashboard/routes.ts
export const DASHBOARD_ROUTES = {
  home: "/dashboard",
  settings: "/dashboard/settings",
  profile: "/dashboard/profile",
} as const;
```

### Usage in Components

```tsx
import Link from "next/link";
import { AUTH_ROUTES } from "@/features/auth/routes";

export function Nav() {
  return (
    <nav>
      <Link href={AUTH_ROUTES.login}>Login</Link>
    </nav>
  );
}
```

---

## Shared UI Components

```
features/shared/ui/
├── button.tsx           # Button component
├── input.tsx            # Input component
├── card.tsx             # Card component
├── modal.tsx            # Modal component
└── index.ts             # Export all

features/shared/components/
├── error-boundary.tsx   # Error boundary
├── loading-state.tsx    # Loading state
└── layout.tsx           # App layout
```

### Button Example

```tsx
// features/shared/ui/button.tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded",
        variant === "primary" && "bg-blue-500 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-900",
        className
      )}
      {...props}
    />
  );
}
```

---

## Data Fetching Patterns

### Server Component Data Fetching

```tsx
// app/dashboard/page.tsx
import { DashboardView } from "@/features/dashboard";
import { getDashboardData } from "@/features/dashboard/actions/get-dashboard-data";

export default async function DashboardPage() {
  // ✅ Fetch in RSC
  const data = await getDashboardData();

  return <DashboardView data={data} />;
}
```

### Client Component Data Fetching

```tsx
// features/dashboard/components/live-updates.tsx
"use client";

import { useEffect, useState } from "react";

export function LiveUpdates() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/updates")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{data?.message}</div>;
}
```

---

## Anti-Patterns in Next.js

### ❌ Business Logic in page.tsx

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const invoices = await prisma.invoice.findMany();  // ❌ Direct DB access
  
  // ❌ Business logic in route
  const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pending = invoices.filter(inv => inv.status === "pending");
  
  return <div>{total}</div>;
}
```

### ✅ Delegate to Feature

```tsx
// app/dashboard/page.tsx
import { DashboardView } from "@/features/dashboard";
import { getDashboardSummary } from "@/features/dashboard/actions/get-dashboard-summary";

export default async function DashboardPage() {
  // ✅ Delegate to feature action
  const summary = await getDashboardSummary();
  
  return <DashboardView summary={summary} />;
}
```

---

### ❌ Server Actions in app/actions

```
app/actions/
  auth.ts           # ❌ DON'T
  users.ts          # ❌ DON'T
```

### ✅ Server Actions in Features

```
features/auth/actions/
  login-action.ts   # ✅ DO
  
features/users/actions/
  create-user-action.ts  # ✅ DO
```

---

### ❌ Importing Feature Internals

```tsx
// ❌ BAD
import { validatePassword } from "@/features/auth/utils/validate-password";
import { LoginForm } from "@/features/auth/components/login-form";
```

### ✅ Using Public API

```tsx
// ✅ GOOD
import { LoginForm, useAuth } from "@/features/auth";
```

---

## Commands

```bash
# Create Next.js feature structure
mkdir -p src/features/<feature-name>/{components,hooks,actions,types,utils}
touch src/features/<feature-name>/index.ts
touch src/features/<feature-name>/routes.ts

# Create shared UI components
mkdir -p src/features/shared/ui
touch src/features/shared/ui/index.ts

# Create App Router page
mkdir -p src/app/<route>
touch src/app/<route>/page.tsx
touch src/app/<route>/layout.tsx
```

---

## Resources

- **Universal Patterns**: [../SKILL.md](../SKILL.md)
- **DDD Patterns**: [ddd-rules.md](ddd-rules.md)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

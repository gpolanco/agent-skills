# Typed Routing System

Type-safe, centralized route management for Next.js projects.

---

## When to Use

Use this pattern when:

- You want to eliminate hardcoded routes (`"/dashboard"`)
- You need type-safe navigation with dynamic params
- You want centralized metadata (titles, descriptions)
- You have multiple features with distinct routing

---

## Core Principle

> Routes are **contracts**, not strings.
> If it doesn't go through the routing system, it doesn't exist.

---

## Structure

```
features/
├── routes.ts                    # Global aggregator
├── shared/
│   ├── types/routes.ts         # Shared route types
│   └── utils/routes.ts         # Route utilities (optional)
└── <feature>/
    └── routes.ts               # Feature-specific routes
```

---

## Route Types

```typescript
// features/shared/types/routes.ts
export interface BaseRoute {
  path: string;
  title: string;
  description: string;
}

export interface DynamicRoute<
  T extends Record<string, string>,
> extends BaseRoute {
  generatePath: (params: T) => string;
}
```

---

## Feature Routes

```typescript
// features/clubs/routes.ts
export const clubsRoutes = {
  list: {
    path: "/clubs",
    title: "Clubs",
    description: "Browse all clubs",
  } satisfies BaseRoute,

  detail: {
    path: "/clubs/:id",
    title: "Club Details",
    description: "View club information",
    generatePath: (params: { id: string }) => `/clubs/${params.id}`,
  } satisfies DynamicRoute<{ id: string }>,

  edit: {
    path: "/clubs/:id/edit",
    title: "Edit Club",
    description: "Modify club settings",
    generatePath: (params: { id: string }) => `/clubs/${params.id}/edit`,
  } satisfies DynamicRoute<{ id: string }>,
} as const;
```

---

## Global Aggregator

```typescript
// features/routes.ts
import { clubsRoutes } from "./clubs/routes";
import { dashboardRoutes } from "./dashboard/routes";

export const appRoutes = {
  home: {
    path: "/",
    title: "Home",
    description: "Welcome page",
  } satisfies BaseRoute,

  clubs: clubsRoutes,
  dashboard: dashboardRoutes,
} as const;
```

---

## Usage

### Navigation

```typescript
import { appRoutes } from "@/features/routes";
import { useRouter } from "next/navigation";

// Static route
router.push(appRoutes.clubs.list.path);

// Dynamic route
router.push(appRoutes.clubs.detail.generatePath({ id: "123" }));
```

### Links

```typescript
import Link from "next/link";
import { appRoutes } from "@/features/routes";

<Link href={appRoutes.clubs.list.path}>
  {appRoutes.clubs.list.title}
</Link>

<Link href={appRoutes.clubs.edit.generatePath({ id: club.id })}>
  Edit
</Link>
```

### Metadata

```typescript
// app/clubs/page.tsx
import { appRoutes } from "@/features/routes";

export const metadata = {
  title: appRoutes.clubs.list.title,
  description: appRoutes.clubs.list.description,
};
```

---

## Rules

### ALWAYS

- Use `satisfies BaseRoute` or `satisfies DynamicRoute<T>`
- End route objects with `as const`
- Use semantic keys (`list`, `detail`, `edit`)
- Start `path` with `/`, never end with `/`
- Use `:param` syntax for dynamic segments
- Provide `generatePath` for dynamic routes

### NEVER

- Never hardcode routes in UI/logic (`"/clubs"`)
- Never manually interpolate params (`` `/clubs/${id}` ``)
- Never use type casts (`as BaseRoute`)
- Never duplicate paths across files
- Never define metadata outside the routing system
- Never create routes without semantic keys

---

## Contract Test

```typescript
// tests/features/routes.test.ts
import { describe, it, expect } from "vitest";
import { appRoutes } from "@/features/routes";

describe("Routes Contract", () => {
  it("all routes have path, title, description", () => {
    const validateRoute = (route: any) => {
      expect(route.path).toBeTypeOf("string");
      expect(route.path).toMatch(/^\//);
      expect(route.title).toBeTypeOf("string");
      expect(route.description).toBeTypeOf("string");
    };

    Object.values(appRoutes).forEach((namespace) => {
      if (typeof namespace === "object" && "path" in namespace) {
        validateRoute(namespace);
      } else {
        Object.values(namespace).forEach(validateRoute);
      }
    });
  });

  it("dynamic routes have valid generatePath", () => {
    const detail = appRoutes.clubs.detail;
    const path = detail.generatePath({ id: "test" });

    expect(path).not.toContain(":");
    expect(path).not.toContain("undefined");
    expect(path).toBe("/clubs/test");
  });
});
```

---

## Anti-Patterns

```typescript
// ❌ Hardcoded route
<Link href="/clubs">Clubs</Link>

// ✅ Use routing system
<Link href={appRoutes.clubs.list.path}>
  {appRoutes.clubs.list.title}
</Link>

// ❌ Manual interpolation
const url = `/clubs/${id}/edit`;

// ✅ Use generatePath
const url = appRoutes.clubs.edit.generatePath({ id });

// ❌ Type cast
const route = { path: "/x" } as BaseRoute;

// ✅ Use satisfies
const route = { path: "/x", title: "X", description: "X" } satisfies BaseRoute;
```

---

## Benefits

- **Type Safety**: Params validated at compile time
- **Single Source of Truth**: Routes, titles, descriptions in one place
- **Refactoring Safety**: Change path once, updates everywhere
- **No Duplicates**: Impossible to have inconsistent routes
- **Metadata Consistency**: Automatically synced across app

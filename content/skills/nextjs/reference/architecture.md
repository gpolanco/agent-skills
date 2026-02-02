# Next.js Architecture Guidelines

This reference provides deep-dive patterns specific to Next.js App Router.

**Cross-references:**

- For React patterns (Server Components, hooks) → See `react-19` skill
- For project structure → See `structuring-projects` skill

---

## App Router vs Pages Router

| Feature        | App Router ✅                      | Pages Router ❌                        |
| -------------- | ---------------------------------- | -------------------------------------- |
| Data fetching  | `async` components, Server Actions | `getServerSideProps`, `getStaticProps` |
| Layouts        | `layout.tsx` (nested)              | `_app.tsx` (single)                    |
| Loading        | `loading.tsx`                      | Manual with state                      |
| Error handling | `error.tsx`                        | `_error.tsx`                           |
| Routing        | File-based with folders            | File-based with files                  |
| Metadata       | `generateMetadata()`               | `next/head`                            |

**Rule:** Always use App Router for new projects.

---

## Route Segment Configuration

```typescript
// Force dynamic rendering
export const dynamic = "force-dynamic";

// Force static rendering
export const dynamic = "force-static";

// Revalidation interval
export const revalidate = 60; // seconds

// Runtime
export const runtime = "edge"; // or "nodejs"

// Opt out of caching
export const fetchCache = "force-no-store";
```

---

## Parallel Routes

```text
app/
├── layout.tsx
├── page.tsx
├── @modal/              # Parallel route (slot)
│   └── (.)photo/[id]/   # Intercepting route
│       └── page.tsx
└── photo/[id]/
    └── page.tsx
```

```typescript
// layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

---

## Intercepting Routes

Used for modals that can also be accessed as standalone pages:

```text
(.)  → Same level
(..) → One level up
(..)(..) → Two levels up
(...) → Root
```

Example: `/feed` shows modal for `/photo/123`, but direct access shows full page.

---

## Streaming with Suspense

```typescript
// Wrap slow components to stream
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Streamed in */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <Chart />
      </Suspense>
    </div>
  );
}
```

---

## Static vs Dynamic Rendering

### Static (Default)

- Built at build time
- Cached on CDN
- Fast performance

### Dynamic

When using:

- `cookies()`, `headers()`
- `searchParams` prop
- `cache: 'no-store'` in fetch
- `dynamic = 'force-dynamic'`

```typescript
// Forces dynamic rendering
import { cookies } from "next/headers";

export default function Page() {
  const token = cookies().get("session"); // Dynamic!
  // ...
}
```

---

## Cache Layers

1. **Request Memoization** - Same fetch in one render = 1 request
2. **Data Cache** - Persisted across requests/deployments
3. **Full Route Cache** - Static routes cached at build time
4. **Router Cache** - Client-side cache for navigation

```typescript
// Opt out of Data Cache
fetch(url, { cache: "no-store" });

// Opt out per file
export const fetchCache = "force-no-store";
```

---

## Image Optimization

```typescript
import Image from "next/image";

// Local image (auto-optimized)
import heroImage from "./hero.jpg";

export function Hero() {
  return (
    <Image
      src={heroImage}
      alt="Hero image"
      placeholder="blur" // Uses blur placeholder
      priority // Preload (LCP images)
    />
  );
}

// Remote image (must configure domains)
<Image
  src="https://example.com/photo.jpg"
  alt="Remote image"
  width={800}
  height={600}
/>
```

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};
```

---

## Font Optimization

```typescript
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* Use in CSS */
body {
  font-family: var(--font-inter), sans-serif;
}
```

---

## Common Mistakes

### ❌ Using Pages Router patterns

```typescript
// WRONG - Pages Router
export async function getServerSideProps() {
  const data = await fetch("...");
  return { props: { data } };
}
```

**Fix:** Use async Server Components.

### ❌ Creating API routes for internal use

```typescript
// WRONG - Unnecessary API route
// app/api/users/route.ts
export async function GET() { ... }

// Then fetching from client
fetch("/api/users");
```

**Fix:** Use Server Components or Server Actions.

### ❌ Using next/router

```typescript
// WRONG
import { useRouter } from "next/router";

// CORRECT
import { useRouter } from "next/navigation";
```

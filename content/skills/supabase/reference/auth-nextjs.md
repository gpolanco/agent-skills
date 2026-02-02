# Supabase Auth with Next.js

API patterns for SSR auth using `@supabase/ssr`.

---

## Install

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

## Environment

```env
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<key>
```

---

## Server Client

Use in Server Components, Server Actions, Route Handlers:

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
};
```

---

## Browser Client

Use ONLY for auth UI (login/logout buttons):

```typescript
"use client";

import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
```

---

## Middleware (Session Refresh)

Refreshes expired tokens. Place at project root:

```typescript
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Validate token - use getClaims(), NOT getSession()
  const { data } = await supabase.auth.getClaims();

  // Redirect unauthenticated users (handle protection here, not in layouts)
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
  if (isProtectedRoute && !data?.claims) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

> **Note**: Route protection should happen in middleware, not in layouts.

---

## Auth API Methods

### OAuth Login

```typescript
// Call from client component (button onClick)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "github", // or "google", "azure", etc.
  options: {
    redirectTo: `${window.location.origin}/dashboard`,
  },
});
```

### Logout

```typescript
// Call from client component
await supabase.auth.signOut();
// Then redirect with router.push("/login")
```

### Get Current User

```typescript
// Server-side (in Server Component or Action)
const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();
// user is null if not authenticated
```

### Validate Token (Server-side)

```typescript
// In middleware or server code
const { data } = await supabase.auth.getClaims();
// data.claims contains JWT claims if valid
```

---

## Email/Password (Optional)

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "securepassword",
});
```

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "securepassword",
});
```

---

## Verification Checklist

- [ ] Env vars set correctly
- [ ] Middleware at project root
- [ ] OAuth provider enabled in Supabase dashboard
- [ ] Redirect URLs configured in Supabase auth settings

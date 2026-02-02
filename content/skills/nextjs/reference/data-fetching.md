# Server-First Data Fetching

Architecture patterns for data access in Next.js App Router.

> **Note**: This pattern defines the Action → Service flow. For Repository implementation, see `structuring-projects` skill (DDD patterns).

---

## Core Principle

> **The server is the primary source of data.**
> Client only fetches when server cannot do it properly.

---

## When to Use

- Loading data in Server Components
- Implementing Server Actions with database access
- Organizing data access in Action → Service flow

**Cross-references:**

- For Server Actions → See `react-19` skill
- For Repository layer → See `structuring-projects` (DDD patterns)
- For validation → See `zod-4` skill

---

## Architecture Flow

```
┌─────────────────────────────────────┐
│  UI (Server Component / Client)     │
│  └─ Calls Server Action             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Action (features/<feature>/actions)│
│  - Validates input (Zod)            │
│  - Calls service                    │
│  - Returns ApiResponse<T>           │
│  - NO exceptions thrown             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Service (features/<feature>/services)|
│  - Uses withAppContext              │
│  - Calls repo OR fetch directly     │
│  - Returns domain model             │
│  - Exceptions allowed               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Repository (optional, for DDD)     │
│  - Data access abstraction          │
│  - Throws domain errors             │
│  - See DDD patterns →               │
└─────────────────────────────────────┘
```

---

## ALWAYS

- **Fetch in Server Components** by default
- **Validate ALL inputs** with Zod in Actions (including IDs)
- **Return `ApiResponse<T>`** from Actions (never throw)
- **Call Service** from Actions (never Repository directly)
- **Use `withAppContext`** in Services for DI
- **Parallelize independent data** with `Promise.all`

## NEVER

- Never fetch in client without `// JUSTIFICATION` comment
- Never import Repository directly in Actions or pages
- Never throw exceptions from Actions (use ApiResponse)
- Never skip validation in Actions
- Never use sequential awaits for independent data

---

## Server Components (Default)

```typescript
// app/users/page.tsx
import { getUserList } from "@/features/users/services/user-service";

export default async function UsersPage() {
  const users = await getUserList();

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

---

## Client Fetch (Exceptions Only)

```typescript
"use client";

// ✅ OK: User interaction (live search)
// JUSTIFICATION: Search query changes on keystroke
export const UserSearch: React.FC = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    searchUsers(query).then(setResults);
  }, [query]);
};

// ❌ WRONG: Static data that could be loaded in server
("use client");
export const UserList: React.FC = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers); // Should be in Server Component
  }, []);
};
```

---

## Action Layer

```typescript
// features/users/actions/get-project.ts
"use server";

import { projectIdSchema } from "../schemas";
import { getProject } from "../services/user-service";
import {
  successResponse,
  errorResponse,
  handleErrorResponse,
} from "@/features/shared/utils/api";

export async function getProjectAction(
  projectId: string,
): Promise<ApiResponse<Project>> {
  try {
    // 1. Validate
    const validation = projectIdSchema.safeParse(projectId);
    if (!validation.success) {
      return errorResponse("Invalid project ID");
    }

    // 2. Call service
    const project = await getProject(validation.data);

    // 3. Return success
    return successResponse(project);
  } catch (error) {
    // 4. Handle errors
    return handleErrorResponse(error);
  }
}
```

---

## Service Layer

```typescript
// features/users/services/user-service.ts
import { withAppContext } from "@/features/core/context/app-context";
import { ProjectsRepository } from "@/features/core/infra/repositories/projects-repository";

export async function getProject(projectId: string): Promise<Project> {
  return withAppContext(async (ctx) => {
    // Initialize repository with injected database client
    const repo = new ProjectsRepository(ctx.supabase);

    // Call repository (may throw domain errors)
    return repo.getById(projectId);
  });
}
```

### Option B: Direct Database Access (Simple Apps without DDD)

```typescript
// features/users/services/user-service.ts
export async function getProject(projectId: string): Promise<Project> {
  return withAppContext(async (ctx) => {
    const { data, error } = await ctx.supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error) throw new Error(`Project not found: ${projectId}`);
    return data;
  });
}
```

> **Note**: Repository implementation is covered in `structuring-projects` (DDD patterns).

---

## API Response Contract

```typescript
// features/shared/types/api.ts
export type ApiResponse<T, TField extends string = string> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<TField, string>> };
```

```typescript
// features/shared/utils/api.ts
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { ok: true, data, message };
}

export function errorResponse<TField extends string>(
  error: string,
  fieldErrors?: Partial<Record<TField, string>>,
): ApiResponse<never, TField> {
  return { ok: false, error, fieldErrors };
}

export function handleErrorResponse(error: unknown): ApiResponse<never> {
  // Check if domain error (see DDD patterns)
  if (isDomainError(error)) {
    return { ok: false, error: error.message };
  }

  console.error("Unexpected error:", error);
  return { ok: false, error: "An unexpected error occurred" };
}
```

---

## Context (Dependency Injection)

```typescript
// features/core/context/app-context.ts
// Example using Supabase. Adapt to your database client.

interface AppContext {
  supabase: SupabaseClient;
  user: User | null;
}

export async function withAppContext<T>(
  callback: (context: AppContext) => Promise<T>,
): Promise<T> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return callback({ supabase, user });
}
```

---

## Schemas

```typescript
// features/users/schemas.ts
import { z } from "zod";

// ALWAYS validate IDs
export const projectIdSchema = z.string().uuid();

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["user", "admin"]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

---

## Parallelization

```typescript
// ✅ Good: Parallel fetch
export default async function UserPage({ params }: Props) {
  const [user, posts, comments] = await Promise.all([
    getUserById(params.id),
    getUserPosts(params.id),
    getUserComments(params.id),
  ]);

  return <UserProfile user={user} posts={posts} comments={comments} />;
}

// ❌ Bad: Sequential waterfall
export default async function UserPage({ params }: Props) {
  const user = await getUserById(params.id);
  const posts = await getUserPosts(params.id);    // Waits for user
  const comments = await getUserComments(params.id); // Waits for posts

  return <UserProfile user={user} posts={posts} comments={comments} />;
}
```

---

## File Organization

```
features/
├── users/
│   ├── actions/
│   │   ├── get-project.ts
│   │   └── create-user.ts
│   ├── services/
│   │   └── user-service.ts
│   └── schemas.ts
│
├── core/
│   ├── context/
│   │   └── app-context.ts
│   └── infra/
│       └── repositories/
│           └── projects-repository.ts  # See DDD patterns
│
└── shared/
    ├── types/
    │   └── api.ts
    └── utils/
        └── api.ts
```

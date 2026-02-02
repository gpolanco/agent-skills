---
name: react-19
description: >
  React 19 features and patterns with React Compiler.
  Trigger: When writing React 19 components/hooks in .tsx/.jsx files (Actions, use() hook, refs as props, Context providers).
license: Apache-2.0
metadata:
  author: gpolanco
  version: "1.1.0"
  scope: [root]
  auto_invoke: "Writing React components"
allowed-tools: Read
---

# React 19

## 🚨 CRITICAL: Reference Files are MANDATORY

**This SKILL.md provides OVERVIEW only. For EXACT patterns:**

| Task | MANDATORY Reading |
|------|-------------------|
| **Advanced Features & Patterns** | ⚠️ [reference/advanced.md](reference/advanced.md) |

**⚠️ DO NOT implement complex React 19 features without reading [advanced.md](reference/advanced.md) FIRST.**

---

## Imports (REQUIRED)

```typescript
// ✅ ALWAYS: Named imports
import { useState, useEffect, useRef, use } from "react";
import type { FC } from "react";

// ❌ NEVER: Default or namespace imports
import React from "react";
import * as React from "react";
React.useState(); // Wrong
```

## Component Declaration (REQUIRED)

```typescript
// ✅ ALWAYS: Arrow function + React.FC + named export
interface ProductListProps {
  products: Product[];
  onSelect: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onSelect }) => {
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id} onClick={() => onSelect(p.id)}>
          {p.name}
        </li>
      ))}
    </ul>
  );
};

// ❌ NEVER: function declaration for components
export function ProductList({ products }: ProductListProps) { ... }

// ❌ NEVER: default export (unless required by framework)
export default ProductList;

// ✅ EXCEPTION: Next.js pages/layouts require default export
// app/page.tsx
export default function Page() { ... }
```

## No Manual Memoization (REQUIRED)

React Compiler handles optimization automatically. Never use `useMemo`, `useCallback`, or `memo` manually.

```typescript
// ✅ React Compiler optimizes automatically
export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const filtered = products.filter((p) => p.inStock);
  const sorted = filtered.sort((a, b) => a.price - b.price);

  const handleAddToCart = (id: string) => {
    addToCart(id);
  };

  return <List items={sorted} onAdd={handleAddToCart} />;
};

// ❌ NEVER: Manual memoization
const filtered = useMemo(() => products.filter((p) => p.inStock), [products]);
const sorted = useMemo(() => filtered.sort((a, b) => a.price - b.price), [filtered]);
const handleAddToCart = useCallback((id) => addToCart(id), []);
```

---

## 🚫 Critical Anti-Patterns

- **DO NOT** use `useMemo`, `useCallback`, or `memo` manually → React Compiler handles this automatically.
- **DO NOT** use function declarations for components → Use arrow functions + `React.FC` + named export.
- **DO NOT** create promises inside a component's render and pass them to `use()` → Always pass promises from outside or parent.
- **DO NOT** use `forwardRef` → In React 19, `ref` is a regular prop.

---

## use() Hook for Promises

Read promises in render. React suspends until resolved.

```typescript
import { use, Suspense } from "react";

interface CommentsProps {
  commentsPromise: Promise<Comment[]>;
}

// Read promises (requires Suspense boundary)
export const Comments: React.FC<CommentsProps> = ({ commentsPromise }) => {
  const comments = use(commentsPromise);
  return (
    <>
      {comments.map((c) => (
        <p key={c.id}>{c.text}</p>
      ))}
    </>
  );
};

export const Page: React.FC<CommentsProps> = ({ commentsPromise }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
};
```

**Important**: `use()` does NOT support promises created in render. Pass promises from outside the component.

```typescript
// ❌ NEVER: Create promise in render
export const Component: React.FC = () => {
  const data = use(fetchData()); // Error!
  return <div>{data}</div>;
};

// ✅ Promise created outside and passed as prop
export const Parent: React.FC = () => {
  const dataPromise = fetchData();
  return <Child promise={dataPromise} />;
};

export const Child: React.FC<{ promise: Promise<Data> }> = ({ promise }) => {
  const data = use(promise);
  return <div>{data}</div>;
};
```

## use() Hook for Context

Read Context conditionally (not possible with `useContext`).

```typescript
import { use } from "react";

interface HeadingProps {
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ children }) => {
  if (children == null) {
    return null;
  }

  // ✅ Can use after early return
  const theme = use(ThemeContext);

  return <h1 style={{ color: theme.color }}>{children}</h1>;
};

// ❌ useContext doesn't work after early returns
export const HeadingWrong: React.FC<HeadingProps> = ({ children }) => {
  if (children == null) {
    return null;
  }

  const theme = useContext(ThemeContext); // Error: unreachable
  return <h1 style={{ color: theme.color }}>{children}</h1>;
};
```

**Key difference**: `use()` can be called conditionally, `useContext()` cannot.

## Actions with useTransition

Handle async operations with automatic pending states.

```typescript
import { useState, useTransition } from "react";

export const UpdateName: React.FC = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      }
      // Success - navigate or update UI
    });
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Updating..." : "Update"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};
```

## Server Actions Patterns

### Pattern A: Native Form Actions (Progressive Enhancement)

Use with `useActionState` and `FormData`. Requires `(prevState, formData)`.

### Pattern B: Programmatic Actions (react-hook-form)

Use when using `react-hook-form`. Pass a typed object directly to the action.

```typescript
// ✅ Action receives the object from form.handleSubmit
export async function loginAction(data: LoginInput) {
  try {
    await authService.login(data);
    redirect("/dashboard");
  } catch (error) {
    return handleErrorResponse(error);
  }
}
```

## useActionState for Forms

Simplifies form handling with automatic pending states and error management.

```typescript
import { useActionState } from "react";

// Action function
async function updateName(previousState: State | null, formData: FormData) {
  const name = formData.get("name");
  const error = await saveNameToAPI(name);

  if (error) {
    return { error }; // Return error state
  }

  return { success: true }; // Return success state
}

// Component
export const NameForm: React.FC = () => {
  const [state, formAction, isPending] = useActionState(updateName, null);

  return (
    <form action={formAction}>
      <input type="text" name="name" required />
      <button disabled={isPending}>{isPending ? "Saving..." : "Save"}</button>
      {state?.error && <p className="error">{state.error}</p>}
      {state?.success && <p className="success">Saved!</p>}
    </form>
  );
};
```

// ✅ Server Action with Typed Objects (for react-hook-form)
export async function updateProfile(data: ProfileInput) {
try {
const validated = profileSchema.parse(data);
await db.update(validated);
return { success: true };
} catch (error) {
return handleErrorResponse(error);
}
}

// ❌ NEVER: Force FormData if not using native <form action>
// If using react-hook-form, pass the object directly to the action.

## useOptimistic for Instant UI Updates

Show optimistic state while async request is in progress.

```typescript
import { useOptimistic } from "react";

interface TodoListProps {
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, addTodo }) => {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }]
  );

  const handleAdd = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const tempId = crypto.randomUUID();

    // Show optimistic update immediately
    addOptimisticTodo({ id: tempId, title, pending: true });

    // Perform actual request
    await addTodo(title);

    // React automatically reverts to real state when done
  };

  return (
    <form action={handleAdd}>
      <input name="title" required />
      <button>Add</button>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id} className={todo.pending ? "opacity-50" : ""}>
            {todo.title}
          </li>
        ))}
      </ul>
    </form>
  );
};
```

## ref as Prop (No forwardRef)

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

// ✅ React 19: ref is just a prop
export const Input: React.FC<InputProps> = ({ ref, placeholder, ...props }) => {
  return <input ref={ref} placeholder={placeholder} {...props} />;
};

// Usage
export const Form: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Input ref={inputRef} placeholder="Name" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </div>
  );
};

// ❌ Old way (unnecessary in React 19)
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

## ref Cleanup Functions

```typescript
// ✅ Return cleanup function from ref callback
export const VideoPlayer: React.FC = () => {
  return (
    <video
      ref={(ref) => {
        if (ref) {
          // Setup
          const player = new VideoPlayer(ref);
          player.init();

          // Return cleanup
          return () => {
            player.destroy();
          };
        }
      }}
    />
  );
};

// ❌ Don't use implicit returns (TypeScript error)
<div ref={(current) => (instance = current)} />

// ✅ Use explicit block
<div ref={(current) => { instance = current }} />
```

## Context as Provider

```typescript
import { createContext, use, useContext } from "react";

const ThemeContext = createContext("light");

interface AppProps {
  children: React.ReactNode;
}

// ✅ React 19: Use Context directly as provider
export const App: React.FC<AppProps> = ({ children }) => {
  return <ThemeContext value="dark">{children}</ThemeContext>;
};

// ❌ Old way (still works but will be deprecated)
export const AppOld: React.FC<AppProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
  );
};

// Reading context
export const Button: React.FC = () => {
  const theme = use(ThemeContext);
  // or: const theme = useContext(ThemeContext);

  return <button className={theme}>Click</button>;
};
```

## Form Actions (React DOM)

Native form integration with Actions.

```typescript
// ✅ Pass function to action prop
export const ContactForm: React.FC = () => {
  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email");
    const message = formData.get("message");

    await sendEmail(email, message);

    // Form resets automatically on success
  };

  return (
    <form action={handleSubmit}>
      <input type="email" name="email" required />
      <textarea name="message" required />
      <button>Send</button>
    </form>
  );
};
```

## useFormStatus (React DOM)

Access form status without prop drilling.

```typescript
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  children: React.ReactNode;
}

// Design system button
export const SubmitButton: React.FC<SubmitButtonProps> = ({ children }) => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : children}
    </button>
  );
};

// Usage in form
export const Form: React.FC = () => {
  return (
    <form action={handleSubmit}>
      <input name="name" />
      <SubmitButton>Save</SubmitButton>
    </form>
  );
};
```

**Note**: `useFormStatus` must be called inside a component that is a child of a `<form>`.

## useDeferredValue with Initial Value

```typescript
import { useDeferredValue, useState } from "react";

export const SearchResults: React.FC = () => {
  const [query, setQuery] = useState("");

  // ✅ React 19: Provide initial value
  const deferredQuery = useDeferredValue(query, "");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Results query={deferredQuery} />
    </div>
  );
};
```

## Resources

- **Advanced Features**: [reference/advanced.md](reference/advanced.md) - Metadata, Stylesheets, Scripts, Preloading, Breaking Changes
- **Official Docs**: [React 19 Release](https://react.dev/blog/2024/12/05/react-19)
- **Upgrade Guide**: [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

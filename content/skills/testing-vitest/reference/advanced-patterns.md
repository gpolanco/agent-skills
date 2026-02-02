# Advanced Testing Patterns

Complex testing scenarios for enterprise applications.

---

## Testing Server Actions (Next.js)

```typescript
// File: tests/domains/auth/actions/login-user.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginUser } from "@/domains/auth/actions/login-user";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: { signInWithPassword: vi.fn() },
  })),
}));

describe("loginUser Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success with valid credentials", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: { user: { id: "123", email: "user@example.com" } },
      error: null,
    });

    vi.mocked(createClient).mockReturnValue({
      auth: { signInWithPassword: mockSignIn },
    } as any);

    const result = await loginUser({
      email: "user@example.com",
      password: "ValidPass123!",
    });

    expect(result.success).toBe(true);
    expect(mockSignIn).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "ValidPass123!",
    });
  });

  it("should handle validation errors", async () => {
    const result = await loginUser({
      email: "invalid-email",
      password: "123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid email");
  });
});
```

---

## Testing Custom Hooks

```typescript
// File: tests/hooks/use-counter.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCounter } from "@/hooks/use-counter";

describe("useCounter", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("should increment count", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

---

## Testing Forms (React Hook Form + Zod)

```typescript
// File: tests/components/login-form.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/login-form'

describe('LoginForm', () => {
  it('should validate email format', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()

    render(<LoginForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.type(screen.getByLabelText(/password/i), 'ValidPass123!')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should submit with valid data', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()

    render(<LoginForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'ValidPass123!')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'ValidPass123!'
      })
    })
  })
})
```

---

## Testing Context Providers

```typescript
// File: tests/providers/auth-provider.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/providers/auth-provider'

const TestComponent = () => {
  const { user, login } = useAuth()

  return (
    <div>
      <div data-testid="user-status">
        {user ? user.email : 'Not logged in'}
      </div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  it('should provide auth context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in')
  })

  it('should update user on login', async () => {
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByText(/login/i))

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('test@example.com')
    })
  })
})
```

---

## Testing Loading/Error States

```typescript
// File: tests/components/user-profile.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserProfile } from '@/components/user-profile'

describe('UserProfile States', () => {
  it('should show skeleton while loading', () => {
    render(<UserProfile userId="1" isLoading={true} />)

    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
  })

  it('should show error message', () => {
    const error = new Error('Failed to load user')
    render(<UserProfile userId="1" error={error} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load user')
  })

  it('should show data when loaded', () => {
    const user = { id: '1', name: 'John Doe' }
    render(<UserProfile userId="1" data={user} />)

    expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument()
  })
})
```

---

## Testing Async Operations

```typescript
// File: tests/components/data-table.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { DataTable } from '@/components/data-table'

vi.mock('@/lib/api', () => ({
  fetchData: vi.fn()
}))

describe('DataTable Async', () => {
  it('should load and display data', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }]
    vi.mocked(fetchData).mockResolvedValue(mockData)

    render(<DataTable />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })
  })

  it('should retry on failure', async () => {
    const user = userEvent.setup()

    vi.mocked(fetchData)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce([{ id: 1, name: 'Item 1' }])

    render(<DataTable />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /retry/i }))

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })
  })
})
```

---

## Testing Accessibility

```typescript
// File: tests/components/modal.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Modal } from '@/components/modal'

describe('Modal Accessibility', () => {
  it('should trap focus within modal', async () => {
    const user = userEvent.setup()

    render(
      <Modal isOpen={true} onClose={() => {}}>
        <button>First</button>
        <button>Second</button>
        <button>Third</button>
      </Modal>
    )

    const buttons = screen.getAllByRole('button')

    await user.tab()
    expect(buttons[0]).toHaveFocus()

    await user.tab()
    expect(buttons[1]).toHaveFocus()

    await user.tab()
    expect(buttons[2]).toHaveFocus()

    // Should wrap back
    await user.tab()
    expect(buttons[0]).toHaveFocus()
  })

  it('should close with Escape key', async () => {
    const user = userEvent.setup()
    const mockOnClose = vi.fn()

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Content</p>
      </Modal>
    )

    await user.keyboard('{Escape}')
    expect(mockOnClose).toHaveBeenCalled()
  })
})
```

---

## MSW (Mock Service Worker)

```typescript
// File: tests/setup/msw-server.ts
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: "John Doe",
    });
  }),

  http.post("/api/login", async ({ request }) => {
    const body = await request.json();

    if (body.email === "user@example.com") {
      return HttpResponse.json({ success: true, token: "mock-token" });
    }

    return HttpResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 },
    );
  }),
];

export const server = setupServer(...handlers);

// In test-setup.ts
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

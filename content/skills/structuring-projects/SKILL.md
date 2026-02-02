---
name: structuring-projects
description: >
  Enforces universal architectural patterns for organizing code.
  Trigger: When organizing project files, creating features, setting up imports, 
  implementing DDD/Hexagonal/Clean Architecture, or refactoring codebase structure.
  Language-agnostic (applies to Node.js, Next.js, Python, PHP, Go, etc.)
license: Apache-2.0
metadata:
  author: gpolanco
  version: "2.0.0"
  scope: [root]
  auto_invoke: "Organizing project structure"
allowed-tools: Read
---

# ⚠️ AUTO-INVOKE DIRECTIVE

**This skill MUST be read BEFORE:**
- Creating any project structure
- Moving files between directories
- Setting up path aliases
- Deciding where to place code
- Implementing DDD or Clean Architecture

**If you are an AI agent performing any of the above, STOP and read this skill first.**

---

## 🚨 CRITICAL: Reference Files are MANDATORY

**This SKILL.md provides PRINCIPLES only. For EXACT structure:**

| Project Type | MANDATORY Reading |
|--------------|-------------------|
| **Backend API/CLI** (Node.js, Python, Go, PHP) | ⚠️ [reference/node-cli-patterns.md](reference/node-cli-patterns.md) |
| **Frontend** (Next.js, React) | ⚠️ [reference/nextjs-patterns.md](reference/nextjs-patterns.md) |
| **DDD/Hexagonal** | ⚠️ [reference/ddd-rules.md](reference/ddd-rules.md) |

**⚠️ DO NOT invent structure from memory. READ the exact reference file for your project type.**

---

## When to Use

- Setting up a new project structure (any language/framework)
- Creating new features or modules
- Refactoring existing codebase organization
- Defining import boundaries and module contracts
- Implementing DDD, Hexagonal, or Clean Architecture

---

## Decision Tree

```
What type of project are you working on?
│
├─ 🌐 Frontend ONLY (React, Next.js, Vue)
│  └─ ⚠️ STOP → Read reference/nextjs-patterns.md FIRST
│
├─ 🔧 Backend/CLI ONLY (Node.js, Python, Go, PHP)
│  ├─ Simple CRUD?
│  │  └─ ⚠️ STOP → Read reference/node-cli-patterns.md → "Simple Feature-Based" section
│  │
│  └─ Complex Business Logic (DDD)?
│     └─ ⚠️ STOP → Read reference/ddd-rules.md FIRST
│        (DO NOT use the simplified example below - it's incomplete)
│
└─ 📦 Fullstack Monorepo (Multiple Apps)
   ├─ For EACH app in apps/, apply the pattern for its type:
   │  ├─ apps/web/ (Next.js) → Use reference/nextjs-patterns.md
   │  ├─ apps/api/ (Backend) → Use reference/node-cli-patterns.md
   │  └─ apps/worker/ (CLI)  → Use reference/node-cli-patterns.md
   │
   └─ DO NOT mix patterns within a single app
```

**🚫 NEVER create structure from memory or assumptions. ALWAYS read the specific reference file for each app type.**

**Note on Monorepos:**
- A monorepo contains MULTIPLE independent apps in `apps/` or `packages/`
- Each app maintains its OWN structure according to its type (don't mix patterns)
- Example: `apps/web/` uses Next.js patterns, `apps/api/` uses Node.js backend patterns
- Shared code goes in `packages/@shared/` with its own structure

---

## Universal Principles (APPLIES TO ALL LANGUAGES)

### ALWAYS

- **Single Source Root**: All code in `src/` (or language equivalent: `lib/`, `app/`)
- **Organize by Domain/Feature**: Group by business capability, NOT by technical layer
- **Explicit Module Boundaries**: Each feature/module exports a public API
- **Dependency Direction**: Dependencies point INWARD (domain ← infrastructure ← app)
- **Path Aliases**: Use absolute imports (`@/`, `~/`) over deep relative imports
- **Tests Isolated**: Tests in `/tests` (or `__tests__/`, `test/`) not mixed with src

### NEVER

- **Never organize by file type at root**: `controllers/`, `services/`, `models/` as top-level
- **Never use deep relative imports**: `../../../../utils/helper`
- **Never create circular dependencies**: Module A imports B, B imports A
- **Never create global "utils" dumping ground**: Use feature-specific utils
- **Never bypass module boundaries**: Import internal implementation details directly

### DEFAULTS

- Features communicate via public API exports only
- Shared code lives in `shared/` (or `common/`, `core/`)
- Naming: `kebab-case` for files/folders (except Python: `snake_case`)
- Use single path alias: `@/*` → `src/*`

---

## 🚫 Critical Anti-Patterns

- **DO NOT** use deep relative imports (`../../../../`) → use path aliases (`@/*`).
- **DO NOT** organize by file type at root (e.g., `controllers/`, `models/`) → organize by domain/feature.
- **DO NOT** bypass module boundaries → DO NOT import internals from other features directly; always use the public API (`index.ts`).
- **DO NOT** create a circular dependency between features.
- **DO NOT** create a global "utils" folder as a dumping ground → keep utilities specific to the feature they serve.

---

## Architecture Patterns

### 1. Feature-Based (Default - Simple Projects)

**When to use:**
- Simple CRUD applications
- Small to medium projects
- Clear feature boundaries without complex domain logic

**Universal Structure:**

```
src/
  features/
    <feature-name>/
      api/            # Public interface (exported functions/classes)
      services/       # Business logic
      models/         # Data models
      types/          # Type definitions
      utils/          # Feature-specific helpers
      index.<ext>     # Public API exports (CRITICAL)
  
  shared/             # Cross-feature infrastructure
    logging/
    config/
    errors/
  
  app/                # Entry points (meaning varies by framework)
```

**Technology-Specific Details:**
- **Next.js**: See [reference/nextjs-patterns.md](reference/nextjs-patterns.md)
- **Node.js CLI/APIs**: See [reference/node-cli-patterns.md](reference/node-cli-patterns.md)
- **Python**: (Coming soon)
- **PHP**: (Coming soon)

---

### 2. Domain-Driven Design (Complex Projects)

**When to use:**
- Complex business rules and invariants
- Multiple bounded contexts
- Need for domain events
- Large teams requiring clear boundaries

**⚠️ STOP: DO NOT implement DDD from the simplified example below.**

**👉 MANDATORY: Read [reference/ddd-rules.md](reference/ddd-rules.md) FIRST for:**
- Complete folder structure with `app/` entry points
- Layer dependency rules and import patterns
- Concrete examples for your language/runtime

**Simplified Overview (REFERENCE ONLY - NOT for implementation):**

```
src/
  features/            # OR packages/ in monorepo
    core/              # OR <bounded-context>/
      domain/          # Business logic (PURE - no framework/infra)
        entities/
        value-objects/
        repositories/  # Interfaces ONLY
        services/      # Domain services
      
      application/     # Use cases (orchestration layer)
        services/      # Application services
      
      infrastructure/  # Technical implementations
        db/
          repositories/  # Repository implementations
        http/
        messaging/
  
  app/                 # Entry points (see reference/ddd-rules.md)
```

**Key Principle:** Domain layer has ZERO dependencies on infrastructure or frameworks.

**🚨 This example is incomplete. Missing: entry points, shared/, path aliases, and more. → [reference/ddd-rules.md](reference/ddd-rules.md)**

---

## Module Boundaries & Public APIs

### Explicit Exports (CRITICAL PATTERN)

Every feature MUST have a public API file that exports ONLY what other features need:

**TypeScript/JavaScript:**
```typescript
// features/auth/index.ts
export { AuthService } from "./services/auth-service";
export { useAuth } from "./hooks/use-auth";
export type { User, AuthConfig } from "./types";

// ❌ DO NOT export internal helpers
// export { hashPassword } from "./utils/crypto"; // KEEP PRIVATE
```

**Python:**
```python
# features/auth/__init__.py
from .services.auth_service import AuthService
from .types import User, AuthConfig

__all__ = ["AuthService", "User", "AuthConfig"]
```

**PHP:**
```php
<?php
// features/Auth/index.php
namespace App\Features\Auth;

// Export only public classes
```

### Import Rules (Universal)

```typescript
// ✅ ALWAYS: Import from public API
import { AuthService } from "@/features/auth";

// ❌ NEVER: Import internals directly
import { hashPassword } from "@/features/auth/utils/crypto";
import { validateToken } from "@/features/auth/services/internal";
```

---

## Shared Infrastructure Pattern

`shared/` (or `common/`) contains reusable cross-cutting concerns, NOT business logic:

**What belongs in shared/:**
- ✅ Logging utilities
- ✅ Configuration loaders
- ✅ Generic error classes
- ✅ Date/time utilities
- ✅ Retry logic, circuit breakers
- ✅ UI components (for frontend): Button, Input, Modal

**What does NOT belong in shared/:**
- ❌ Business logic (`calculateTax` → belongs in `features/billing/`)
- ❌ Domain-specific utilities (`validateEmail` → belongs in `features/auth/`)
- ❌ Feature-specific types (`User` → belongs in `features/auth/types`)

```
shared/
├── logging/          # ✅ Generic logger
├── config/           # ✅ Config loader
├── errors/           # ✅ Base error classes
└── time/             # ✅ Clock, date utils

// ❌ WRONG:
shared/utils/calculate-tax.ts      # Move to features/billing/
shared/hooks/use-user-profile.ts   # Move to features/auth/
```

---

## Path Aliases (Language-Specific Config)

### TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Python (pyproject.toml)

```toml
[tool.pytest.ini_options]
pythonpath = ["src"]
```

### PHP (composer.json)

```json
{
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  }
}
```

---

## Naming Conventions

| Element | Convention | Example | Notes |
|---------|-----------|---------|-------|
| Files/Folders | `kebab-case` | `user-service.ts`, `auth-module/` | Python: `snake_case` |
| Components/Classes | `PascalCase` | `UserService`, `AuthConfig` | All languages |
| Functions/Variables | `camelCase` | `getUserData()`, `userId` | Python: `snake_case` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` | All languages |

---

## Anti-Patterns (Universal)

### ❌ God Folders

```
src/utils/          # Everything dumped here
  auth.ts
  billing.ts
  user.ts
```

### ✅ Feature-Specific

```
src/features/
  auth/utils/       # Clear ownership
  billing/utils/    # Isolated
```

---

### ❌ Type Soup

```
src/types.ts        # 500+ lines of unrelated types
```

### ✅ Distributed Types

```
src/features/
  auth/types.ts
  billing/types.ts
```

---

### ❌ Cross-Feature Coupling

```typescript
// Importing internals
import { getUserEmail } from "@/features/auth/utils/user";
```

### ✅ Public API

```typescript
// Using public interface
import { getUserEmail } from "@/features/auth";
```

---

## Migration Strategy (Universal)

### Step 1: Audit

```bash
# Find scattered utilities
find src -name "utils" -type d

# Find deep imports
grep -r "import.*\.\./\.\./\.\." src/
```

### Step 2: Create Structure

```bash
# Generic structure (adjust extensions for your language)
mkdir -p src/features/<feature-name>/{api,services,models,types,utils}
touch src/features/<feature-name>/index.<ext>
```

### Step 3: Move Files

Move files from scattered locations to their respective features.

### Step 4: Update Imports

Replace relative imports with alias imports.

### Step 5: Create Public APIs

Export only public interfaces in `index.<ext>` files.

---

## Commands

```bash
# Create feature structure (TypeScript)
mkdir -p src/features/<feature-name>/{api,services,models,types,utils}
touch src/features/<feature-name>/index.ts

# Create shared infrastructure
mkdir -p src/shared/{logging,config,errors}

# Audit existing structure
find src -name "utils" -type d
grep -r "import.*\.\./\.\./\.\." src/

# Find cross-feature imports (audit)
grep -r "import.*@/features/.*/.*/" src/features/
```

---

## Resources

- **DDD Architecture**: [reference/ddd-rules.md](reference/ddd-rules.md) - Universal DDD patterns
- **Next.js Specifics**: [reference/nextjs-patterns.md](reference/nextjs-patterns.md) - App Router, RSC, components
- **Node.js Specifics**: [reference/node-cli-patterns.md](reference/node-cli-patterns.md) - CLI, APIs, services

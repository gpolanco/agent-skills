<!--
  CRITICAL: This file is orchestrated by the @skill-integrator meta-skill.
  Source of Truth (Template): https://raw.githubusercontent.com/gpolanco/skills-as-context/main/templates/AGENTS.template.md
  DO NOT modify the table structures or headers.
-->

# {PROJECT_NAME} - Repository Guidelines

> **Purpose**: {PROJECT_PURPOSE}

---

## Project Overview

**{PROJECT_NAME}** is {brief description of what the project does and for whom}.

**Core Principles** (if applicable):

1. {Principle 1}
2. {Principle 2}
3. {Principle 3}

**Tech Stack:**

<!-- Choose based on project type and customize accordingly -->

<!-- For Frontend (Next.js/React): -->
- **Framework**: Next.js {version} (App Router)
- **UI**: {Styling approach - Tailwind, CSS Modules, etc.}

<!-- For Backend (Node.js): -->
- **Runtime**: Node.js {version}+
- **Framework**: {Express/Fastify/Hono/None}

<!-- For CLI Tools: -->
- **Runtime**: Node.js {version}+
- **Type**: CLI Application

<!-- For Python: -->
- **Runtime**: Python {version}+
- **Framework**: {FastAPI/Django/Flask}

<!-- Common for all: -->
- **Language**: TypeScript (Strict Mode) OR Python OR PHP
- **Database**: {Database name + ORM if applicable}
- **Package Manager**: pnpm (v9+) OR npm OR yarn
- {Add other key technologies}

---

## Available Skills

| Skill              | Description                   | URL                                          |
| ------------------ | ----------------------------- | -------------------------------------------- |
| `skill-integrator` | Manage and import AI skills   | [SKILL.md](skills/skill-integrator/SKILL.md) |
| `skill-creator`    | Create/modify AI agent skills | [SKILL.md](skills/skill-creator/SKILL.md)    |

### Generic Skills

| Skill                  | Description                                 | Status   | URL                                              |
| ---------------------- | ------------------------------------------- | -------- | ------------------------------------------------ |
| `structuring-projects` | Project structure (features, DDD, monorepo) | ✅ Ready | [SKILL.md](skills/structuring-projects/SKILL.md) |
| `react-19`             | React 19 + React Compiler patterns          | ✅ Ready | [SKILL.md](skills/react-19/SKILL.md)             |
| `zod-4`                | Zod v4 runtime validation patterns          | ✅ Ready | [SKILL.md](skills/zod-4/SKILL.md)                |
| `typescript`           | Strict types, const patterns                | ✅ Ready | [SKILL.md](skills/typescript/SKILL.md)           |
| `tailwind-4`           | cn() utility, Tailwind 4 API                | ✅ Ready | [SKILL.md](skills/tailwind-4/SKILL.md)           |
| `nextjs`               | App Router, Server Components               | ✅ Ready | [SKILL.md](skills/nextjs/SKILL.md)               |
| `forms`                | React Hook Form + Zod patterns              | ✅ Ready | [SKILL.md](skills/forms/SKILL.md)                |
| `supabase`             | Auth, RLS, SSR best practices               | ✅ Ready | [SKILL.md](skills/supabase/SKILL.md)             |
| `testing-vitest`       | Vitest testing patterns                     | ✅ Ready | [SKILL.md](skills/testing-vitest/SKILL.md)       |

| {Add/remove skills as needed}

---

## Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                              | Skill                  |
| ----------------------------------- | ---------------------- |
| Integrating/Adding new skills       | `skill-integrator`     |
| Creating new skills                 | `skill-creator`        |
| Organizing project structure        | `structuring-projects` |
| Writing React 19 components         | `react-19`             |
| Creating Zod schemas                | `zod-4`                |
| Writing TypeScript types/interfaces | `typescript`           |
| Styling with Tailwind               | `tailwind-4`           |
| Writing Next.js code                | `nextjs`               |
| Creating forms                      | `forms`                |
| Working with Supabase               | `supabase`             |
| Writing tests                       | `testing-vitest`       |
| {Add project-specific triggers}     | `{project-skill}`      |

---

## Development Rules

### ALWAYS

#### Architecture

**⚠️ CRITICAL: Read the EXACT structure for your project type:**

- **Follow `structuring-projects` skill Decision Tree** → It will tell you which reference file to read
- **Backend API/CLI**: MUST read `skills/structuring-projects/reference/node-cli-patterns.md` FIRST
- **Frontend (Next.js)**: MUST read `skills/structuring-projects/reference/nextjs-patterns.md` FIRST
- **DDD/Hexagonal**: MUST read `skills/structuring-projects/reference/ddd-rules.md` FIRST
- **DO NOT create structure from memory** - Follow the exact examples in reference files
- {Add project-specific architecture rules}

- **Single Source of Truth**: Routes, types, and schemas defined once and imported everywhere

#### Data Flow

<!-- For Next.js projects: -->
- **Server-First Data Loading**: Follow patterns in `nextjs` skill → [reference/data-fetching.md](skills/nextjs/reference/data-fetching.md)
  - Server Components for data fetching
  - Server Actions for mutations

<!-- For Backend projects: -->
- **Layered Architecture**: Follow dependency direction
  - Controllers/Routes → Services → Repositories
  - Domain → Application → Infrastructure (if using DDD)

<!-- For all projects: -->
- **Validate ALL inputs**: Use Zod (see `zod-4` skill) with explicit version `zod@^4.0.0`
- {Add project-specific data flow rules}

### NEVER

#### Scope Violations

- **Never add features without approval** {if product has defined scope}
- {Add project-specific scope violations}

#### Architecture Violations

- **Never mutate objects in App layer** - Always return new objects (if using service layer)
- {Add project-specific architecture violations}

#### Code Quality (CRITICAL)

**⚠️ ALWAYS (Non-Negotiable):**

- **Verify types IMMEDIATELY** after writing code - run `tsc --noEmit` or check IDE errors
- **Fix ALL errors BEFORE continuing** - Never leave red squiggles or linter errors
- **Read linter output** after each file edit - Address every warning/error
- **Test compilation** - Ensure code compiles successfully before moving to next task
- **Validate imports** - Ensure all imports resolve correctly

**🚫 NEVER (Zero Tolerance):**

- **NEVER continue with next task if current code has errors**
- **NEVER leave TypeScript errors unresolved** ("I'll fix it later" = NOT ALLOWED)
- **NEVER assume code works** - Always verify
- **NEVER skip type annotations** on function parameters and returns
- **NEVER use `any`** unless explicitly approved
- **NEVER commit broken code** - Each edit must compile successfully

**Project-Specific:**

- **Never hardcode routes** - Use centralized route definitions from `features/routes.ts`
- **Never return `null` for missing data in repos** - Throw appropriate errors
- {Add project-specific code quality rules}

### DEFAULTS

#### Development

<!-- For Next.js: -->
- Environment: Next.js {version}+ with App Router
- Styling: {Default styling approach}
- State: Server Components first, client state when necessary
- Forms: React Hook Form + Zod v4 validation

<!-- For Node.js Backend/CLI: -->
- Environment: Node.js {version}+
- Configuration: YAML/JSON with Zod v4 validation
- Logging: Structured JSON logs

<!-- For Python: -->
- Environment: Python {version}+
- Configuration: Pydantic validation

<!-- Common: -->
- Database: {Database name} with {ORM/access pattern}
- Testing: {Test framework}

---

## Project-Specific Rules

<!-- Add any unique flows, constraints, or patterns specific to this project -->

### {Feature/Integration Name}

{Description of specific rules for this feature}

- Rule 1
- Rule 2
- Rule 3

---

## Common Commands

```bash
# Development
pnpm dev                     # Start dev server
pnpm build                   # Build for production
pnpm test                    # Run tests

# {Add project-specific commands}
# e.g., Database migrations, code generation, etc.
```

---

## Resources

- {Add external documentation links only}
- [Next.js Documentation](https://nextjs.org/docs) - Next.js App Router
- {Add relevant framework/library docs}

---

> {Add project tagline or quote if applicable}

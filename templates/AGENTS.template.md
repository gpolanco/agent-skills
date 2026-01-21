# {PROJECT_NAME} - Repository Guidelines

\u003e **Purpose**: {PROJECT_PURPOSE}

---

## Project Overview

**{PROJECT_NAME}** is {brief description of what the project does and for whom}.

**Core Principles** (if applicable):

1. {Principle 1}
2. {Principle 2}
3. {Principle 3}

**Tech Stack:**

- **Framework**: Next.js {version} (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database**: {Database name + ORM if applicable}
- **UI**: {Styling approach - Vanilla CSS, Tailwind, etc.}
- **Package Manager**: pnpm (v9+)
- {Add other key technologies}

---

## Available Skills

### Meta Skills

| Skill           | Description                                 | URL                                       |
| --------------- | ------------------------------------------- | ----------------------------------------- |
| `skill-creator` | Create/modify AI agent skills (V5 standard) | [SKILL.md](skills/skill-creator/SKILL.md) |

### Generic Skills

| Skill                  | Description                                 | Status   | URL                                              |
| ---------------------- | ------------------------------------------- | -------- | ------------------------------------------------ |
| `structuring-projects` | Project structure (features, DDD, monorepo) | ✅ Ready | [SKILL.md](skills/structuring-projects/SKILL.md) |
| `react-19`             | React 19 + React Compiler patterns          | ✅ Ready | [SKILL.md](skills/react-19/SKILL.md)             |
| `zod-4`                | Zod v4 runtime validation patterns          | ✅ Ready | [SKILL.md](skills/zod-4/SKILL.md)                |
| `typescript`           | Strict types, const patterns                | ✅ Ready | [SKILL.md](skills/typescript/SKILL.md)           |
| `tailwind-4`           | cn() utility, Tailwind 4 API                | ✅ Ready | [SKILL.md](skills/tailwind-4/SKILL.md)           |
| `nextjs`               | App Router, Server Components               | ✅ Ready | [SKILL.md](skills/nextjs/SKILL.md)               |

| {Add/remove skills as needed}

---

## Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                              | Skill                  |
| ----------------------------------- | ---------------------- |
| Creating new skills                 | `skill-creator`        |
| Organizing project structure        | `structuring-projects` |
| Writing React 19 components         | `react-19`             |
| Creating Zod schemas                | `zod-4`                |
| Writing TypeScript types/interfaces | `typescript`           |
| Styling with Tailwind               | `tailwind-4`           |
| Writing Next.js code                | `nextjs`               |
| {Add project-specific triggers}     | `{project-skill}`      |

---

## Development Rules

### ALWAYS

#### Architecture

- **Follow Project Structure Patterns**: See `structuring-projects` skill and `reference/ddd-rules.md` (if using DDD)
  - Feature-based organization
  - {Add project-specific architecture rules}
- **Single Source of Truth**: Routes, types, and schemas defined once and imported everywhere

#### Data Flow

- **Server-First Data Loading**: Follow patterns in `nextjs` skill → [reference/data-fetching.md](skills/nextjs/reference/data-fetching.md)
  - Action → Service → Repository flow (if applicable)
  - Validate ALL inputs with Zod (see `zod-4` skill)
  - {Add project-specific data flow rules}

### NEVER

#### Scope Violations

- **Never add features without approval** {if product has defined scope}
- {Add project-specific scope violations}

#### Architecture Violations

- **Never mutate objects in App layer** - Always return new objects (if using service layer)
- {Add project-specific architecture violations}

#### Code Quality

- **Never hardcode routes** - Use centralized route definitions from `features/routes.ts`
- **Never return `null` for missing data in repos** - Throw appropriate errors
- {Add project-specific code quality rules}

### DEFAULTS

#### Development

- Environment: Next.js {version}+ with App Router
- Styling: {Default styling approach}
- State: Server Components first, client state when necessary
- Forms: React Hook Form + Zod validation
- Database: {Database name} with {ORM/access pattern}

---

## Project-Specific Rules

\u003c!-- Add any unique flows, constraints, or patterns specific to this project --\u003e

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

\u003e {Add project tagline or quote if applicable}

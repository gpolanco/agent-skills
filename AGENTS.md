# Repository Guidelines

## Project Overview

**skills-as-context** is a personal collection of AI Agent Skills.

**Purpose**: Provide production-ready skills that teach AI assistants best practices, architectural patterns, and coding conventions.

**Structure:**

```
skills-as-context/
├── skills/                  # Individual skills
│   ├── skill-creator/       # Meta skill for creating skills
│   ├── skill-integrator/    # Meta skill for project setup
│   ├── structuring-projects/# Project structure patterns
│   ├── react-19/            # React 19 + Compiler
│   ├── nextjs/              # Next.js App Router
│   ├── forms/               # React Hook Form + Zod
│   ├── supabase/            # Supabase patterns
│   ├── testing-vitest/      # Vitest testing
│   └── ...
├── agents/                  # Agent templates
│   ├── planner.template.md  # Planning agent
│   └── reviewer.template.md # Review agent
├── templates/               # Project templates
│   ├── AGENTS.template.md   # AGENTS.md for consumer projects
│   ├── init-agent.sh        # Bootstrap script
│   └── plans/               # Plan templates
└── docs/
    └── agent/               # Persistent agent memory
```

**Tech Stack:**

- Markdown (skills documentation)
- Shell/Bash (bootstrap scripts)
- Standard: V5 Hybrid Model

---

## Available Skills

### Meta Skills

| Skill              | Description                              | URL                                          |
| ------------------ | ---------------------------------------- | -------------------------------------------- |
| `skill-creator`    | Create/modify AI agent skills            | [SKILL.md](skills/skill-creator/SKILL.md)    |
| `skill-integrator` | Analyze stack and auto-load skills       | [SKILL.md](skills/skill-integrator/SKILL.md) |

### Generic Skills

| Skill                    | Description                                 | Status   | URL                                                |
| ------------------------ | ------------------------------------------- | -------- | -------------------------------------------------- |
| `structuring-projects`   | Project structure (features, DDD, monorepo) | ✅ Ready | [SKILL.md](skills/structuring-projects/SKILL.md)   |
| `react-19`               | React 19 + React Compiler patterns          | ✅ Ready | [SKILL.md](skills/react-19/SKILL.md)               |
| `zod-4`                  | Zod v4 runtime validation patterns          | ✅ Ready | [SKILL.md](skills/zod-4/SKILL.md)                  |
| `typescript`             | Strict types, const patterns                | ✅ Ready | [SKILL.md](skills/typescript/SKILL.md)             |
| `tailwind-4`             | cn() utility, Tailwind 4 API                | ✅ Ready | [SKILL.md](skills/tailwind-4/SKILL.md)             |
| `nextjs`                 | App Router, Server Components               | ✅ Ready | [SKILL.md](skills/nextjs/SKILL.md)                 |
| `forms`                  | React Hook Form + Zod type-safe forms       | ✅ Ready | [SKILL.md](skills/forms/SKILL.md)                  |
| `supabase`               | RLS, Auth, Database patterns                | ✅ Ready | [SKILL.md](skills/supabase/SKILL.md)               |
| `testing-vitest`         | Unit and integration testing                | ✅ Ready | [SKILL.md](skills/testing-vitest/SKILL.md)         |
| `route-handlers`         | API route patterns                          | ✅ Ready | [SKILL.md](skills/route-handlers/SKILL.md)         |
| `nextjs-route-handlers`  | Next.js API route handlers                  | ✅ Ready | [SKILL.md](skills/nextjs-route-handlers/SKILL.md)  |

---

## Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                                      | Skill                   |
| ------------------------------------------- | ----------------------- |
| Setting up a new project                    | `skill-integrator`      |
| Configuring project skills                  | `skill-integrator`      |
| Creating new skills                         | `skill-creator`         |
| Modifying existing skills                   | `skill-creator`         |
| Reviewing skill quality                     | `skill-creator`         |
| Organizing project structure                | `structuring-projects`  |
| Adding DDD architecture to a project        | `structuring-projects`  |
| Setting up feature-based architecture       | `structuring-projects`  |
| Writing React 19 components                 | `react-19`              |
| Creating Zod schemas                        | `zod-4`                 |
| Writing TypeScript types/interfaces         | `typescript`            |
| Styling with Tailwind                       | `tailwind-4`            |
| Writing Next.js code                        | `nextjs`                |
| Creating API route handlers                 | `route-handlers`        |
| Creating Next.js API routes                 | `nextjs-route-handlers` |
| Creating forms                              | `forms`                 |
| Working with Supabase                       | `supabase`              |
| Writing tests                               | `testing-vitest`        |

---

## Development Rules (Skill Creation)

### ALWAYS

- **Load skill-creator** before creating/editing skills
- **Follow design guidelines** strictly ([reference](skills/skill-creator/reference/skill-designer-core.md))
- **Keep SKILL.md under 500 lines** - use Progressive Disclosure (move details to `reference/`)
- **Include ALWAYS/NEVER patterns** in every skill
- **Use kebab-case** for skill names
- **Add explicit triggers** in skill descriptions (`Trigger: when...`)
- **Semantic versioning** (X.Y.Z format)
- **Local references only** - no external URLs in `reference/` folder
- **Test skills** with AI assistants before committing
- **Update catalog** ([skills/README.md](skills/README.md)) when adding skills

### NEVER

- **Skip reusability check** - skills must be used ≥3 times
- **Create skills without triggers** - description must include "Trigger:"
- **Duplicate documentation** - reference existing docs instead
- **Use external URLs in reference/** - copy content locally
- **Mix implementation with structure** - structure skills show WHERE, not HOW
- **Create monolithic skills** - one skill = one responsibility
- **Use auto_invoke: true** - use `false` or descriptive string
- **Skip frontmatter fields** - all metadata fields are required

---

## Code Quality Rules (CRITICAL)

### ⚠️ ALWAYS (Non-Negotiable)

- **Verify types IMMEDIATELY** after writing code - run `tsc --noEmit` or check IDE errors
- **Fix ALL errors BEFORE continuing** - Never leave red squiggles or linter errors
- **Read linter output** after each file edit - Address every warning/error
- **Test compilation** - Ensure code compiles successfully before moving to next task
- **Validate imports** - Ensure all imports resolve correctly
- **Check for undefined/null** - Use TypeScript strict mode checks

### 🚫 NEVER (Zero Tolerance)

- **NEVER continue with next task if current code has errors**
- **NEVER leave TypeScript errors unresolved** ("I'll fix it later" = NOT ALLOWED)
- **NEVER assume code works** - Always verify
- **NEVER skip type annotations** on function parameters and returns
- **NEVER use `any`** unless explicitly approved by user
- **NEVER commit broken code** - Each edit must compile successfully

### DEFAULTS

- Skills location: `skills/` at project root
- Progressive Disclosure: `SKILL.md` + `reference/` + `assets/`
- License: Apache 2.0
- `auto_invoke`: `false` for writing skills, descriptive string for read-only/knowledge skills
- `allowed-tools`: `Read` for Knowledge skills, `Read, Write, Bash` for Tool/Hybrid
- Skill types: Knowledge (patterns), Tool (scripts), Hybrid (both)

---

## Skill Quality Checklist

Before committing any skill, verify:

- [ ] Frontmatter complete (name, description, license, metadata, allowed-tools)
- [ ] Trigger explicit in description
- [ ] Version format is semantic (X.Y.Z)
- [ ] SKILL.md is under 500 lines
- [ ] Heavy content moved to `reference/`
- [ ] Reusability validated (≥3 uses)
- [ ] Single responsibility confirmed
- [ ] ALWAYS/NEVER patterns included
- [ ] Code examples use ✅/❌ format
- [ ] Local references only (no external URLs)
- [ ] Tested with AI assistant

See [skill-creator](skills/skill-creator/SKILL.md) for full guidelines.

---

## Common Commands

```bash
# View a skill
cat skills/skill-creator/SKILL.md

# Create new skill directory
mkdir -p skills/{skill-name}/{reference,assets}

# Update skills catalog
vi skills/README.md
```

---

## Agents

Sub-agents that handle specific roles. They **think and evaluate** — they do not execute.

### Available Agents

| Agent        | Role                                              | Output                          |
| ------------ | ------------------------------------------------- | ------------------------------- |
| `planner`    | Produces minimal, executable plans for tasks      | `docs/agent/plans/<slug>.md`    |
| `reviewer`   | Evaluates diffs for scope, correctness, and risks | Inline (verdict + findings)     |

### Agent Memory (`docs/agent/`)

Persistent memory for plans, state, and decisions across sessions:

```
docs/agent/
├── plans/          → what will be done and why
├── state.md        → what is done / pending
└── decisions.md    → important agreements (append-only)
```

---

## Resources

- [Skills Catalog](skills/README.md) - All available skills
- [Skill Creator](skills/skill-creator/SKILL.md) - How to create skills
- [Skill Integrator](skills/skill-integrator/SKILL.md) - Project setup
- [Design Guidelines](skills/skill-creator/reference/skill-designer-core.md) - Quality standards
- [AGENTS Template](templates/AGENTS.template.md) - Template for consumer projects
- [Planner Agent](agents/planner.template.md) - Planning agent template
- [Reviewer Agent](agents/reviewer.template.md) - Review agent template

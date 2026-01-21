# Skill Integration Workflow Guide

This document provides step-by-step instructions for AI assistants on how to perform a deep integration of skills into any project.

## Phase 1: Contextual Analysis

Before suggesting anything, you must understand the project's soul.

1.  **Read `package.json`**: Identify frameworks (Next.js, Vite, Express), styling (Tailwind, CSS Modules), and utilities (Zod, React Hook Form).
2.  **Check `AGENTS.md`**: Does it already exist? If so, what skills are already active?
3.  **Inspect Directory Structure**: Is it a monorepo? Feature-based? Layered architecture?

## Phase 2: The Pitch

Present your findings in a structured way.

```markdown
I've analyzed your project and found:

- **Next.js 15+** with App Router.
- **Tailwind CSS 4.0**.
- **Supabase** for Auth and DB.

I recommend importing the following skills from @build-a-skills:

1. `nextjs`: To ensure we use Server Components correctly.
2. `tailwind-4`: To enforce the new v4 cn() patterns.
3. `supabase`: To follow RLS and SSR auth best practices.

Shall I import these now? (This will create folders in `skills/`)
```

## Phase 3: Orchestration (Technical Steps)

Since all skills are already present in the `skills/` directory, your job is to "activate" them in the project's orchestration files.

1.  **Selection**: Identify the subset of skills in `skills/` that match the project's tech stack.
2.  **Activation (AGENTS.md)**:
    - If `AGENTS.md` doesn't exist, create it from `templates/AGENTS.template.md`.
    - Fill in the `{PROJECT_NAME}` and `{PROJECT_PURPOSE}`.
    - Update the "Available Skills" table with the selected local skills.
    - Add corresponding entries to the "Auto-invoke Skills" table.
3.  **Catalog Update (skills/README.md)**:
    - Update the status of the selected skills to "✅ Active".
4.  **Verification**: Confirm that all paths in `AGENTS.md` correctly point to the local `skills/` subdirectory.

## Phase 4: Initialization (First Time Only)

If the project has NO agent context yet:

1.  Ensure the `skills/` and `templates/` folders were created by the setup script.
2.  Follow the **Orchestration** steps above to generate the first version of the project's context.

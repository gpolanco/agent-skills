# Agents

This directory contains **agent definitions** intended to be used or copied into consumer repositories.

Agents define **roles and behavior constraints**, not project logic.

---

## Available agents

### `planner`

**Purpose**: Planning-only agent.

- Produces structured plans for non-trivial tasks
- Writes plans to `docs/agent/plans/*` in consumer projects
- Does not execute or modify code

Used when:
- The task is ambiguous
- Multiple files or architectural decisions are involved

### `reviewer`

**Purpose**: Review-only agent.

- Evaluates diffs, plans, or summaries
- Detects scope creep, risks, and correctness issues
- Does not write or modify code

Used when:
- Reviewing a change before merge
- Validating that implementation matches intent

---

## Structure

Each agent follows this structure:

```
<agent-name>/
├── AGENT.md           # Role, constraints, when to use
└── templates/         # Output templates (if any)
    └── *.template.md
```

---

## Design rules

- Agent definitions are **copied once** into consumer repos
- After copying, they become **project-owned**
- Definitions should remain **generic and reusable**
- No agent should execute code unless explicitly designed for it

---

## Relationship to skills

- **Skills** provide reusable technical knowledge
- **Agents** provide execution roles and constraints

Agents may reference skills, but skills must not depend on agents.

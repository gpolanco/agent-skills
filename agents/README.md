# Agent Templates

This directory contains **agent templates** intended to be copied into consumer repositories by the `skill-integrator`.

These agents define **roles and behavior constraints**, not project logic.

---

## Available agents

### `planner`

**Purpose**: Planning-only agent.

* Produces structured plans for non-trivial tasks
* Writes plans to `docs/agent/plans/*`
* Does not execute or modify code

Used when:

* The task is ambiguous
* Multiple files or architectural decisions are involved

---

### `reviewer`

**Purpose**: Review-only agent.

* Evaluates diffs, plans, or summaries
* Detects scope creep, risks, and correctness issues
* Does not write or modify code

Used when:

* Reviewing a change before merge
* Validating that implementation matches intent

---

## Design rules (important)

* Agent templates are **copied once** into consumer repos
* After copying, they become **project-owned**
* Templates should remain **generic and reusable**
* No agent should execute code unless explicitly designed for it

---

## Relationship to skills

* **Skills** provide reusable technical knowledge
* **Agents** provide execution roles and constraints

Agents may reference skills, but skills must not depend on agents.

---

## Non-goals

* Runtime agent coordination
* Persistent memory management
* Cross-agent communication

These concerns are handled at the project level, not here.

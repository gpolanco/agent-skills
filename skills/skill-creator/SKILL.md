---
name: skill-creator
description: >
  Create high-quality AI Skills (knowledge, tool, or hybrid) using the local standards and templates.
  Trigger: Use when the user asks to create a new skill, package a repeated pattern (≥ 3 uses), standardize a workflow, or generate a reusable rule set.
license: Apache-2.0
metadata:
  type: hybrid
  author: devcontext
  version: "2.1.0"
  scope: [root]
  auto_invoke: false  # Meta-skill: Manual invocation preferred with @skill-creator
allowed-tools: [Read, Write, Bash]
---

# Skill Creator 🧱

## TL;DR (REQUIRED)

* **Before creating any skill**, you MUST read: `reference/skill-designer-core.md`.
* Use the canonical template: `assets/SKILL-TEMPLATE.md`.
* Apply the **Quality Gate** checklist from the designer core before finishing.
* Keep scope tight: **one skill = one job**.
* Produce only skill artifacts (no app/product code): `SKILL.md`, `reference/`, `assets/`, `scripts/`.

---

## 🚨 Mandatory reading (Non-negotiable)

You MUST read these files in this order before generating anything:

1. `reference/skill-designer-core.md`
2. `assets/SKILL-TEMPLATE.md`

If you haven’t read them, stop and say:

```
Skill creation blocked: designer core and template not loaded.
```

---

## When to use

Use this skill to transform a request into a structured skill folder when:

* A pattern repeats **≥ 3 times**.
* The project needs explicit guardrails for AI behavior.
* The request is deterministic enough to package (knowledge and/or automation).

Do NOT use when:

* It’s a one-off task (make a snippet instead).
* The documentation already exists (reference it).
* The scope is too broad (split first).

---

## Outputs (what you are allowed to change)

### ✅ Allowed

* Create a new skill folder under the local skills directory, e.g.:

  * `.agent/skills/<skill-name>/...` (preferred in consumer repos)
  * `skills/<skill-name>/...` (when the repo uses `skills/`)

### ❌ Not allowed

* Modifying product/app source code while “creating a skill”.
* Modifying other skills unless explicitly requested.
* Adding external URLs inside `reference/` files.

---

## Critical patterns

### ALWAYS

* **Reusability filter**: confirm it will be used ≥ 3 times. If not, reject.
* **Single responsibility**: one skill = one job. Split monoliths.
* **Progressive disclosure**: keep `SKILL.md` < 500 lines; move deep content to `reference/`.
* **Explicit trigger**: description MUST include an actionable Trigger.
* **Minimum permissions**: request only the tools needed for the skill type.
* **Cross-references**: point to existing skills instead of duplicating their scope.

### NEVER

* Define component structure (belongs to `react-19`).
* Define file/folder placement decisions (belongs to `structuring-projects`).
* Define styling patterns (belongs to `tailwind-4`).
* Duplicate content between `SKILL.md` and `reference/`.
* Use external URLs in `reference/` (copy locally).

---

## Decision tree (skill type)

```
Does it only teach rules/patterns? → Knowledge skill (allowed-tools: Read)
Does it automate a deterministic task? → Tool skill (allowed-tools: Read, Write, Bash)
Does it teach rules AND automate? → Hybrid skill (allowed-tools: Read, Write, Bash)
```

---

## Workflow (Factory Process)

### Phase 1 — Validate

* Clarify what problem it solves.
* Confirm ≥ 3 uses.
* Ensure single responsibility.

### Phase 2 — Scaffold

Create:

* `<skill-name>/SKILL.md`
* `<skill-name>/reference/`
* `<skill-name>/assets/`
* `<skill-name>/scripts/` (tool/hybrid only)

### Phase 3 — Draft

* Populate `SKILL.md` from `assets/SKILL-TEMPLATE.md`.
* Keep the body as an orchestrator: When to Use → Critical Patterns → Decision Tree → Actions (if tool/hybrid) → Resources.

### Phase 4 — Quality Gate (MANDATORY)

Run the checklist from `reference/skill-designer-core.md`:

* Typology validation
* Frontmatter validation
* Content rules
* Progressive disclosure
* Cross-skill boundaries

If any item fails, fix it before completion.

### Phase 5 — Activation hint

When finished, recommend using `skill-integrator` to activate the new skill in `AGENTS.md`.

---

## Resources

* **Design Standards**: `reference/skill-designer-core.md`
* **Master Template**: `assets/SKILL-TEMPLATE.md`

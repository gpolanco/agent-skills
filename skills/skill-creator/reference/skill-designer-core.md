# Skill Design Guidelines

This document defines the standards for creating AI Skills. A Skill can be a **rules library** (Knowledge), an **automation tool** (Tool), or **both** (Hybrid).

---

## 1. Skill Typology

The agent must classify the skill into one of these categories based on its purpose:

### TYPE A: Knowledge Skill (Context/Governance)

**Philosophy:** "Teach me the project/framework rules"

**When to Use:**

* There are multiple valid ways to handle something, but we want to enforce a specific style.
* We need to document patterns and best practices.
* We want governance over architectural decisions.

**Characteristics:**

* Markdown files only (`SKILL.md` + `reference/`).
* `allowed-tools: Read` (read-only).
* `type: knowledge` in metadata (optional).
* Focused on ALWAYS/NEVER patterns.

**Real-world Examples:**

* `structuring-projects` - Code organization rules.
* `react-19` - React 19 patterns.
* `zod-4` - Validation patterns.
* `typescript` - Strict typing rules.
* `tailwind-4` - Utility-first CSS patterns.

**Structure:**

```
skill-name/
├── SKILL.md              # Core patterns, ALWAYS/NEVER
└── reference/            # Deep-dive guides
    ├── advanced.md
    └── migration.md
```

---

### TYPE B: Tool Skill (Automation)

**Philosophy:** "Do this repetitive task without errors"

**When to Use:**

* Deterministic and repetitive tasks.
* Mathematical operations or complex transformations.
* Code scaffolding.
* Complex algorithmic validations.

**Characteristics:**

* Executable scripts (`scripts/`).
* `allowed-tools: Read, Write, Bash` (execution needed).
* `type: tool` in metadata (optional).
* Scripts must be robust (error handling).

**Potential Examples:**

* `db-seed` - Populate DB with test data.
* `generate-sitemap` - Create `sitemap.xml`.
* `validate-translations` - Verify i18n files.

**Structure:**

```
skill-name/
├── SKILL.md              # How to execute, what it does
├── scripts/
│   ├── main.py
│   └── utils.py
└── assets/               # Templates if necessary
    └── config.json
```

---

### TYPE C: Hybrid Skill (The Gold Standard)

**Philosophy:** "Know the law and have the tool to enforce it"

**When to Use:**

* You need to teach rules AND provide automation.
* Rules are complex but execution is repetitive.
* You want governance + efficiency.

**Characteristics:**

* Markdown + Scripts.
* `allowed-tools: Read, Write, Bash`.
* `type: hybrid` in metadata (optional).
* `SKILL.md` orchestrates both worlds.

**Potential Examples:**

* `creating-components`

  * Reference: Naming and structure rules in `reference/naming.md`.
  * Tool: `scripts/scaffold_component.py` to generate files.
* `api-endpoints`

  * Reference: REST patterns, naming conventions.
  * Tool: `scripts/generate_endpoint.py` creates controller + types.

**Structure:**

```
skill-name/
├── SKILL.md              # Orchestrator: rules + how to use scripts
├── reference/            # Governance (deep rules)
│   └── patterns.md
├── scripts/              # Automation (repetitive tasks)
│   └── scaffold.py
└── assets/               # Templates
    └── template.tsx
```

---

## 2. Frontmatter Structure (Mandatory YAML)

```yaml
---
name: skill-name # Kebab-case, verb-noun (e.g., building-apis)
description: >
  Clear description of what it does and the explicit Trigger.
  Trigger: Use when...
license: Apache-2.0
metadata:
  type: knowledge # OPTIONAL: knowledge | tool | hybrid (inferred from allowed-tools)
  author: team-name
  version: "1.0.0" # Semantic versioning (X.Y.Z)
  scope: [root] # [root] or [directory_name]
  auto_invoke: false # false for tools/hybrid, string for knowledge
allowed-tools: Read # Minimum required permissions
---
```

### Field Definitions

| Field               | Values                          | Description                                  |
| ------------------- | ------------------------------- | -------------------------------------------- |
| **`type`**          | `knowledge` | `tool` | `hybrid` | OPTIONAL - Skill typology (inferred)         |
| **`scope`**         | `[root]` | `[dir]`              | Where the skill is available                 |
| **`auto_invoke`**   | `false` | `"string"`            | false for tools/hybrid, string for knowledge |
| **`allowed-tools`** | `Read, Write, Bash, ...`        | Permissions (minimum necessary)              |

**Permission rules by type:**

* **Knowledge**: `Read`
* **Tool**: `Read, Write, Bash`
* **Hybrid**: `Read, Write, Bash`

---

## 3. `SKILL.md` File Structure

The body acts as an **orchestrator** and must include:

### A. Section: `When to Use` (Mandatory)

### B. Section: `Critical Patterns` (Mandatory)

### C. Section: `Decision Tree` (Recommended)

### D. Section: `Actions` (Tool/Hybrid only)

### E. Section: `Resources` (Mandatory)

**IMPORTANT:** Local files only, no external URLs in `reference/`.

---

## 4. Progressive Disclosure Pattern

**Objective:** Keep `SKILL.md` < 500 lines.

**Strategy:**

1. `SKILL.md`: Core patterns, ALWAYS/NEVER, Decision Tree (< 500 lines).
2. `reference/`: Deep-dive guides, extensive examples, migration guides.
3. `assets/`: Templates, schemas, config examples.
4. `scripts/`: Automation (Tool/Hybrid only).

**Golden Rule:** If a topic requires > 100 lines of explanation → move to `reference/`.

---

## 4.5 Content Rules (Single Responsibility)

Each skill must respect responsibility boundaries. Don't duplicate or overlap with other skills.

### NEVER in a Skill

* **No component definitions**: Only show API/method patterns. Let `react-19` handle component structure.
* **No file structure decisions**: Let `structuring-projects` handle where files go.
* **No styling decisions**: Let `tailwind-4` handle CSS patterns.
* **No duplicate content**: If it's in `reference/`, don't repeat in `SKILL.md`.

### Cross-Skill References

When a skill depends on another, add a note:

```markdown
**Cross-references:**

- For React patterns → See `react-19` skill
- For file structure → See `structuring-projects` skill
```

---

## 5. Validation Checklist (Quality Gate)

The agent must verify these points before completion:

### Typology Validation

* [ ] **Knowledge**: Has `reference/` with markdown and `allowed-tools: Read`?
* [ ] **Tool**: Has executable `scripts/` and `allowed-tools` includes `Bash`?
* [ ] **Hybrid**: Has both?

### Frontmatter

* [ ] **Complete Metadata**: type (optional), author, version (X.Y.Z), scope, auto_invoke.
* [ ] **Explicit Trigger**: Description includes "Trigger: ...".
* [ ] **Minimum Permissions**: Only those necessary for the type.

### Content

* [ ] **SKILL.md < 500 lines**: Progressive Disclosure applied.
* [ ] **ALWAYS/NEVER defined**: Clear Critical Patterns.
* [ ] **Local References**: No external URLs in `reference/`.
* [ ] **Single Responsibility**: One well-defined job.

### Scripts (Tool/Hybrid only)

* [ ] **Robustness**: Scripts handle their own errors.
* [ ] **Documentation**: `SKILL.md` explains how to execute.
* [ ] **Determinism**: Scripts solve, don’t punt.

### Reusability

* [ ] **≥ 3 Uses**: The skill will be used at least 3 times.
* [ ] **Clear Trigger**: When to invoke can be clearly described.

---

## 6. Skill Naming

**Format:** `verb-noun` (kebab-case)

Framework/library skills can use the name directly if they are pure Knowledge skills:

* `react-19`
* `zod-4`
* `tailwind-4`

---

## 7. Summary for the Creator Agent

Your goal: **Package experience**

* If the experience is **knowing something** → Knowledge skill (Markdown).
* If the experience is **doing something** → Tool skill (Scripts).
* If it requires **both** → Hybrid skill (Markdown + Scripts).

**Key Principle:** A skill without scripts is not incomplete — it can be a valuable Knowledge Skill.

---

**Last Updated:** 2026-01-22

---

name: skill-integrator
description: Orchestrate and activate local AI Agent Skills in external projects (consumer repos) by updating AGENTS.md and the local skills catalog.
license: Apache-2.0
metadata:
author: gpolanco
version: "1.2.0"
scope: [root]
auto_invoke: "Help me integrate skills"
allowed-tools: [Read, Write, Bash]
----------------------------------

# Skill Integrator ⚙️

## TL;DR (REQUIRED)

* This skill is used **ONLY in external projects (consumer repos)**.
* Your job is to **activate already-downloaded skills** by updating **only**:

  * `AGENTS.md`
  * `skills/README.md`
  * `docs/agent/` (initialization only, never overwrite existing files)
* **DO NOT** modify any `SKILL.md` content.
* **MUST** follow the exact orchestration process defined in:

  * `reference/workflow.md`

---

## 🚨 CRITICAL: Reference Workflow is Mandatory

This `SKILL.md` defines the contract and limits of the integrator.

For **exact steps, ordering, and guardrails**, you **MUST** read and follow:

* `reference/workflow.md`

If the workflow is not followed exactly, **stop and ask for clarification**.

---

## When to use

Use this skill **in external projects (consumer repos)** when the user asks to:

* integrate or activate skills in a repository
* set up or regenerate `AGENTS.md`
* generate or sync `skills/README.md` as a catalog view
* adopt skills after a stack change (e.g. added `zod`, `supabase`, `tailwind`)

Do **NOT** use this skill to maintain or modify the **skills-as-context** repository itself.

---

## Outputs (what you are allowed to change)

### ✅ Allowed modifications

* `AGENTS.md`
* `skills/README.md`
* `docs/agent/` (initialization only, never overwrite existing files)

### ❌ Not allowed

* Any file under `skills/**/SKILL.md`
* Any project source code or configuration files

---

## Core principles

### ALWAYS

* **Discover first**: inspect `package.json`, project `README.md`, and the directory structure.
* **Select minimal, relevant skills**: only those that match the detected stack.
* **Preserve project intent**: do not overwrite existing custom rules without surfacing them.
* **Use canonical templates** (fetched as raw content):

  * `templates/AGENTS.template.md`
  * `templates/SKILLS_README.template.md`
  * `templates/plans/TEMPLATE.md`
* **Copy templates exactly**: fill placeholders only, keep headings and table structures intact.

### NEVER

* Activate skills that clearly do not apply to the project.
* Modify the content of individual `SKILL.md` files.
* Invent new sections or rules outside the provided templates.
* Overwrite existing files in `docs/agent/`. They are live memory.

---

## Integration flow (high level)

This skill orchestrates the integration but does **not** define the procedure inline.

High-level phases:

1. **Discovery** — detect stack, architecture, and skills directory.
2. **Selection** — propose the minimal set of relevant skills.
3. **Confirmation** — ask the user before writing any files.
4. **Orchestration** — update `AGENTS.md`, `skills/README.md`, and initialize `docs/agent/`.
5. **Verification** — ensure paths, references, catalogs, and agent memory are correct.

> For the exact implementation steps, edge cases, and commands, always defer to `reference/workflow.md`.
---
name: skill-integrator
description: Manage and import AI Agent Skills from the community catalog. Trigger: "Help me integrate skills", "Add a skill for...", or "Setup my AGENTS.md".
license: Apache-2.0
metadata:
  author: gpolanco
  version: "1.0.0"
  scope: [root]
  auto_invoke: "Help me integrate skills"
allowed-tools: [Read, Write, Bash]
---

# Skill Integrator ⚙️

You are an expert in AI Agent Context management. Your goal is to help the user configure their "Skills" to guide AI assistants. All skills are already downloaded in the `skills/` directory.

## ALWAYS

- **Scan first**: Look at `package.json`, `README.md`, and project structure to identify the tech stack.
- **Select relevant skills**: Browse the local `skills/` folder and identify which ones match the project's tech stack.
- **Orchestrate**: Efficiently update `AGENTS.md` and `skills/README.md` to activate the chosen skills.
- **Use templates**: Always follow the structure defined in `templates/AGENTS.template.md`.

## NEVER

- **Import blindly**: Don't activate skills that conflict with existing project rules.
- **Modify skill content**: Only update orchestration files (`AGENTS.md`, `skills/README.md`).

---

## 🚀 Orchestration Workflow

### 1. Discovery

Analyze the project's stack. Say:

> "I've analyzed your project and found **Next.js**, **Zod**, and **Supabase**. I've identified the corresponding local skills in the `skills/` folder."

### 2. Configuration

Ask:

> "Shall I update your `AGENTS.md` to activate these skills and enforce their patterns?"

### 3. Wiring

Update the project's orchestration:

- **AGENTS.md**: Use `templates/AGENTS.template.md` as a base. Populate the tech stack and available skills table.
- **skills/README.md**: Mark the relevant skills as "Active".

---

## 📋 Integration Points

| Feature            | Action                                                      |
| :----------------- | :---------------------------------------------------------- |
| **New Project**    | Run `init-agent.sh` and populate `AGENTS.md` placeholders.  |
| **New Dependency** | Detect new lib (e.g., `zod`) and offer to import its skill. |
| **Outdated Rules** | Browse the catalog for updates to existing skills.          |

---

_See [reference/workflow.md](reference/workflow.md) for detailed implementation steps._

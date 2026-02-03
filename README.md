<div align="center">

# Agent Skills

**Personal Collection of AI Agent Skills & CLI Tool**

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Standard](https://img.shields.io/badge/standard-Agent_Skills-purple.svg)](https://agent-skills.sh)
[![Status](https://img.shields.io/badge/status-active-success.svg)](#)

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-catalog">Catalog</a> •
  <a href="#-agents">Agents</a>
</p>

</div>

---

### About this repository

This is a **personal and opinionated collection of AI agent skills**, tailored to my own projects, workflows, and technical preferences.

- Skills may depend on conventions or utilities specific to my stack
- Not intended as a generic or stable public catalog
- Breaking changes may occur without notice

---

## Why Agent Skills?

This repository houses the **coding standards, architectural patterns, and best practices** adapted specifically for **my projects**. It serves as persistent memory for my AI assistants (Claude, Cursor, Copilot), ensuring they always work the way I do.

| **My Patterns** | **My Workflow** | **My Standards** |
| :--- | :--- | :--- |
| **No more quirks.** Agents use my exact preferred structure for Next.js and React. | **Zero friction.** I instantiate my standard features with single triggers. | **Consistency.** Every project adheres to my defined folder structures and naming conventions. |

---

## How It Works

```mermaid
sequenceDiagram
    participant U as Developer
    participant A as AI Agent
    participant S as Skills Repo

    U->>A: "Create a new Next.js feature"
    A->>S: Read content/skills/nextjs/SKILL.md
    S-->>A: Load Patterns (App Router, Server Actions)
    A->>A: Apply Context
    A-->>U: Generates production-ready code
```

---

## Quick Start

Transform your project in **30 seconds** using the official CLI:

```bash
npx @agent-skills-sh/cli init
```

*Or use the legacy bootstrap script:*
```bash
curl -sSL https://agent-skills.sh/init.sh | bash
```

**That's it.** You now have a `content/skills/` folder populated with the standard catalog.

### Next Steps

1.  **Ask your AI**: `"Use @skill-integrator to configure this project."`
2.  **Verify**: Check that `AGENTS.md` has been created.
3.  **Code**: Start building with superpowers!

> "Create a form using @forms"
> "Refactor this component using @react-19"
> "Add a database table using @supabase"

---

## Repository Structure

```
agent-skills-sh/
│
├── content/                      # Consumable content
│   ├── skills/                   # AI agent skills
│   └── agents/                   # Agent definitions
│
├── bootstrap/                    # Setup for consumer projects
│   ├── init.sh                   # Installation script
│   ├── templates/                # Project templates
│   └── editors/                  # Editor-specific configs
│
├── scripts/                      # Internal repo tools
│
├── .claude/                      # Claude Code config
├── .cursor/                      # Cursor config (placeholder)
├── .github/                      # GitHub + Copilot config
│
└── docs/                         # Project documentation
```

---

## Catalog

### Meta-Skills (The Brains)

| Skill | Description | Trigger |
| :--- | :--- | :--- |
| [**skill-integrator**](content/skills/skill-integrator) | Context Awareness. Analyzes your tech stack and auto-loads relevant skills. | `"Setup project"` |
| [**skill-creator**](content/skills/skill-creator) | Factory. Detailed guide to building your own high-quality skills. | `"Create a skill"` |

### Generic Skills (The Knowledge)

| Category | Skill | Description |
| :--- | :--- | :--- |
| **Core** | [**structuring-projects**](content/skills/structuring-projects) | Domain-Driven Design (DDD) & Feature-First architecture patterns. |
| | [**typescript**](content/skills/typescript) | Strict type safety, proper interfaces, and modern TS features. |
| **Frontend** | [**react-19**](content/skills/react-19) | React Compiler, Actions, and Server Components. |
| | [**tailwind-4**](content/skills/tailwind-4) | Utility-first styling with the new Tailwind v4 engine. |
| | [**forms**](content/skills/forms) | Type-safe forms with React Hook Form + Zod. |
| **Backend** | [**nextjs**](content/skills/nextjs) | App Router, Server Actions, Middleware, and Caching. |
| | [**supabase**](content/skills/supabase) | Row Level Security (RLS), Auth, and Database patterns. |
| **Quality** | [**zod-4**](content/skills/zod-4) | Runtime validation schemas. |
| | [**testing-vitest**](content/skills/testing-vitest) | Unit and integration testing strategies. |

[**Browse Full Catalog**](content/skills/README.md)

---

## Agents

Sub-agents that handle specific roles. They **think and evaluate** — they do not execute. The main agent reads their output and acts.

### Available Agents

| Agent | Role | Output |
| :--- | :--- | :--- |
| [**planner**](content/agents/planner/AGENT.md) | Produces minimal, executable plans for non-trivial tasks. | `docs/agent/plans/<slug>.md` |
| [**reviewer**](content/agents/reviewer/AGENT.md) | Evaluates diffs and changes for scope, correctness, and risks. | Inline (verdict + findings) |

### When to use agents

| Scenario | Use agent? |
| :--- | :--- | :--- |
| Task is ambiguous or spans multiple files | Planner |
| Architectural decision or trade-off involved | Planner |
| Risk of scope creep | Planner |
| Reviewing a change before merge | Reviewer |
| Validating implementation matches intent | Reviewer |
| Small, well-defined change | Direct prompt |
| Sequential steps where each depends on the previous | Single session |

[**Browse Agents**](content/agents/README.md)

---

## Multi-Editor Support

This repository is structured to support multiple AI-powered editors:

| Editor | Config Location | Status |
| :--- | :--- | :--- |
| Claude Code | `.claude/` | Active |
| Cursor | `.cursor/` | Placeholder |
| GitHub Copilot | `.github/copilot-instructions.md` | Placeholder |

---

<div align="center">
  <p>Standardized by <a href="https://agent-skills.sh">Agent-Skills.sh</a></p>
  <p><i>Empowering developers to build better, faster, and smarter.</i></p>
</div>

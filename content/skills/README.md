# Agent Skills Catalog

This directory contains AI Agent Skills for teaching patterns and best practices to AI assistants.

---

## 📦 Available Skills

### 🛠️ Meta Skills

Tools for creating and managing skills:

| Skill                                | Type      | Description                     | Trigger          | Status |
| ------------------------------------ | --------- | ------------------------------- | ---------------- | ------ |
| [skill-integrator](skill-integrator) | ⚙️ Hybrid | Manage and import skills        | "Add a skill"    | ✅     |
| [skill-creator](skill-creator)       | ⚙️ Hybrid | Create new skills (V5 standard) | "Create a skill" | ✅     |

### 🌐 Generic Skills

Reusable patterns for modern development (language-agnostic):

| Skill                                        | Type         | Description                                      | Trigger                        | Status |
| -------------------------------------------- | ------------ | ------------------------------------------------ | ------------------------------ | ------ |
| [structuring-projects](structuring-projects) | 📚 Knowledge | Universal structure patterns (Node.js, Next.js, Python, PHP) | "Organizing project structure" | ✅     |
| [react-19](react-19)                         | 📚 Knowledge | React 19 + React Compiler                        | "Writing React components"     | ✅     |
| [nextjs](nextjs)                             | 📚 Knowledge | App Router, caching, middleware                  | "Writing Next.js code"         | ✅     |
| [typescript](typescript)                     | 📚 Knowledge | Strict types, const patterns                     | "Writing TypeScript"           | ✅     |
| [zod-4](zod-4)                               | 📚 Knowledge | Zod v4 validation (requires `zod@^4.0.0`)        | "Creating Zod schemas"         | ✅     |
| [tailwind-4](tailwind-4)                     | 📚 Knowledge | cn() utility, Tailwind 4                         | "Styling with Tailwind"        | ✅     |
| [supabase](supabase)                         | 📚 Knowledge | SSR auth, RLS, data access                       | "Working with Supabase"        | ✅     |
| [forms](forms)                               | 📚 Knowledge | React Hook Form + Zod patterns                   | "Creating forms"               | ✅     |
| [testing-vitest](testing-vitest)             | 📚 Knowledge | Vitest patterns, coverage, mocking               | "Writing tests"                | ✅     |

### 📝 Planned Skills

| Skill      | Description                  | Status |
| ---------- | ---------------------------- | ------ |
| playwright | Page Object Model, selectors | 📝     |
| zustand-5  | Persist, selectors, slices   | 📝     |

**Legend**:
- 📚 Knowledge = Rules/Patterns (Markdown only)
- 🔧 Tool = Automation (Scripts)
- ⚙️ Hybrid = Both
- Status: ✅ Ready | 🚧 In Progress | 📝 Planned

---

## 🚀 Quick Start

### 1. Auto-Discovery

AI assistants automatically discover skills if they're in these locations:

```
content/skills/         # ✅ Preferred (project root)
.agent/skills/          # Generic fallback
.claude/skills/         # Claude Code
.github/skills/         # GitHub Copilot
.gemini/skills/         # Antigravity/Gemini
```

### 2. Manual Loading

Load a specific skill during a session:

```
Read content/skills/structuring-projects/SKILL.md
```

### 3. Copy to Your Project

```bash
# Copy specific skill
cp -r content/skills/react-19 /path/to/your/project/content/skills/

# Copy multiple skills
cp -r content/skills/{react-19,typescript,zod-4} /path/to/your/project/content/skills/

# Copy entire catalog
cp -r content/skills /path/to/your/project/content/
```

---

## 📂 Skill Anatomy

Each skill follows this structure (Progressive Disclosure):

```
skill-name/
├── SKILL.md                 # Core patterns (<500 lines)
│   ├── Frontmatter          # Metadata (name, version, trigger)
│   ├── When to Use          # Clear use cases
│   ├── Critical Patterns    # ALWAYS/NEVER rules
│   └── Resources            # Links to reference/
│
├── reference/               # Deep-dive guides (loaded on-demand)
│   ├── advanced.md          # Complex patterns
│   ├── migration.md         # Version upgrades
│   └── examples.md          # Extended examples
│
└── assets/                  # Templates, schemas (optional)
    └── template.tsx
```

**Why Progressive Disclosure?**
- Keeps AI context small (~500 lines)
- Details loaded only when needed
- Faster skill loading
- Better token efficiency

---

## 🛠️ Creating New Skills

**TL;DR**: Use `@skill-creator` as your guide.

```bash
# 1. Read the meta-skill
cat content/skills/skill-creator/SKILL.md

# 2. Use the template
cp content/skills/skill-creator/assets/SKILL-TEMPLATE.md content/skills/new-skill/SKILL.md

# 3. Validate before committing
./scripts/validate-skills.sh
```

**For full details**: See [skill-creator](skill-creator/SKILL.md)

---

## 📚 Resources

### Official Standards

- [Agent Skills Standard](https://agentskills.io) - Open standard specification
- [Anthropic Guide](https://docs.anthropic.com/en/docs/build-with-claude/agent-skills) - Best practices

### This Project

- **Creating Skills**: [skill-creator/SKILL.md](skill-creator/SKILL.md)
- **Design Guidelines**: [skill-designer-core.md](skill-creator/references/skill-designer-core.md)
- **Integration**: [skill-integrator/SKILL.md](skill-integrator/SKILL.md)

---

## 📖 Version History

| Version | Date       | Changes                                      |
| ------- | ---------- | -------------------------------------------- |
| 2.0.0   | 2026-01-22 | structuring-projects v2 (universal patterns) |
| 1.1.0   | 2026-01-22 | zod-4 explicit version requirement           |
| 1.0.0   | 2026-01-19 | Initial catalog with V5 Hybrid Model         |

---

**[← Back to main README](../../README.md)**

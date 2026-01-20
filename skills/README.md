# Agent Skills Catalog

This directory contains AI Agent Skills following the [V5 Hybrid Model](skill-creator/references/skill-designer-core.md).

---

## 📦 Available Skills

### 🌐 Generic Skills

Reusable patterns for modern web development:

| Skill                                        | Type         | Description                       | Trigger                        | Status |
| -------------------------------------------- | ------------ | --------------------------------- | ------------------------------ | ------ |
| [structuring-projects](structuring-projects) | 📚 Knowledge | Project structure (features, DDD) | "Organizing project structure" | ✅     |
| [react-19](react-19)                         | 📚 Knowledge | React 19 + React Compiler         | "Writing React components"     | ✅     |
| [zod-4](zod-4)                               | 📚 Knowledge | Zod v4 validation patterns        | "Creating Zod schemas"         | ✅     |
| [typescript](typescript)                     | 📚 Knowledge | Strict types, const patterns      | "Writing TypeScript"           | ✅     |
| [tailwind-4](tailwind-4)                     | 📚 Knowledge | cn() utility, Tailwind 4          | "Styling with Tailwind"        | ✅     |
| [nextjs](nextjs)                             | 📚 Knowledge | App Router, caching, middleware   | "Writing Next.js code"         | ✅     |
| [supabase](supabase)                         | 📚 Knowledge | SSR auth, RLS, data access        | "Working with Supabase"        | ✅     |
| [forms](forms)                               | 📚 Knowledge | React Hook Form + Zod patterns    | "Creating forms"               | ✅     |
| playwright                                   | 📚 Knowledge | Page Object Model, selectors      | "Writing E2E tests"            | 📝     |
| zustand-5                                    | 📚 Knowledge | Persist, selectors, slices        | "Managing client state"        | 📝     |

**Legend**:

- 📚 Knowledge = Rules/Patterns (Markdown)
- 🔧 Tool = Automation (Scripts)
- ⚙️ Hybrid = Both
- Status: ✅ Ready | 🚧 In Progress | 📝 Planned

### 🛠️ Meta Skills

Tools for creating and managing skills:

| Skill                          | Type      | Description                     | Trigger          | Status |
| ------------------------------ | --------- | ------------------------------- | ---------------- | ------ |
| [skill-creator](skill-creator) | ⚙️ Hybrid | Create new skills (V5 standard) | "Create a skill" | ✅     |

---

## 🚀 How to Use Skills

### Auto-Discovery

AI assistants automatically discover skills in your project. Just ensure they're in the right location:

```
skills/                 # Preferred location at project root
.agent/skills/          # Generic fallback
.claude/skills/         # Claude Code
.github/skills/         # GitHub Copilot
.gemini/skills/         # Antigravity/Gemini
```

### Manual Loading

To explicitly load a skill during a session:

```
Read skills/react-19/SKILL.md
```

### Copy to Your Project

```bash
# Copy specific skill
cp -r skills/react-19 /path/to/your/project/skills/

# Copy multiple skills
cp -r skills/{react-19,typescript,structuring-projects} /path/to/your/project/skills/
```

---

## 📂 Skill Structure

Each skill follows this anatomy:

```
skill-name/
├── SKILL.md                 # Main instruction file (<500 lines)
├── reference/               # Detailed guides (Progressive Disclosure)
│   └── deep-dive.md
└── assets/                  # Templates and examples (optional)
    └── template.tsx
```

### Progressive Disclosure Pattern

- **SKILL.md**: Core patterns, ALWAYS/NEVER rules, quick reference.
- **reference/**: Deep technical details (loaded on-demand).
- **assets/**: Templates, schemas, examples.

This keeps AI context small while providing depth when needed.

---

## 🛠️ Creating New Skills

### Quick Start

1. Use `skill-creator` as your guide:

   ```bash
   cat skills/skill-creator/SKILL.md
   ```

2. Follow the checklist:
   - [ ] Create `skills/{skill-name}/`.
   - [ ] Add `SKILL.md` with frontmatter.
   - [ ] Keep under 500 lines.
   - [ ] Add ALWAYS/NEVER patterns.
   - [ ] Use Progressive Disclosure.
   - [ ] Test with AI assistant.

3. Follow [V5 Hybrid Model](skill-creator/references/skill-designer-core.md).

---

## 📋 Design Principles

### 1. Concise is Key

Only include what AI doesn't already know. Avoid common knowledge.

### 2. Progressive Disclosure

- Core in `SKILL.md` (<500 lines).
- Details in `reference/`.
- Load heavy content on-demand.

### 3. Critical Rules First

```markdown
### ALWAYS

- Use const types
- Validate inputs

### NEVER

- Use any type
- Skip error handling
```

### 4. Show Patterns, Not Tutorials

```typescript
// ✅ Good
const user: User = { name: "John" };

// ❌ Bad
const user: any = { name: "John" };
```

### 5. Structure > Implementation

Focus on "WHERE things go", not "HOW to code them".

---

## 🎯 V5 Hybrid Model Standard

All skills must follow the V5 standard:

### Quality Gates

- ✅ **Reusability**: Used ≥ 3 times.
- ✅ **Single Responsibility**: One job only.
- ✅ **Trigger**: Explicit in description.
- ✅ **Local References**: No external URLs in `reference/`.
- ✅ **Version Format**: Semantic (X.Y.Z).
- ✅ **Concise**: `SKILL.md` < 500 lines.

### Frontmatter Fields

| Field                | Required | Example                        |
| -------------------- | -------- | ------------------------------ |
| name                 | ✅       | `react-19`                     |
| description          | ✅       | "React patterns. Trigger: ..." |
| license              | ✅       | `Apache-2.0`                   |
| metadata.author      | ✅       | `gpolanco`                     |
| metadata.version     | ✅       | `"1.0.0"`                      |
| metadata.scope       | ✅       | `[root]`                       |
| metadata.auto_invoke | ✅       | `false` or `"phrase"`          |
| allowed-tools        | ✅       | `Read, Write`                  |

**[Full V5 Standard →](skill-creator/references/skill-designer-core.md)**

---

## 📚 Resources

### Official

- [Agent Skills Standard](https://agentskills.io) - Open standard.
- [Anthropic Guide](https://docs.anthropic.com/en/docs/build-with-claude/agent-skills) - Best practices.

### This Project

- [Skill Creator](skill-creator/SKILL.md) - Meta skill.
- [V5 Hybrid Model](skill-creator/references/skill-designer-core.md) - Engineering rules.

---

## 🤝 Contributing

Want to add a skill?

1. Follow the [skill-creator](skill-creator/SKILL.md) guide.
2. Ensure V5 compliance.
3. Test with AI assistant.
4. Submit PR.

---

**[← Back to main README](../README.md)**

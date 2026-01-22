# Build-a-Skills 🎯

**Standardized AI Agent Skills for modern full-stack development.**

This repository provides a collection of [AI Agent Skills](https://agentskills.io) that teach AI assistants (Claude, Cursor, Antigravity) how to follow your project's architectural patterns and coding standards.

---

## 🚀 Quick Start (Transform Your Project)

Initialize the entire skills catalog in your project with one command:

```bash
curl -sSL https://raw.githubusercontent.com/gpolanco/skills-as-context/main/templates/init-agent.sh | bash
```

**Next Step**: Ask your AI assistant (Claude, Cursor, Antigravity):

> "Use @skill-integrator to setup AGENTS.md for my project"

---

## 📦 What's Inside?

### ⚙️ Meta-Skills (The Orchestrators)

- [**skill-integrator**](skills/skill-integrator): Analyzes your tech stack and auto-imports relevant skills.
- [**skill-creator**](skills/skill-creator): Guides you in creating your own custom skills.

### 📚 Generic Skills (The Catalog)

| Skill                                                   | Description                                      | Status   |
| :------------------------------------------------------ | :----------------------------------------------- | :------- |
| [**structuring-projects**](skills/structuring-projects) | Universal patterns (Node.js, Next.js, Python, PHP) | ✅ Ready |
| [**react-19**](skills/react-19)                         | React 19 + Compiler patterns                     | ✅ Ready |
| [**nextjs**](skills/nextjs)                             | App Router & Server Components                   | ✅ Ready |
| [**typescript**](skills/typescript)                     | Strict types & best practices                    | ✅ Ready |
| [**zod-4**](skills/zod-4)                               | Validation patterns (requires zod@^4.0.0)        | ✅ Ready |
| [**tailwind-4**](skills/tailwind-4)                     | Utility-first CSS patterns                       | ✅ Ready |
| [**supabase**](skills/supabase)                         | Auth, RLS, and SSR best practices                | ✅ Ready |
| [**forms**](skills/forms)                               | React Hook Form + Zod patterns                   | ✅ Ready |
| [**testing-vitest**](skills/testing-vitest)             | Vitest testing patterns                          | ✅ Ready |

👉 **[View Full Catalog →](skills/README.md)**

---

## 🛠️ Why Use This?

1.  **Stop Re-typing Rules**: Don't waste time telling the AI to use kebab-case or Server Components in every chat.
2.  **Enforce Architecture**: Ensure the AI places files in the right folders (DDD, Features).
3.  **Bulk Initialized**: Get the entire community catalog locally in one script execution.
4.  **Remote Orchestrated**: AI uses remote templates from GitHub as the source of truth for all configurations, ensuring your `AGENTS.md` is always up-to-date.

---

## 🤝 Contributing

Have a skill for a library you love?

1. Open this repo with your AI.
2. Use `@skill-creator` to build a new skill following our design guidelines.
3. Submit a PR.

---

_Made with ❤️ by [gpolanco](https://github.com/gpolanco)_

---
"@agent-skills-sh/cli": patch
---

Fix CLI output format for skills and agents installation

- Use complete AGENTS.md template instead of basic version
- Add AI Handover Guide with copyable prompt after installation
- Install agents as direct .md files for Claude Code detection
- Update agent frontmatter format with `name:` field for Claude Code compatibility
- Update editor paths and add `supportsNativeSkills` flag
- Filter skill tables to show only installed skills
- Rename `antigravity` editor to `gemini`

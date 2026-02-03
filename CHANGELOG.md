# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-03

### Added
- **@agent-skills/cli**: New interactive CLI tool to manage AI agent skills.
  - `skills init`: Interactive wizard for project setup, tech stack detection, and editor configuration.
  - `skills list`: Catalog and local skill management.
  - `skills add`: Install individual skills from remote repository.
  - `skills remove`: Cleanly remove skills from project and configuration.
  - Multi-editor support: Claude Code, Cursor, Antigravity, and GitHub Copilot.
  - Smart detection: Automatic tech stack detection (Next.js, React, Tailwind, etc.).
  - Unit tests: Comprehensive test suite for all CLI services (91% coverage).
- `content/` directory as root for all consumable content (skills + agents).
- `scripts/` directory for internal repository tools.
- `bootstrap/` directory for consumer project setup (replaces `templates/`).
- Multi-editor support structure (`.claude/`, `.cursor/`, `.github/`).
- `validate-skills.sh` and `validate-agents.sh` scripts.
- Agent definitions with new structure (`AGENT.md` + `templates/`).

### Changed
- **Rebranding**: Project renamed from `skills-as-context` to `agent-skills`.
- Official domain: `agent-skills.sh`.
- Moved `skills/` to `content/skills/`
- Moved `agents/` to `content/agents/`
- Restructured agents from `*.template.md` to `<name>/AGENT.md` + `templates/`
- Moved `AGENTS.md` to `.claude/AGENTS.md`
- Renamed `templates/` to `bootstrap/`
- Updated all documentation paths.
- Migrated CLI to use `pnpm` as the primary package manager.

### Removed
- `docs/agent/` (agent memory belongs in consumer projects, not this repo).
- `route-handlers` skill (empty).
- `nextjs-route-handlers` skill (empty).

## [0.1.0] - 2026-01-27
- Initial release with basic repository structure and templates.

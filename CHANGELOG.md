# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `content/` directory as root for all consumable content (skills + agents)
- `scripts/` directory for internal repository tools
- `bootstrap/` directory for consumer project setup (replaces `templates/`)
- Multi-editor support structure (`.claude/`, `.cursor/`, `.github/`)
- `validate-skills.sh` and `validate-agents.sh` scripts
- Agent definitions with new structure (`AGENT.md` + `templates/`)

### Changed
- Moved `skills/` to `content/skills/`
- Moved `agents/` to `content/agents/`
- Restructured agents from `*.template.md` to `<name>/AGENT.md` + `templates/`
- Moved `AGENTS.md` to `.claude/AGENTS.md`
- Renamed `templates/` to `bootstrap/`
- Updated all documentation paths

### Removed
- `docs/agent/` (agent memory belongs in consumer projects, not this repo)
- `route-handlers` skill (empty)
- `nextjs-route-handlers` skill (empty)

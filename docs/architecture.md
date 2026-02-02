# Architecture

## Design Decisions

### Content Separation (`content/`)

All consumable content lives under `content/`:
- `content/skills/` - AI agent skills
- `content/agents/` - Agent definitions

This follows the convention used by MDN, GitHub Docs, and OpenAI Cookbook for content catalogs.

### Why not `src/`?

`src/` implies compilable source code. This repository is a content catalog, not a software project. Using `content/` makes the intent clear.

### Multi-Editor Support

Editor-specific configurations live in their conventional locations:
- `.claude/` - Claude Code
- `.cursor/` - Cursor AI
- `.github/copilot-instructions.md` - GitHub Copilot

### Bootstrap vs Templates

The `bootstrap/` directory contains everything needed to set up a consumer project:
- `init.sh` - Installation script
- `templates/` - Project file templates
- `editors/` - Editor-specific templates (future)

### Scripts vs Tools

`scripts/` contains internal repository tools (validation, generation). These are not exported to consumer projects.

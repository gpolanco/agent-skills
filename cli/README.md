# @agent-skills-sh/cli

Interactive CLI to manage AI agent skills in your project.

## Installation

```bash
# With npx (recommended)
npx @agent-skills-sh/cli init

# Global
npm install -g @agent-skills-sh/cli
skills init
```

## Commands

### `skills init`

Initialize skills in your project with an interactive wizard.

```bash
skills init                          # Interactive wizard
skills init --editor claude          # Specify editor
skills init --preset nextjs          # Use preset
skills init --yes                    # Non-interactive, use defaults
```

**Options:**
- `-e, --editor <editor>` - Editor: claude, cursor, copilot, antigravity
- `-p, --preset <preset>` - Preset: nextjs, react, node, full
- `-y, --yes` - Skip prompts, use default configuration

### `skills list`

List available and installed skills.

```bash
skills list           # Show full catalog
skills list --local   # Show only installed skills
```

### `skills add <skill>`

Add a skill to your project.

```bash
skills add forms      # Install forms skill
skills add zod-4      # Install Zod 4 skill
```

### `skills remove <skill>`

Remove a skill from your project.

```bash
skills remove forms   # Remove forms skill
```

## Configuration

After `skills init`, a `.skillsrc.json` file is created:

```json
{
  "version": "1.0.0",
  "editor": "claude",
  "skills": {
    "directory": ".claude/skills",
    "active": ["react-19", "nextjs", "typescript"]
  },
  "agents": {
    "directory": ".claude/agents",
    "active": ["planner", "reviewer"]
  },
  "source": {
    "repo": "gpolanco/agent-skills-sh",
    "branch": "main"
  }
}
```

## Supported Editors

| Editor | Skills Path | Agents Path |
|--------|-------------|-------------|
| Claude Code | `.claude/skills/` | `.claude/agents/` |
| Cursor | `.cursor/skills/` | `.cursor/agents/` |
| GitHub Copilot | `.github/skills/` | `.github/agents/` |
| Antigravity | `.gemini/skills/` | `.gemini/agents/` |

## Presets

| Preset | Skills |
|--------|--------|
| `nextjs` | react-19, nextjs, typescript, tailwind-4, zod-4, structuring-projects |
| `react` | react-19, typescript, tailwind-4, zod-4, structuring-projects |
| `node` | typescript, zod-4, structuring-projects |
| `full` | All available skills |

## Development

```bash
cd cli
pnpm install
pnpm run build
./dist/index.js --help
```

# Contributing

## Adding a New Skill

1. Create the skill directory:
   ```bash
   mkdir -p content/skills/{skill-name}/{reference,assets}
   ```

2. Create `SKILL.md` following the skill-creator guidelines

3. Update `content/skills/README.md` with the new skill

4. Validate:
   ```bash
   ./scripts/validate-skills.sh
   ```

## Adding a New Agent

1. Create the agent directory:
   ```bash
   mkdir -p content/agents/{agent-name}/templates
   ```

2. Create `AGENT.md` with role, constraints, and output format

3. Add templates if needed in `templates/`

4. Update `content/agents/README.md`

5. Validate:
   ```bash
   ./scripts/validate-agents.sh
   ```

## Code Style

- Use kebab-case for directory names
- Keep `SKILL.md` under 500 lines
- Move heavy content to `reference/`
- No external URLs in reference folders

# @skills-as-context/cli

CLI interactiva para gestionar AI agent skills en tu proyecto.

## Instalación

```bash
# Con npx (recomendado)
npx @skills-as-context/cli init

# Global
npm install -g @skills-as-context/cli
skills init
```

## Comandos

### `skills init`

Inicializa skills en tu proyecto con un wizard interactivo.

```bash
skills init                          # Wizard interactivo
skills init --editor claude          # Especificar editor
skills init --preset nextjs          # Usar preset
skills init --yes                    # Non-interactive, usar defaults
```

**Opciones:**
- `-e, --editor <editor>` - Editor: claude, cursor, copilot, antigravity
- `-p, --preset <preset>` - Preset: nextjs, react, node, full
- `-y, --yes` - Saltar prompts, usar configuración por defecto

### `skills list`

Lista skills disponibles e instalados.

```bash
skills list           # Muestra catálogo completo
skills list --local   # Muestra solo skills instalados
```

### `skills add <skill>`

Agrega un skill a tu proyecto.

```bash
skills add forms      # Instala skill de forms
skills add zod-4      # Instala skill de Zod 4
```

### `skills remove <skill>`

Remueve un skill de tu proyecto.

```bash
skills remove forms   # Remueve skill de forms
```

## Configuración

Después de `skills init`, se crea `.skillsrc.json`:

```json
{
  "version": "1.0.0",
  "editor": "claude",
  "skills": {
    "directory": "content/skills",
    "active": ["react-19", "nextjs", "typescript"]
  },
  "agents": {
    "directory": "content/agents",
    "active": ["planner", "reviewer"]
  }
}
```

## Editores Soportados

| Editor | Skills Path | Agents Path |
|--------|-------------|-------------|
| Claude Code | `content/skills/` | `content/agents/` |
| Cursor | `content/skills/` | `content/agents/` |
| Antigravity | `.gemini/skills/` | `.gemini/agents/` |
| GitHub Copilot | `.github/skills/` | `.github/agents/` |

## Presets

| Preset | Skills |
|--------|--------|
| `nextjs` | react-19, nextjs, typescript, tailwind-4, zod-4, structuring-projects |
| `react` | react-19, typescript, tailwind-4, zod-4, structuring-projects |
| `node` | typescript, zod-4, structuring-projects |
| `full` | Todos los skills disponibles |

## Desarrollo

```bash
cd cli
pnpm install
pnpm run build
./dist/index.js --help
```

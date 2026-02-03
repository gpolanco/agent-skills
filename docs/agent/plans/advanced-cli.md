# Plan: Advanced CLI for Agent Skills

## Goal

Crear una CLI interactiva (`@agent-skills/cli`) que reemplace `init-agent.sh` con soporte para seleccion de editor, skills, y agentes.

## Problema Actual

El script `init-agent.sh` actual:
- Descarga **todos** los skills sin opcion de seleccionar
- No detecta el tech stack del proyecto
- No permite elegir editor (Claude, Cursor, etc.)
- No es configurable ni reutilizable
- No permite agregar/remover skills despues de la instalacion

## Propuesta: CLI Interactiva

### Comandos Principales

```
skills init           # Wizard interactivo
skills add <skill>    # Agregar skill individual
skills remove <skill> # Remover skill
skills list           # Listar skills disponibles/instalados
skills upgrade        # Actualizar skills
skills doctor         # Diagnosticar problemas
skills config         # Gestionar configuracion
```

### Flujo del Wizard (`skills init`)

```
1. Auto-detectar stack (package.json) → Next.js, React, Tailwind, etc.
2. Preguntar editor → Claude Code, Cursor, Antigravity, Copilot
3. Mostrar skills recomendados basados en stack
4. Permitir seleccionar/deseleccionar skills
5. Preguntar por agentes (planner, reviewer)
6. Confirmar y ejecutar instalacion
7. Mostrar siguiente pasos
```

### Configuracion por Editor

| Editor | Skills Path | Config Files |
|--------|-------------|--------------|
| Claude Code | `skills/` | `AGENTS.md` |
| Cursor | `skills/` | `AGENTS.md`, `.cursorrules` |
| Antigravity | `.gemini/skills/` | `AGENTS.md` |
| GitHub Copilot | `.github/skills/` | `AGENTS.md`, `.github/copilot-instructions.md` |

## Arquitectura CLI

```
cli/                          # Carpeta en la raiz del repo
  src/
    core/
      services/
        skill-service.ts      # CRUD de skills
        detection-service.ts  # Auto-detectar stack
        config-service.ts     # Gestion de .skillsrc.json
        download-service.ts   # Fetch desde GitHub
      types/
        editor.types.ts
        skill.types.ts

    shared/
      ui/
        prompts.ts            # Inquirer wrapper
        spinner.ts            # Ora wrapper
      errors/
        cli-error.ts

    commands/
      index.ts                # Entry point (bin)
      init.ts
      add.ts
      list.ts

    wizards/
      init-wizard.ts          # Flujo interactivo principal

  package.json
  tsconfig.json
  tsup.config.ts
```

**Instalacion para usuarios:**
```bash
# Opcion 1: npx directo
npx @agent-skills/cli init

# Opcion 2: curl + node (sin npm publish)
curl -sSL .../cli/dist/index.js | node -
```

## Archivo de Configuracion (`.skillsrc.json`)

```json
{
  "version": "1.0.0",
  "editor": "claude",
  "skills": {
    "directory": "skills",
    "active": ["react-19", "typescript", "nextjs"]
  },
  "agents": {
    "active": ["planner", "reviewer"]
  },
  "memory": {
    "enabled": true,
    "directory": "docs/agent"
  }
}
```

## Tech Stack CLI

| Dependencia | Proposito |
|-------------|-----------|
| `commander` | Parsing de comandos |
| `@inquirer/prompts` | Prompts interactivos |
| `picocolors` | Colores terminal |
| `ora` | Spinners |
| `zod` | Validacion de config |
| `tsup` | Bundling |

## Files to Create

```
cli/
  package.json
  tsconfig.json
  tsup.config.ts
  src/
    core/services/skill-service.ts
    core/services/detection-service.ts
    core/services/config-service.ts
    core/types/editor.types.ts
    core/types/skill.types.ts
    shared/ui/prompts.ts
    shared/ui/spinner.ts
    shared/errors/cli-error.ts
    commands/index.ts
    commands/init.ts
    commands/add.ts
    commands/list.ts
    wizards/init-wizard.ts
```

## Steps

1. ✅ Crear estructura de carpetas `cli/`
2. ✅ Configurar `package.json` con dependencias y bin entry
3. ✅ Implementar `detection-service.ts` (detectar stack desde package.json)
4. ✅ Implementar `skill-service.ts` (descargar, copiar, validar skills)
5. ✅ Implementar `config-service.ts` (leer/escribir .skillsrc.json)
6. ✅ Crear types para editores y skills
7. ✅ Implementar UI helpers (prompts, spinner)
8. ✅ Implementar `init-wizard.ts` con flujo completo
9. ✅ Implementar comando `init` con opciones CLI
10. ✅ Implementar comandos `add`, `remove`, `list`
11. ✅ Agregar tests unitarios (35 tests, 91% coverage)
12. ✅ Documentar uso en README
13. ✅ Versionado v1.0.0
    - ✅ Actualizar version en `cli/package.json`
    - ✅ Generar `CHANGELOG.md` detallado
    - ✅ Sincronizar version en documentacion
    - ✅ Crear git tag `v1.0.0`
14. ⏳ Publicar v1.0.0 en npm como `@agent-skills/cli`
15. ⏳ Automatizar Release Pipeline
    - Setup GitHub Action disparada por merge a `main`
    - Version bump automático (semantic versioning)
    - Generación automática de `CHANGELOG.md`
    - Publicación automática en npm
    - Creación de GitHub Release con el tag correspondiente


## Verificacion

1. `npx @agent-skills/cli init` → wizard funciona
2. Auto-deteccion correcta de Next.js/React/etc.
3. Skills se copian al directorio correcto segun editor
4. `.skillsrc.json` se crea con configuracion valida
5. `skills list --local` muestra skills instalados
6. `skills add zod-4` agrega skill individual
7. `skills remove zod-4` remueve skill

## Decisiones

- **Ubicacion**: Carpeta `cli/` en el repo actual
- **Nombre CLI**: `skills` (ej: `skills init`, `skills add react-19`)
- **Presets**: Si, soportar presets como `--preset nextjs`

## Presets Disponibles

| Preset | Skills Incluidos |
|--------|------------------|
| `nextjs` | react-19, nextjs, typescript, tailwind-4, zod-4, structuring-projects |
| `react` | react-19, typescript, tailwind-4, zod-4, structuring-projects |
| `node` | typescript, zod-4, structuring-projects |
| `full` | Todos los skills disponibles |

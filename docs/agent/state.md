# State

## Now
- Versión 1.0.0 publicada ✅
- Automatización operativa ✅
- Rebranding completo ✅
- Corrección formato de salida CLI ✅ (2026-02-04)
- Formato de agentes compatible con Claude Code ✅ (2026-02-04)
- v1.0.1 publicada ✅ (2026-02-04)
- Fix: Agentes duplicados resuelto ✅ (2026-02-04)
- Fix: skill-integrator usa templates locales ✅ (2026-02-04)
- Changeset para v1.0.2 creado ✅ (2026-02-04)

## Next
- Mergear PR de Changesets para publicar v1.0.2
- Probar CLI en proyecto real para validar flujo completo
- Considerar añadir soporte para Windsurf (similar a Cursor)
- Evolucionar catálogo de skills

## Blockers
- Ninguno

---

# Sesión 2026-02-04 - Corrección Formato de Salida CLI

## Problema Identificado
El CLI generaba archivos que no funcionaban correctamente con los editores:
1. `AGENTS.md` básico (~25 líneas) en lugar del template completo (288 líneas)
2. Sin AI Handover Guide al finalizar instalación
3. Agentes en carpetas (`planner/AGENT.md`) en lugar de archivos directos (`planner.md`)

## Correcciones Implementadas

### 1. `createAgentsMd` usa template completo
**Archivo**: `cli/src/wizards/init-wizard.ts`
- Lee template desde `bootstrap/templates/AGENTS.template.md`
- Reemplaza URLs `skills/` → ruta del editor (ej: `.claude/skills/`)
- Filtra tablas para mostrar solo skills instalados
- Mantiene placeholders `{PROJECT_NAME}` para que el AI los complete

### 2. AI Handover Guide en `printSuccess`
**Archivo**: `cli/src/shared/ui/prompts.ts`
- Muestra bloque con prompt copiable al finalizar
- Rutas dinámicas según editor

### 3. Rutas oficiales por editor
**Archivo**: `cli/src/core/types/editor.types.ts`
- Claude: `.claude/skills/`, `.claude/agents/` (soporta skills nativamente)
- Cursor: `.cursor/rules/*.mdc` (NO soporta skills nativamente)
- Copilot: `.github/copilot-instructions.md` (NO soporta skills nativamente)
- Gemini: `.gemini/styleguide.md` (renombrado de `antigravity`)
- Nueva propiedad `supportsNativeSkills: boolean`

### 4. Agentes como archivos directos
**Archivo**: `cli/src/core/services/skill-service.ts`
- `installAgent` ahora crea AMBOS:
  - `planner/` carpeta con recursos (templates)
  - `planner.md` archivo directo (Claude Code lo detecta)

### 5. Formato de agentes compatible con Claude Code
**Archivos**: `content/agents/*/AGENT.md`
- Claude Code requiere `name:` en el frontmatter
- Formato anterior (no detectado):
  ```yaml
  description: >
    Planning-only sub-agent...
  capabilities:
    - planning
  ```
- Formato correcto (detectado):
  ```yaml
  name: planner
  description: "Use this agent when..."
  ```

## Verificación
Prueba exitosa en `/tmp/test-skills-cli`:
```
.claude/
├── skills/          ← 6 skills instalados
│   ├── react-19/
│   ├── nextjs/
│   └── ...
└── agents/
    ├── planner.md   ← Claude Code detecta
    ├── planner/     ← Recursos adicionales
    ├── reviewer.md  ← Claude Code detecta
    └── reviewer/
```

## Investigación Adicional
- Documento de análisis de `your-claude-engineer`: `docs/research/your-claude-engineer-analysis.md`
- Útil para futuras funcionalidades: arquitectura multi-agente, Playwright para tests UI

---

# Fase 6 - Multi-Editor Support ✅

## Objetivo
Generar archivos de configuración específicos para que cada editor sepa usar los skills instalados.

## Estructura por Editor

### Claude Code
```
proyecto/
├── .skillsrc.json
├── AGENTS.md              ← Template completo con placeholders
├── .claude/
│   ├── skills/
│   │   ├── typescript/SKILL.md
│   │   ├── react-19/SKILL.md
│   │   └── ...
│   └── agents/
│       ├── planner.md     ← Archivo directo (detectado por Claude)
│       ├── planner/       ← Carpeta con recursos adicionales
│       ├── reviewer.md    ← Archivo directo (detectado por Claude)
│       └── reviewer/
└── docs/agent/
    ├── state.md
    ├── decisions.md
    └── plans/
```
**Nota**: Claude Code detecta automáticamente skills en `.claude/skills/` y agents en `.claude/agents/*.md`.

### Cursor
```
proyecto/
├── .skillsrc.json
├── .cursorrules
├── AGENTS.md
├── .cursor/
│   ├── skills/
│   └── agents/
└── docs/agent/
```
**`.cursorrules`** contiene instrucciones para usar skills en `.cursor/skills/`.

### GitHub Copilot
```
proyecto/
├── .skillsrc.json
├── AGENTS.md
├── .github/
│   ├── copilot-instructions.md
│   ├── skills/
│   └── agents/
└── docs/agent/
```

### Gemini
```
proyecto/
├── .skillsrc.json
├── AGENTS.md
├── .gemini/
│   ├── skills/
│   └── agents/
└── docs/agent/
```

## Tareas

| Tarea | Estado |
|-------|--------|
| Crear template `.cursorrules` | ✅ Completado |
| Crear template `copilot-instructions.md` | ✅ Completado |
| Generar archivos en `init-wizard.ts` | ✅ Completado |
| Usar template completo de AGENTS.md | ✅ Completado (2026-02-04) |
| Mostrar AI Handover Guide | ✅ Completado (2026-02-04) |
| Corregir formato de agentes (.md directo) | ✅ Completado (2026-02-04) |
| Actualizar rutas oficiales por editor | ✅ Completado (2026-02-04) |
| Formato agentes con `name:` para Claude Code | ✅ Completado (2026-02-04) |
| Tests para generación de config | ⏳ Pendiente (35 tests existentes pasan) |

---

# CLI Development Progress

## ✅ Fase 1 - Foundation (Complete)
| Componente | Estado |
|------------|--------|
| `package.json` | ✅ pnpm, tsup, commander, vitest |
| `tsconfig.json` | ✅ TypeScript strict |
| `tsup.config.ts` | ✅ ESM bundle |
| `core/types/` | ✅ EditorId, Skill, Agent, ConfigFile |
| `detection-service.ts` | ✅ + 12 tests (100% lines) |
| `config-service.ts` | ✅ + 9 tests (100% lines) |
| `skill-service.ts` | ✅ + 14 tests (84% lines) |

## ✅ Fase 2 - UI & Wizard (Complete)
| Componente | Estado |
|------------|--------|
| `shared/ui/prompts.ts` | ✅ |
| `shared/ui/spinner.ts` | ✅ |
| `shared/errors/cli-error.ts` | ✅ |
| `wizards/init-wizard.ts` | ✅ |
| `commands/init.ts` | ✅ |

## ✅ Fase 3 - Commands & Tests (Complete)
| Componente | Estado |
|------------|--------|
| `commands/list.ts` | ✅ |
| `commands/add.ts` | ✅ |
| `commands/remove.ts` | ✅ |
| `README.md` | ✅ |
| `vitest.config.ts` | ✅ |
| Tests unitarios | ✅ 35 tests, 91% coverage |
| Versionado v1.0.0 | ✅ |

## ✅ Fase 4 - Release (Complete)
- Crear git tag v1.0.0 (✅ Done)
- npm publish v1.0.0 (✅ Done)

## ✅ Fase 5 - Automation (Complete)
- Automatizar Version/Changelog/Publish pipeline:
  - ✅ Disparado por merge a `main`
  - ✅ Version bump automático (semantic versioning via Changesets)
  - ✅ Actualización automática de `CHANGELOG.md`
  - ✅ `npm publish` automático desde CI
  - ✅ Creación de GitHub Release con el tag correspondiente

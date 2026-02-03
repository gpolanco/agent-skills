# State

## Now
- Versión 1.0.0 publicada ✅
- Automatización operativa ✅
- Rebranding completo ✅

## Next
- Evolucionar catálogo de skills

## Blockers
- Ninguno

---

# Fase 6 - Multi-Editor Support

## Objetivo
Generar archivos de configuración específicos para que cada editor sepa usar los skills instalados.

## Estructura por Editor

### Claude Code
```
proyecto/
├── .skillsrc.json
├── AGENTS.md
├── .claude/
│   ├── skills/
│   │   ├── typescript/SKILL.md
│   │   ├── react-19/SKILL.md
│   │   └── ...
│   └── agents/
│       ├── planner/AGENT.md
│       └── reviewer/AGENT.md
└── docs/agent/
    ├── state.md
    ├── decisions.md
    └── plans/
```
**Nota**: Claude Code detecta automáticamente skills en `.claude/skills/`.

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
│   ├── copilot-instructions.md   ← FALTA GENERAR
│   ├── skills/
│   │   ├── typescript/SKILL.md
│   │   └── ...
│   └── agents/
│       ├── planner/AGENT.md
│       └── reviewer/AGENT.md
└── docs/agent/
```
**`.github/copilot-instructions.md`** debe contener:
- Instrucciones para usar skills en `.github/skills/`
- Referencias a agents disponibles
- Patrones de uso de memoria

### Antigravity (Gemini)
```
proyecto/
├── .skillsrc.json
├── AGENTS.md
├── .gemini/
│   ├── skills/
│   └── agents/
└── docs/agent/
```
**Nota**: Antigravity lee archivos `.gemini/` automáticamente.

## Tareas

| Tarea | Estado |
|-------|--------|
| Crear template `.cursorrules` | ✅ Completado |
| Crear template `copilot-instructions.md` | ✅ Completado |
| Generar archivos en `init-wizard.ts` | ✅ Completado |
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

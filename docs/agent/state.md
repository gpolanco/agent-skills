# State

## Now
- Versión 1.0.0 preparada (package.json, CHANGELOG, index.ts)
- Pendiente: crear git tag y publicar en npm

## Next
- Actualizar CHANGELOG.md
- Crear git tag v1.0.0
- Publicar en npm

## Blockers
- Ninguno

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

## ⏳ Fase 4 - Release (Pending)
- Crear git tag v1.0.0 (✅ Done)
- npm publish v1.0.0

## ✅ Fase 5 - Automation (Complete)
- Automatizar Version/Changelog/Publish pipeline:
  - ✅ Disparado por merge a `main`
  - ✅ Version bump automático (semantic versioning via Changesets)
  - ✅ Actualización automática de `CHANGELOG.md`
  - ✅ `npm publish` automático desde CI
  - ✅ Creación de GitHub Release con el tag correspondiente

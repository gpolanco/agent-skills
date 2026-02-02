# State

## Now
- Fase 3 comandos completada
- Pendiente: actualizar repo remoto con estructura `content/`

## Next
- Push con estructura `content/skills` y `content/agents`
- Tests unitarios (requiere repo remoto actualizado)
- Publicar en npm

## Blockers
- Repo remoto no tiene estructura `content/` → CLI no puede descargar skills

---

# CLI Development Progress

## ✅ Fase 1 - Foundation (Complete)
| Componente | Estado |
|------------|--------|
| `cli/package.json` | ✅ pnpm, tsup, commander |
| `cli/tsconfig.json` | ✅ TypeScript strict |
| `cli/tsup.config.ts` | ✅ ESM bundle |
| `core/types/` | ✅ EditorId, Skill, Agent, ConfigFile, Presets |
| `detection-service.ts` | ✅ Detecta stack desde package.json |
| `config-service.ts` | ✅ Lee/escribe .skillsrc.json |
| `skill-service.ts` | ✅ Descarga, instala, remueve skills |

## ✅ Fase 2 - UI & Wizard (Complete)
| Componente | Estado |
|------------|--------|
| `shared/ui/prompts.ts` | ✅ Wrapper de @inquirer/prompts |
| `shared/ui/spinner.ts` | ✅ Wrapper de ora |
| `shared/errors/cli-error.ts` | ✅ Clases de error custom |
| `wizards/init-wizard.ts` | ✅ Flujo interactivo completo |
| `commands/init.ts` | ✅ Opciones: --editor, --preset, --yes |

## ✅ Fase 3 - Commands (Complete)
| Componente | Estado |
|------------|--------|
| `commands/list.ts` | ✅ --local para instalados, catálogo remoto |
| `commands/add.ts` | ✅ Descarga e instala skill individual |
| `commands/remove.ts` | ✅ Remueve skill y actualiza config |
| `README.md` | ✅ Documentación completa |

## ⏳ Pendiente
- Tests unitarios (bloqueado por repo remoto)
- npm publish

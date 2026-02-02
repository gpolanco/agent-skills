# State

## Now
- Fase 2 CLI completada
- Init wizard wired y funcional

## Next
- Fase 3: Implementar comandos `add`, `remove`, `list`
- Actualizar repo remoto con estructura `content/`

## Blockers
- Ninguno

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

## ⏳ Fase 3 - Commands (Pending)
- `add <skill>` - Agregar skill individual  
- `remove <skill>` - Remover skill
- `list` - Listar skills (--local)
- Tests unitarios
- Documentación README

# Plan de Reestructuración del Proyecto

> Fecha: 2026-02-02
> Estado: **Aprobado**

---

## Contexto

El proyecto **skills-as-context** ha evolucionado:
- Inicio: Almacén de skills
- Actual: Skills + Agents
- Futuro: Soporte multi-editor (Claude, Cursor, Copilot, Gemini)

---

## Problemas Actuales

| Problema | Detalle |
|----------|---------|
| **Sin separación fuente/config** | No hay distinción clara entre contenido consumible y configuración del repo |
| **Naming confuso** | `agents/` tiene templates, pero `docs/agent/` es memoria. Confuso. |
| **Templates mezclados** | `templates/` mezcla bootstrap scripts con templates de docs |
| **Sin soporte multi-editor** | No hay estructura para configs de Cursor, Copilot, Gemini |
| **Sin tooling propio** | El proyecto necesita sus propios scripts/herramientas |
| **Skills vacíos** | `route-handlers/` y `nextjs-route-handlers/` están vacíos pero listados como Ready |
| **Docs ambiguo** | `docs/` es memoria de agente, no documentación del proyecto |

---

## Decisión de Diseño: `content/` como raíz consumible

Basado en investigación de repositorios de catálogos de contenido (MDN, OpenAI Cookbook, GitHub Docs, 30-seconds-of-code):

- **`src/` NO es la convención** para catálogos de contenido (solo para código compilable)
- **`content/` es el patrón establecido** para agrupar todo lo consumible
- **`scripts/`** para herramientas internas del repo

Esto provee separación clara entre:
- `content/` → Lo que otros proyectos importan
- Todo lo demás → Infraestructura del repositorio

---

## Estructura Actual

```
skills-as-context/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── LICENSE
├── skills/                  # 13 skills (2 vacíos)
│   ├── skill-creator/
│   ├── skill-integrator/
│   ├── react-19/
│   ├── nextjs/
│   ├── ...
│   ├── route-handlers/      # VACÍO
│   └── nextjs-route-handlers/ # VACÍO
├── agents/
│   ├── README.md
│   ├── planner.template.md
│   └── reviewer.template.md
├── templates/
│   ├── AGENTS.template.md
│   ├── SKILLS_README.template.md
│   ├── init-agent.sh
│   └── plans/
└── docs/
    └── agent/               # Memoria de agente (confuso)
```

---

## Estructura Propuesta

```
skills-as-context/
│
├── README.md                      # Entry point
├── LICENSE
├── CHANGELOG.md                   # Historial de versiones
│
├── content/                       # ← TODO lo consumible
│   │
│   ├── skills/                    # Skills (sin subcategorías por ahora)
│   │   ├── README.md
│   │   ├── skill-creator/
│   │   ├── skill-integrator/
│   │   ├── typescript/
│   │   ├── structuring-projects/
│   │   ├── zod-4/
│   │   ├── react-19/
│   │   ├── tailwind-4/
│   │   ├── forms/
│   │   ├── nextjs/
│   │   ├── supabase/
│   │   └── testing-vitest/
│   │
│   └── agents/                    # Agentes (sin subcategorías por ahora)
│       ├── README.md
│       ├── planner/
│       │   ├── AGENT.md
│       │   └── templates/
│       │       └── plan.template.md
│       └── reviewer/
│           ├── AGENT.md
│           └── templates/
│               └── review.template.md
│
├── bootstrap/                     # Scripts/templates para proyectos consumidores
│   ├── init.sh
│   ├── templates/
│   │   ├── AGENTS.template.md
│   │   └── SKILLS_README.template.md
│   └── editors/                   # Templates por editor (futuro)
│       ├── claude/
│       ├── cursor/
│       └── copilot/
│
├── scripts/                       # Herramientas INTERNAS del repo
│   ├── validate-skills.sh
│   ├── generate-catalog.sh
│   └── lint-frontmatter.sh
│
├── .claude/                       # Config específica Claude Code
│   ├── AGENTS.md
│   └── settings.json              # (futuro)
│
├── .cursor/                       # (futuro) Config Cursor
│   └── rules.md
│
├── .github/                       # Workflows + Config Copilot (futuro)
│   └── copilot-instructions.md
│
└── docs/                          # Documentación del proyecto
    ├── architecture.md
    ├── contributing.md
    └── multi-editor.md
```

---

## Tabla de Cambios

| Antes | Después | Razón |
|-------|---------|-------|
| `skills/` | `content/skills/` | Agrupado bajo contenido consumible |
| `agents/` | `content/agents/` | Agrupado bajo contenido consumible |
| `agents/*.template.md` | `agents/<name>/AGENT.md` + `templates/` | Consistencia con skills |
| `templates/` | `bootstrap/` | Nombre más descriptivo |
| `docs/agent/` | Eliminado (va en proyectos consumidores) | No pertenece a este repo |
| `AGENTS.md` (root) | `.claude/AGENTS.md` | Preparación multi-editor |
| — | `scripts/` | Herramientas internas del repo |
| — | `content/` | Separación clara fuente vs config |

---

## Beneficios

1. **Separación clara**: `content/` = consumible, resto = infraestructura
2. **Convención establecida**: Patrón usado por MDN, GitHub Docs, OpenAI Cookbook
3. **Multi-editor ready**: Cada editor tiene su carpeta de config
4. **Consistencia**: Agents siguen el mismo patrón que skills
5. **Escalable**: Fácil agregar `content/prompts/`, `content/templates/` en el futuro

---

## Migración de Agentes

### Antes
```
agents/
├── README.md
├── planner.template.md
└── reviewer.template.md
```

### Después
```
content/agents/
├── README.md
├── planner/
│   ├── AGENT.md              # Rol, restricciones, ejemplos
│   └── templates/
│       └── plan.template.md
└── reviewer/
    ├── AGENT.md
    └── templates/
        └── review.template.md
```

---

## Decisiones Tomadas

| Decisión | Resultado |
|----------|-----------|
| Separación fuente/config | ✅ Usar `content/` para consumibles |
| Subcategorías en skills | ❌ No por ahora, estructura plana |
| Subcategorías en agents | ❌ No por ahora, estructura plana |
| Nombre del wrapper | ✅ `content/` (convención establecida) |
| Skills vacíos | ✅ Eliminar `route-handlers` y `nextjs-route-handlers` |
| `docs/agent/` | ✅ Eliminar (pertenece a consumidores) |
| Soporte multi-editor | ✅ Crear estructura vacía ahora |

---

## Próximos Pasos

1. [x] Revisar y aprobar este plan
2. [x] Decidir sobre skills vacíos → Eliminados
3. [x] Ejecutar migración:
   - [x] Crear `content/skills/` y mover skills
   - [x] Crear `content/agents/` y migrar estructura de agentes
   - [x] Crear `bootstrap/` desde `templates/`
   - [x] Crear `scripts/` con herramientas básicas
   - [x] Mover `AGENTS.md` a `.claude/AGENTS.md`
   - [x] Eliminar `docs/agent/`
4. [x] Actualizar `init.sh` para nueva estructura
5. [x] Actualizar README principal
6. [x] Crear CHANGELOG.md
7. [x] Crear placeholders multi-editor (`.cursor/`, `.github/`)
8. [x] Crear `docs/architecture.md` y `docs/contributing.md`

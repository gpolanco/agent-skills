# Plan de Reestructuración del Proyecto

> Fecha: 2026-02-02
> Estado: Propuesta para análisis

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
| **Naming confuso** | `agents/` tiene templates, pero `docs/agent/` es memoria. Confuso. |
| **Templates mezclados** | `templates/` mezcla bootstrap scripts con templates de docs |
| **Sin soporte multi-editor** | No hay estructura para configs de Cursor, Copilot, Gemini |
| **Sin tooling propio** | El proyecto necesita sus propios scripts/herramientas |
| **Skills vacíos** | `route-handlers/` y `nextjs-route-handlers/` están vacíos pero listados como Ready |
| **Docs ambiguo** | `docs/` es memoria de agente, no documentación del proyecto |

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
├── .claude/                       # Config específica Claude Code
│   ├── AGENTS.md                  # → Reemplaza el actual
│   └── settings.json              # (futuro) Claude Code settings
│
├── .cursor/                       # (futuro) Config Cursor
│   └── rules.md
│
├── .github/                       # (futuro) Config Copilot
│   └── copilot-instructions.md
│
├── catalog/                       # ← Renombrado de skills/
│   ├── README.md                  # Catálogo principal
│   │
│   ├── meta/                      # Skills de meta-nivel
│   │   ├── skill-creator/
│   │   └── skill-integrator/
│   │
│   ├── core/                      # Skills fundamentales
│   │   ├── typescript/
│   │   ├── structuring-projects/
│   │   └── zod-4/
│   │
│   ├── frontend/                  # Skills de frontend
│   │   ├── react-19/
│   │   ├── tailwind-4/
│   │   └── forms/
│   │
│   ├── backend/                   # Skills de backend
│   │   ├── nextjs/
│   │   ├── supabase/
│   │   └── route-handlers/
│   │
│   └── quality/                   # Skills de calidad
│       └── testing-vitest/
│
├── agents/                        # Definiciones de agentes
│   ├── README.md                  # Guía de agentes
│   ├── planner/
│   │   ├── AGENT.md               # Definición del agente
│   │   └── templates/             # Templates que usa
│   │       └── plan.template.md
│   └── reviewer/
│       ├── AGENT.md
│       └── templates/
│           └── review.template.md
│
├── bootstrap/                     # ← Renombrado de templates/
│   ├── init.sh                    # Script de instalación
│   ├── templates/                 # Templates para proyectos consumidores
│   │   ├── AGENTS.template.md
│   │   └── SKILLS_README.template.md
│   └── editors/                   # Templates por editor
│       ├── claude/
│       ├── cursor/
│       └── copilot/
│
├── tools/                         # Herramientas internas del proyecto
│   ├── validate-skills.sh         # Validar estructura de skills
│   ├── generate-catalog.sh        # Generar README de catálogo
│   └── lint-frontmatter.sh        # Validar YAML frontmatter
│
└── docs/                          # Documentación real del proyecto
    ├── architecture.md            # Decisiones de arquitectura
    ├── contributing.md            # Cómo contribuir
    └── multi-editor.md            # Guía de soporte multi-editor
```

---

## Tabla de Cambios

| Antes | Después | Razón |
|-------|---------|-------|
| `skills/` | `catalog/` con subcategorías | Organización por dominio, escalable |
| `agents/*.template.md` | `agents/<name>/AGENT.md` | Consistencia con skills, permite reference/ |
| `templates/` | `bootstrap/` | Nombre más descriptivo, separa scripts de templates |
| `docs/agent/` | Movido a proyectos consumidores | No pertenece a este repo, es memoria de proyecto |
| `AGENTS.md` (root) | `.claude/AGENTS.md` | Preparación multi-editor |
| — | `tools/` | Herramientas propias del proyecto |
| — | `.cursor/`, `.github/` | Estructura preparada para otros editores |

---

## Beneficios

1. **Escalable**: Categorías claras para agregar skills sin desorden
2. **Multi-editor ready**: Cada editor tiene su carpeta de config
3. **Consistencia**: Agents siguen el mismo patrón que skills (carpeta + archivo principal)
4. **Separación clara**: Bootstrap, catálogo, agentes, herramientas y docs son distintos
5. **Self-service**: `tools/` permite automatizar tareas del proyecto

---

## Categorización de Skills

### Meta (2)
- `skill-creator` - Crear/modificar skills
- `skill-integrator` - Setup de proyectos

### Core (3)
- `typescript` - Tipos estrictos, patrones const
- `structuring-projects` - DDD, feature-first
- `zod-4` - Validación runtime

### Frontend (3)
- `react-19` - React 19 + Compiler
- `tailwind-4` - Utilidades CSS
- `forms` - React Hook Form + Zod

### Backend (3)
- `nextjs` - App Router, Server Actions
- `supabase` - RLS, Auth, Database
- `route-handlers` - Patrones de API (pendiente completar)

### Quality (1)
- `testing-vitest` - Testing unitario e integración

### Pendientes de decisión
- `nextjs-route-handlers` - ¿Merge con `route-handlers` o `nextjs`?

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
agents/
├── README.md
├── planner/
│   ├── AGENT.md              # Rol, restricciones, ejemplos
│   └── templates/
│       └── plan.template.md  # Template de output
└── reviewer/
    ├── AGENT.md
    └── templates/
        └── review.template.md
```

**Beneficios:**
- Consistencia con estructura de skills
- Espacio para `reference/` si se necesita
- Templates separados del archivo de definición

---

## Decisiones Pendientes

1. **¿Mantener `docs/agent/` en este repo o solo en consumidores?**
   - Opción A: Eliminar de este repo (es memoria de proyecto, no de catálogo)
   - Opción B: Mantener como ejemplo/demo

2. **¿Qué hacer con skills vacíos?**
   - Opción A: Eliminar `route-handlers` y `nextjs-route-handlers`
   - Opción B: Completarlos antes de la migración
   - Opción C: Marcarlos como "planned" y moverlos

3. **¿Nombre final del catálogo?**
   - Opción A: `catalog/` (propuesto)
   - Opción B: `skills/` (actual, más familiar)
   - Opción C: `library/`

4. **¿Cuándo implementar soporte multi-editor?**
   - Opción A: Crear estructura vacía ahora
   - Opción B: Esperar hasta tener contenido real

---

## Próximos Pasos

1. [ ] Revisar y aprobar este plan
2. [ ] Decidir sobre items pendientes
3. [ ] Crear script de migración o migrar manualmente
4. [ ] Actualizar `init-agent.sh` para nueva estructura
5. [ ] Actualizar `AGENTS.template.md`
6. [ ] Actualizar README principal

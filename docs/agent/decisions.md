# Decisions

## 2026-02-02 — Estructura de contenido en `content/`
- **Decision**: Skills y agents se ubicarán en `content/skills/` y `content/agents/`
- **Why**: Separa contenido distribuible del código CLI y configs
- **Impact**: CLI usa `CONTENT_PATH = "content"` para resolver paths del repo remoto

## 2026-02-02 — Migración a pnpm
- **Decision**: CLI usa pnpm en lugar de npm
- **Why**: Consistencia, velocidad, mejor manejo de dependencias
- **Impact**: `pnpm-lock.yaml` reemplaza `package-lock.json`

## 2026-02-02 — Editor paths configurables
- **Decision**: Cada editor define su propio `skillsPath` y `agentsPath`
- **Why**: Claude Code usa `content/skills/`, Antigravity usa `.gemini/skills/`, etc.
- **Impact**: El wizard instala en paths diferentes según el editor seleccionado

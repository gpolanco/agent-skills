# Decisions

## 2026-02-02

### Estructura `content/`
Skills y agents se mueven a `content/skills/` y `content/agents/` para separar contenido consumible de tooling (cli/, bootstrap/).

### Migración a pnpm
CLI usa pnpm como package manager por defecto. Más rápido y mejor manejo de dependencias.

### Paths configurables por editor
Cada editor (Claude, Cursor, Antigravity, Copilot) tiene su propio directorio de skills configurable.

### Vitest para tests
- `fileParallelism: false` para evitar conflictos de directorio temporal
- Coverage con v8 provider
- Tests separados por service: config, detection, skill

### downloadRepository sin test unitario
Función que hace llamadas de red (`curl`, `unzip`) se excluye de unit tests. Cubierta por tests de integración manuales.

## 2026-02-03

### Coverage target: 85% services
Objetivo de cobertura para services alcanzado (91%). Prioriza tests de lógica de negocio sobre funciones de I/O.

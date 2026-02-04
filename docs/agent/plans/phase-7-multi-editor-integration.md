# Plan: Fase 7 - Multi-Editor Integration

## Goal
Integrar soporte oficial para Windsurf, OpenCode, GPT Code y VS Code + Copilot, investigando y aplicando el formato nativo de cada editor.

## Assumptions
1. Windsurf usa un formato similar a Cursor (`.windsurfrules` o carpeta `.windsurf/`)
2. OpenCode y GPT Code son editores emergentes sin formato estándar documentado - usarán estructura genérica
3. VS Code + Copilot es equivalente a GitHub Copilot (mismo `copilot-instructions.md`)

## Files to touch
- `cli/src/core/types/editor.types.ts` - Agregar nuevos editores al objeto EDITORS
- `cli/src/wizards/init-wizard.ts` - Agregar generadores de config para nuevos editores
- `cli/src/core/services/detection-service.ts` - Detectar nuevos editores
- `bootstrap/templates/` - Templates de config por editor (si aplica)

## Steps

### 1. Investigar formatos oficiales
- [ ] Windsurf: Buscar documentación oficial o repos que usen `.windsurf/` o `.windsurfrules`
- [ ] OpenCode: Identificar si tiene formato propio o usa convención genérica
- [ ] GPT Code: Determinar si es producto real o placeholder

### 2. Actualizar `editor.types.ts`
```typescript
// Agregar:
windsurf: {
  name: "Windsurf",
  skillsPath: ".windsurf/skills",
  agentsPath: ".windsurf/agents",
  configFiles: [".windsurfrules"], // TBD tras investigación
  supportsNativeSkills: false,
},
opencode: {
  name: "OpenCode",
  skillsPath: ".opencode/skills",
  agentsPath: ".opencode/agents",
  configFiles: [],
  supportsNativeSkills: false,
},
```

### 3. Implementar generadores de config
Para cada editor nuevo, crear función `create<Editor>Config()` en `init-wizard.ts`:
- Windsurf: Probablemente `.windsurfrules` similar a `.cursorrules`
- OpenCode/GPT Code: Archivo README o instrucciones genéricas

### 4. Actualizar detection-service
Agregar patrones de detección:
- Windsurf: Buscar `.windsurf/` o archivos característicos
- OpenCode: Buscar `.opencode/` o config específico

### 5. Crear templates
- `bootstrap/templates/windsurfrules.template.md` (si aplica)
- Documentar formato esperado por cada editor

### 6. Tests
- Agregar tests unitarios para nuevos editores en `detection-service.test.ts`
- Validar generación de configs en `init-wizard.test.ts`

## Risks / edge cases
1. **Formatos no documentados**: Windsurf/OpenCode pueden no tener formato oficial aún
2. **Cambios frecuentes**: Editores emergentes cambian sus formatos rápidamente
3. **Duplicación VS Code + Copilot**: Podría ser redundante con Copilot existente
4. **GPT Code**: Puede no existir como producto real (verificar)

## Acceptance criteria
- [ ] `npx agent-skills init` lista todos los editores nuevos como opciones
- [ ] Cada editor genera su estructura de carpetas correcta
- [ ] Editores con config file generan el archivo correspondiente
- [ ] Tests pasan para todos los editores nuevos
- [ ] Documentación en README actualizada con editores soportados

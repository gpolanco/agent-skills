# Análisis: Your Claude Engineer

> Investigación realizada el 2026-02-03

## Resumen Ejecutivo

**Your Claude Engineer** es un sistema de ingeniería de software autónomo que utiliza una arquitectura multi-agente basada en Claude. El proyecto demuestra cómo crear un "ingeniero de software virtual" capaz de desarrollar aplicaciones completas sin intervención humana.

---

## 1. ¿Qué es el Proyecto?

Un sistema que permite delegar solicitudes de funcionalidades completas y recibir implementaciones funcionales, probadas y documentadas de forma autónoma.

**Capacidades principales:**
- Desarrollo autónomo de aplicaciones web
- Gestión automatizada de proyectos (Linear)
- Control de versiones automatizado (GitHub)
- Notificaciones de equipo (Slack)
- Pruebas automatizadas de UI (Playwright)

---

## 2. Arquitectura Multi-Agente

```
ORCHESTRATOR (Claude Haiku)
    │
    ├── LINEAR AGENT (Haiku)    → Gestión de proyectos/issues
    ├── CODING AGENT (Sonnet)   → Implementación y pruebas
    ├── GITHUB AGENT (Haiku)    → Control de versiones
    └── SLACK AGENT (Haiku)     → Notificaciones
```

**Patrón de comunicación:** Los agentes NO comparten memoria. El orquestador pasa información manualmente entre ellos.

---

## 3. Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Lenguaje | Python 3 |
| SDK de AI | `claude-agent-sdk` (oficial de Anthropic) |
| Gateway de servicios | Arcade MCP Server |
| Validación | Pydantic |
| Servidor web | Starlette + uvicorn |
| Automatización browser | Playwright (via npm) |

---

## 4. Sistema de Agentes/Skills

Cada agente se define con:
- Descripción y propósito
- Prompt de sistema (archivos `.md` en `/prompts`)
- Herramientas específicas (tools MCP)
- Modelo configurable (haiku, sonnet, opus)

### Herramientas disponibles:

| Categoría | Herramientas |
|-----------|-------------|
| Archivos | Read, Write, Edit, Glob, Grep |
| Bash | 28 comandos permitidos (ls, cat, npm, node, python, git...) |
| Navegador | Playwright MCP (8 funciones) |
| Externos | 46 GitHub + 39 Linear + 8 Slack = **93 herramientas** |

---

## 5. Fortalezas

1. **Autonomía completa** - Sesiones de codificación extendidas sin intervención
2. **Arquitectura modular** - Separación clara de responsabilidades por agente
3. **Seguridad en capas** - Sandbox OS, permisos SDK, hooks de validación, allowlist
4. **Verificación visual** - Screenshots obligatorios antes de completar tareas
5. **Integración empresarial** - Linear + GitHub + Slack out-of-the-box
6. **Continuidad de sesiones** - Puede reanudar trabajo previo
7. **Modelos configurables** - Flexibilidad costo/calidad

---

## 6. Limitaciones

1. Solo macOS/Linux (Windows requiere WSL)
2. Requiere cuentas en Arcade, Linear (y opcionalmente GitHub/Slack)
3. Sin memoria compartida entre agentes
4. Solo 28 comandos bash permitidos
5. No crea canales Slack ni repositorios GitHub (deben existir)
6. Optimizado solo para aplicaciones web vanilla

---

## 7. Análisis de Relevancia para Tu Proyecto

### ¿Te sirve? **SÍ, parcialmente**

#### Lo que puedes aprovechar:

| Aspecto | Relevancia | Por qué |
|---------|------------|---------|
| Arquitectura multi-agente | Alta | Tu proyecto actual busca crear skills y agentes |
| Uso de `claude-agent-sdk` | Alta | SDK oficial de Anthropic para crear agentes |
| Sistema de prompts en `.md` | Alta | Similar a tu estructura actual de skills |
| Patrón orquestador-workers | Alta | Modelo probado para coordinar agentes |
| Integración MCP | Alta | Estándar para herramientas externas |
| Sistema de permisos/sandbox | Media | Seguridad para ejecución de código |

#### Lo que NO necesitas copiar:

| Aspecto | Por qué evitarlo |
|---------|-----------------|
| Dependencia de Arcade MCP | Añade complejidad y costo innecesario |
| Integración obligatoria con Linear | Demasiado específico para un caso de uso |
| Foco en apps web vanilla | Limita el alcance del sistema |
| 33 dependencias Python | Overhead significativo |

---

## 8. Recomendaciones para Tu Sistema

### Adoptar:

1. **Patrón de agentes especializados** - Cada agente con un propósito claro
2. **Prompts en archivos separados** - Fácil mantenimiento y versionado
3. **Sistema de delegación Task** - El orquestador delega a workers
4. **Herramientas configurables por agente** - No todos necesitan todo

### Adaptar:

1. **Simplificar dependencias** - Tu stack bash/shell es más ligero
2. **Hacer integraciones opcionales** - No forzar Linear/GitHub/Slack
3. **Añadir memoria compartida** - Mejorar la comunicación entre agentes
4. **Soportar más lenguajes/stacks** - No limitarse a web vanilla

### Crear diferente:

1. **Skills como unidades atómicas** - Tu enfoque actual es más modular
2. **Instalación vía CLI** - Más accesible que clonar un repo completo
3. **Agnóstico de plataforma** - Shell scripts funcionan en más lugares

---

## 9. Código/Patrones Interesantes para Estudiar

```
your-claude-engineer/
├── prompts/                    # Prompts de sistema por agente
│   ├── orchestrator_prompt.md
│   ├── linear_agent_prompt.md
│   └── coding_agent_prompt.md
├── src/
│   ├── agents/                 # Definición de agentes
│   ├── tools/                  # Herramientas disponibles
│   └── orchestrator.py         # Lógica de coordinación
└── app_spec.md                 # Especificación de la app a construir
```

---

## 10. Conclusión

**Your Claude Engineer** es una referencia valiosa para entender cómo construir sistemas multi-agente con Claude. Sin embargo, para tu proyecto específico:

- **Úsalo como inspiración arquitectónica**, no como base de código
- **Tu enfoque de skills atómicas es más flexible** que su sistema monolítico
- **El SDK `claude-agent-sdk` es clave** - investígalo directamente
- **Arcade MCP es opcional** - puedes integrar servicios de forma más simple

### Siguiente paso recomendado:

Investigar directamente el `claude-agent-sdk` de Anthropic, que es el componente central que hace funcionar tanto Your Claude Engineer como tu potencial sistema.

---

## Referencias

- Repositorio: https://github.com/coleam00/your-claude-engineer
- Claude Agent SDK: Parte del ecosistema oficial de Anthropic
- Arcade MCP: https://arcade.dev (gateway de autenticación para servicios)

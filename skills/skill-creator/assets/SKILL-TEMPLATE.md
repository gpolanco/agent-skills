---
name: { skill-name }
description: >
  {Brief description of what this skill enables}.
  Trigger: {When the AI should load this skill - be specific}.
license: Apache-2.0
metadata:
  type: {knowledge|tool|hybrid} # OPTIONAL (can be inferred from allowed-tools)
  author: { author-name }
  version: "1.0.0"
  scope: [root]
  auto_invoke: false
allowed-tools: Read
---

# {Skill Title}

## TL;DR (REQUIRED)

* {One-line purpose}
* {What it changes / produces}
* {Hard constraint 1}
* {Hard constraint 2}

---

## When to Use

Use this skill when:

* {Condition 1}
* {Condition 2}
* {Condition 3}

---

## Outputs (Allowed Changes)

### ✅ Allowed

* {Files/directories the agent may create or edit}

### ❌ Not allowed

* {Files/directories the agent must never touch}

---

## Critical Patterns

### ALWAYS

* {Rule that must always be followed}
* {Another always rule}
* {Important pattern to use}

### NEVER

* {Anti-pattern to avoid}
* {Another thing to never do}
* {Common mistake to prevent}

### DEFAULTS

* {Default convention 1}
* {Default convention 2}

---

## Decision Tree

```
{Question 1}? → {Action A}
{Question 2}? → {Action B}
Otherwise     → {Default action}
```

---

## Actions (Tool/Hybrid only)

> Omit this section for Knowledge-only skills.

```bash
{command 1}  # {description}
{command 2}  # {description}
```

---

## Code Examples

> Include code ONLY when it is the essence. Keep examples minimal.

### Example 1: {Description}

```{language}
// ✅ DO: {Good pattern explanation}
{good example code}

// ❌ DON'T: {Bad pattern explanation}
{bad example code}
```

### Example 2: {Description}

```{language}
{minimal, focused example}
```

---

## Resources

* **Advanced Patterns**: [reference/advanced.md](reference/advanced.md)
* **Migration Guide**: [reference/migration.md](reference/migration.md)
* **Related Skills**: {e.g., react-19, tailwind-4, structuring-projects}

---
name: <skill-name>
description: >
  <Clear description of what this skill enforces or automates.>
  Trigger: Use when <explicit condition>.
license: Apache-2.0
metadata:
  type: {knowledge|tool|hybrid} # OPTIONAL (can be inferred from allowed-tools)
  author: <team | org>
  version: "1.0.0"
  scope: [root]
  auto_invoke: false
allowed-tools: Read
---

# <Skill Name>

## TL;DR

One paragraph summary explaining **what problem this skill solves** and **why it exists**.

---

## When to Use

Use this skill when:

* <Condition 1>
* <Condition 2>

Do NOT use this skill when:

* <Anti-condition>

---

## Scope

### In scope

* <Explicitly covered responsibility>

### Out of scope

* <Explicitly excluded responsibility>

---

## Critical Patterns

### ALWAYS

* <Rule that must always be followed>

### NEVER

* <Rule that must never be violated>

---

## Decision Tree

```text
If <condition> → do X
Else if <condition> → do Y
Else → do Z
```

---

## Actions

> Only include this section for **Tool** or **Hybrid** skills.

* Step 1: <What the agent should do>
* Step 2: <Expected outcome>

---

## Cross-references

* None

---

## Resources

* See `reference/` directory for detailed documentation.

<!-- Skill type inferred from allowed-tools -->

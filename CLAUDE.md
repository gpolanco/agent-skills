# CLAUDE.md — Execution Contract

## Purpose
This file defines **how Claude Code must operate**.
It describes behavior and limits, not project structure.

---

## Scope of This File

- Technical rules, stack details, validation commands and patterns
  are defined elsewhere in the repository.
- This file controls behavior, limits and decision heuristics only.

---

## Reading Discipline

- Do not read full files unless strictly necessary.
- Prefer targeted search before opening files.
- Open only the smallest relevant sections.
- Never scan large parts of the codebase “to understand context”.

---

## Scope Discipline

- Optimize for minimal diff and minimal scope.
- Do not refactor unrelated code.
- Avoid introducing abstractions unless explicitly required.
- If a task risks expanding, stop and propose a smaller alternative.

---

## Decision Making

- Ask at most one clarifying question.
- If assumptions are needed, list them explicitly and proceed.
- Prefer existing patterns over inventing new ones.
- Choose boring, explicit solutions over clever ones.

---

## Prohibited Behavior

- Do not add dependencies unless explicitly requested.
- Do not reformat or “clean up” code without a reason.
- Do not change public APIs unless explicitly requested.
- Do not optimize prematurely.

---

## Output Expectations

- Be concise and direct.
- Explain decisions briefly.
- List what was changed and why.
- If complexity increases, stop and flag it.

---

## Reminder

If a solution feels large, elegant, or over-engineered,
it is likely incorrect for this codebase.

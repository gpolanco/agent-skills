# Skill Integration Workflow Guide (v1.1)

This workflow describes **exactly** how to integrate (activate) skills into a project.

## Scope

### You MAY edit

* `AGENTS.md`
* `skills/README.md`

### You MUST NOT edit

* Any `skills/**/SKILL.md`
* Any other project files (source code, configs, etc.)

---

## Phase 0 — Locate the skills directory

Skills are expected to be already downloaded locally.

1. Prefer `skills/` if it exists.
2. Else fallback to `.agent/skills/`.
3. If neither exists, stop and ask the user to run the project’s setup script that creates/downloads skills.

**Define:**

* `SKILLS_DIR` = `skills` or `.agent/skills`

---

## Phase 1 — Contextual analysis

Before suggesting anything, understand the project.

1. Read `package.json`

   * Identify: framework, styling, validation, forms, DB/auth.
2. Read project `README.md` (if present)
3. Check whether `AGENTS.md` exists

   * If it exists, note:

     * currently active skills
     * any custom rules the user added
4. Inspect top-level directory structure

   * monorepo vs single app
   * `/src` vs `/app` vs `/packages`

**Output (text):**

* Detected stack (bullet list)
* Detected skills directory (`SKILLS_DIR`)

---

## Phase 2 — Skill selection

### Goal

Pick the **minimal** set of skills matching the detected stack.

1. List available skills:

```bash
ls -1 "${SKILLS_DIR}" | sort
```

2. Select matching skills.

**Rules:**

* Don’t activate skills that clearly don’t apply.
* If the project already has active skills, keep them unless they are wrong/conflicting.

**Output (text):**

* Proposed active skills (✅)
* Remaining available skills (📦)

---

## Phase 3 — The pitch (confirmation)

Present findings and ask for confirmation **before writing**.

Template:

* “I detected: … (stack)”
* “I propose activating: … (skills)”
* “Shall I update `AGENTS.md` and `skills/README.md` accordingly?”

If the user says yes → continue.

---

## Phase 4 — Orchestration (write files)

### Step 4.1 — Locate canonical templates

1. Read templates from the local skills directory:
   - `${SKILLS_DIR}/../templates/AGENTS.template.md`
   - `${SKILLS_DIR}/../templates/SKILLS_README.template.md`
2. If not found locally, fallback to remote fetch:
   - `https://raw.githubusercontent.com/gpolanco/skills-as-context/main/templates/...`
3. If neither works, stop and ask the user.

Rules:

* **Copy exactly**.
* Only fill placeholders.
* Do not change headings or table structures.

### Step 4.2 — Update `AGENTS.md`

1. If `AGENTS.md` does not exist:

   * Create it from the template.
2. If `AGENTS.md` exists:

   * Prefer replacing its template sections while preserving user custom blocks.
   * If preservation is unclear, stop and ask the user whether to overwrite or merge.

Populate:

* Project name / purpose placeholders
* Stack summary
* Skills table(s): ensure all referenced paths point to `${SKILLS_DIR}/<skill>`

### Step 4.3 — Update `skills/README.md`

1. Create/update from template.
2. List every skill directory under `${SKILLS_DIR}`.
3. Mark skills as:

* ✅ Active (selected)
* 📦 Available (not selected)

---

## Phase 5 — Verification

1. Verify paths exist:

```bash
for d in $(ls -1 "${SKILLS_DIR}"); do
  test -f "${SKILLS_DIR}/${d}/SKILL.md" || echo "Missing SKILL.md for ${d}"
done
```

2. Verify `AGENTS.md` references valid skill paths.
3. Re-run the skill list:

   * Ensure all skills are present in `skills/README.md`.

**Output (text):**

* “Integration complete”
* Active skills list
* Files changed: `AGENTS.md`, `skills/README.md`

---

## Edge cases

### Existing custom rules in `AGENTS.md`

* Preserve custom sections whenever possible.
* If unsure, ask: overwrite vs merge.

### Skill naming mismatches

* Prefer directory names as canonical IDs.
* Don’t “rename” skills during integration.

### Conflicting skills

* Do not activate both.
* Recommend one and justify briefly.


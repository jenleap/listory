# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features not in the project spec
- Never delete files without clarification

## Workflow (AI Task Execution System)

All work is executed through a structured task system.

Work begins when the user says:

"Begin work on this feature"

---

### Step 1 — Generate Tasks

When instructed to begin work on a feature:

1. Read `@docs/state.json` for `current_feature`
2. Break the feature into small, atomic tasks

Each task must:
- Be completable in 1–2 hours
- Affect a small number of files
- Have clear acceptance criteria
- Be independently executable

**Patch Awareness**

If working on a patch:
- Tasks must map directly to patch acceptance criteria
- Avoid creating tasks outside patch scope
- Prefer modifying existing files over creating new structures


### Task File Creation

Create one file per task in:

`docs/tasks/<feature_number>`


### File Naming Convention

`T<number>-<short-description>.md`


Examples:
- `001-initial-setup.md`
- `002-frontend-stream-handler.md`


### Task File Format (REQUIRED)

Each task file must follow the structure found in:

`docs/tasks/task-template.md`

Task template must be strictly followed. No sections may be omitted.

### State Initialization

After generating all tasks:
- Create or update `docs/state.json`
Add all tasks:
```json
{
  "current_task_id": "001-initial-setup",
  "tasks": [
    { "id": "001-initial-setup", "status": "pending", "attempts": 0, "errors": null },
    { "id": "002-frontend-stream-handler", "status": "pending", "attempts": 0, "errors": null }
  ]
}
```

### Rules
- Do not skip task creation
- Do not begin implementation until tasks are created
- Tasks must be ordered logically
- Use depends_on only if necessary

### Task Ordering Rules

- Tasks must be strictly ordered for execution
- Each task should depend only on earlier tasks
- Avoid circular dependencies
- If ordering is unclear, prefer linear sequence

---

### Step 2 — Execute Tasks (Loop)

AI must NOT implement a task without first opening its task file.
All implementation must be derived from the task file only.

For each task:

1. Read `docs/state.json`
2. Identify `current_task_id`
3. Open corresponding task file in `docs/tasks/<feature_number>`
4. Update task status to `in_progress`
5. Append log event: `task_started`

6. Implement ONLY the current task

7. If successful:
   - Update task status in `docs/state.json` to `completed`
   - Append log event: `task_completed`

8. If failed:
   - Update task status to `failed`
   - Set `errors`
   - Append log event: `task_failed`
    - Do NOT proceed to next task
    - Retry logic is handled in Step 3 only

9. Move to next task by updating `current_task_id`
    - Only update `current_task_id` after:
        - The current task is marked `completed` OR `failed`

---

### Step 3 — Iterate on Failures

- If a task fails:
    - Retry up to 2–3 times
    - Increment attempts
    - Log task_retried

- If still failing:
    - Stop and explain issue
    - Ask for clarification

---

### Step 4 — Complete Feature

- When all tasks are completed:
    - Verify in browser
- Run:
    - npm run test
    - npm run build
- Mark feature as complete in current-feature.md

---

### Step 5 — Git Workflow
- Create branch: feature/[feature-name]
- Implement via task system
- Ask before committing
- Commit only when:
    - Build passes
    - Tests pass

---

## Patch Workflow (Incremental Changes)

Patches are incremental updates applied after a feature has already been implemented.

A patch may:
- Fix bugs
- Adjust behavior
- Add small enhancements
- Modify existing logic

---

### When to Use a Patch

Use a patch instead of a new feature when:
- The change affects an existing feature
- No new standalone feature is being introduced
- The scope is limited and localized

---

### Patch Input

Before beginning work on a patch, the AI must:

1. Read the patch document from:
   docs/patches/<patch-name>.md

2. Identify:
   - Affected features
   - Scope of change
   - Acceptance criteria

---

### Patch Execution Rules

- All patches MUST go through the task system
- Do NOT implement patches directly without generating tasks
- Follow the same workflow defined for features

---

### Patch Task Generation

When instructed:

"Begin work on this patch"

The AI must:

1. Treat the patch as a mini-feature
2. Generate tasks only for affected areas
3. Ensure each task:
   - Is small and atomic
   - Has clear acceptance criteria
   - Maps directly to patch requirements

---

### Patch Constraints

- Do not modify unrelated parts of the system
- Preserve existing architecture unless explicitly instructed
- Prefer minimal, surgical changes
- Avoid introducing new abstractions unless required

---

### Spec Consistency Rule

If a patch changes system behavior:

- Update the relevant feature spec(s)
OR
- Add an entry to docs/spec-changelog.md

This ensures:
- Specs remain the source of truth
- No divergence between implementation and documentation

---

### Patch Awareness (Task Generation)

When generating tasks for a patch:

- Tasks must map directly to patch acceptance criteria
- Do not expand scope beyond the patch
- Prefer modifying existing files over creating new ones

---

### Code Changes (Patch-Specific Rules)

When implementing patches:

- Make the smallest possible change to satisfy requirements
- Do not refactor unrelated code
- Do not add "nice to have" improvements
- Keep changes tightly scoped to the patch document

---

## AI Output Contracts

AI must follow strict output formats.

---

### Task Update Output

When updating task state:

```json
{
  "task_id": "001-initial-setup",
  "status": "completed",
  "error": null
}
```
Rules:
- Output valid JSON only
- No explanations
- Do not include extra fields

### Logging Output

When logging an event:
```json
{
  "timestamp": "2026-04-10T10:42:00Z",
  "event": "task_completed",
  "feature_id": "001-scaffold-app",
  "task_id": "001-initial-setup",
  "notes": ""
}
```

Rules:
- One JSON object per line
- Logs are append-only
- Do not modify previous entries
- Do not include free-form text outside JSON

### Code Output
- Only output code unless explanation is requested
- Follow project structure
- Do not include unrelated changes

---

## Task Generation Rules

Tasks must be optimized for execution, not readability.

### Good Tasks

- Clear, step-by-step implementation
- Explicit file scope
- No ambiguity
- Easy to verify

### Bad Tasks

- Vague instructions ("add streaming support")
- Large scope
- Multiple unrelated goals
- Missing acceptance criteria

### Granularity Rule

If a task has more than 5–7 implementation steps, split it into multiple tasks.

---

## Task File Rules

- Task files are created during task generation
- Do not modify task files during execution
- Only update tasks if explicitly instructed
- Execution must strictly follow the task file

## Branching

We will create a new branch for every feature/fix. Name branch **feature/[feature]** or **fix[fix]**, etc. Ask to delete the branch once merged.

## Commits

- Ask before committing (don't auto-commit)
- Use conventional commit messages (feat:, fix:, chore:, etc.)
- Keep commits focused (one feature/fix per commit)
- Never put "Generated With Claude" in the commit messages

## When Stuck

- If something isn't working after 2-3 attempts, stop and explain the issue
- Don't keep trying random fixes
- Ask for clarification if requirements are unclear
- If a task fails repeatedly:
  - Update `state.json` with `failed`
  - Log the error
  - Stop and ask for clarification

## Code Changes

- Make minimal changes to accomplish the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features
- Preserve existing patterns in the codebase

When implementing patches:
- Do not expand scope beyond the patch document
- Do not introduce new abstractions unless required

## Code Review

Review AI-generated code periodically, especially for:

- Security (auth checks, input validation)
- Performance (unnecessary re-renders, N+1 queries)
- Logic errors (edge cases)
- Patterns (matches existing codebase?)
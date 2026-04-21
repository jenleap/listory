# Listory

Listory is an offline-first mobile app that allows users within a household to create, manage, and share lists.

### Context Files
Read the following to get the full context of the project:

@docs/project-overview.md
@docs/system-rules.md
@docs/coding-standards.md
@docs/ai-instructions.md
@docs/state.json

IMPORTANT: Do not add Claude to any commit messages.

## AI Execution Model

This project uses a structured AI execution system with:

- `docs/state.json` → current run state (source of truth)
- `docs/logs.jsonl` → append-only execution log
- `docs/current-feature.md` → feature specification

### Key Principles

- Treat all work as **task-based execution**
- Always follow the **current_task_id** in `state.json`
- Never skip tasks or work ahead
- Do not infer state — always read from `state.json`

---

## State Management

The `state.json` file contains:

- `current_task_id`
- `tasks[]` with statuses (`pending`, `in_progress`, `completed`, `failed`)

### Rules

- Only update the **current task**
- Do not modify unrelated tasks
- Do not change structure of `state.json`
- Only update:
  - `status`
  - `attempts` (if retrying)
  - `last_error` (if failed)

---

## Logging

All actions must be logged to `docs/logs.jsonl`.

### Log Format (JSONL)

Each line must be a valid JSON object:

```json
{"timestamp":"ISO-8601","event":"task_started","task_id":"T1"}
```

### Required Events
- task_started
- task_completed
- task_failed
- task_retried

### Rules
- Logs are append-only
- Never modify or delete previous log entries
- Do not log free-form text

---

## Task Execution Rules

For every task:
- Read state.json
- Identify current_task_id
- Mark task as in_progress
- Log task_started
- Implement only that task
- If successful:
    - Mark task as completed
    - Log task_completed
- If failed:
    - Mark task as failed
    - Add last_error
    - Log task_failed

---

## Constraints
- Do not work on multiple tasks at once
- Do not create new tasks unless explicitly instructed
- Do not modify completed tasks
- Do not proceed if current_task_id is unclear
- Do not introduce new frameworks without instruction

---

## Important
- Never include Claude or AI references in commit messages
- Follow all existing coding standards
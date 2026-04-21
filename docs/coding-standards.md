# Coding Standards - Listory

This document defines coding standards for AI-generated and human-written code in the Listory project. These rules ensure consistency, predictability, and safe offline-first behavior.

---

# 1. General Principles

- Prefer simplicity over abstraction
- Keep logic close to where it is used
- Avoid premature optimization
- All code must assume offline-first behavior
- Never rely on server availability for core functionality
- UI must always reflect local database state first

---

# 2. Project Architecture Rules

## Separation of Concerns

- `mobile/` → React Native UI + local state + SQLite access
- `server/` → Infrastructure only (Postgres, sync services)
- `shared/` → Optional shared types and utilities

## Feature Structure

All app logic must live inside feature folders:
```text
features/
items/
lists/
sections/
templates/
sync/
```


Each feature may contain:
- UI components
- hooks
- service functions
- local DB operations

---

# 3. Data Rules

## IDs

- All IDs MUST be UUID v4
- Generated on the client

## Timestamps

- Use ISO 8601 strings
- Always set:
  - `created_at`
  - `updated_at`

## Deletion

- NEVER hard delete records
- Always use:
  - `deleted_at != null`

---

# 4. State Management Rules

- Local SQLite is the source of truth for UI
- React state is a projection of SQLite
- Never store permanent business data in React state alone
- State libraries (e.g. Zustand) may be used only as caching layer

---

# 5. Database Rules

## SQLite (Mobile)

- All reads must come from SQLite
- All writes must be written to SQLite first
- Sync happens after local write

## Postgres (Server)

- Acts as global reconciliation layer
- Must enforce Row-Level Security (RLS)
- Must never trust client input without validation

---

# 6. Sync Rules

- Sync is asynchronous and non-blocking
- Local write ALWAYS succeeds even if offline
- Sync is eventually consistent
- Conflicts resolved using:
  - Last Write Wins (`updated_at`)
  - `deleted_at` takes precedence over updates

---

# 7. UI/UX Rules

- UI must update immediately after local write
- No loading states for local actions
- All edits must be optimistic
- Empty inputs:
  - Create → discard record
  - Edit → delete or reject update

---

# 8. Feature Implementation Rules

Each feature MUST include:

- Input validation
- Local DB mutation
- UI update behavior
- Sync behavior
- Edge cases

AI-generated features must NOT omit any of these sections.

---

# 9. Ordering Rules

- Use numeric `order` fields
- Sorting is always ascending
- Use gap strategy (e.g. 10, 20, 30)
- Reordering must only update affected records
- Never fully rewrite entire lists unless necessary

---

# 10. Naming Conventions

## Files
- kebab-case for files
- Example: `create-item.ts`

## Variables
- camelCase
- Example: `listItems`

## Database fields
- snake_case
- Example: `updated_at`

## Components
- PascalCase
- Example: `ListItemRow`

---

# 11. Error Handling Rules

- Never crash the UI for expected errors
- All DB operations must fail gracefully
- Sync errors must not affect local functionality
- Retry sync automatically in background

---

# 12. Anti-Patterns (DO NOT DO)

- ❌ Writing directly to server without local DB update
- ❌ Hard deleting records
- ❌ Duplicating business logic across features
- ❌ Using server state as UI source of truth
- ❌ Mixing sync logic inside UI components
- ❌ Creating global “god stores”

---

# 13. AI Code Generation Rules

When generating code, AI must:

- Follow feature spec structure strictly
- Never assume missing schema fields
- Prefer explicit code over abstractions
- Avoid introducing new libraries without request
- Keep changes localized to feature scope
- Respect existing DB and sync rules

---

# 14. Required Feature Structure

Every feature implementation must include:

- `/ui` (if needed)
- `/hooks`
- `/services`
- `/db`
- `/types`

Even if some folders are empty placeholders.
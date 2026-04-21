# Feature: Create List

## Context
- Triggered from Main Screen

---

## Inputs
- name (string)

---

## Validation
- Must not be empty
- Must be unique per user (case-insensitive, trimmed)

---

## Local Behavior

- Create new List record:
  - id: UUID
  - name
  - owner_id = current user
  - is_template = false
  - created_at = now
  - updated_at = now
  - deleted_at = null

- Insert into SQLite

---

## Sync Behavior

- Included in next push:
  - `updated_at > last_synced_at`

---

## UI Behavior

- Navigate to new List screen
- Show empty list state

---

## Edge Cases

- Duplicate name → reject
- Network offline → still succeeds locally
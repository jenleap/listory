# Feature: Create Section

## Context
- List Screen

---

## Inputs
- list_id
- name (string)

---

## Validation

- Must not be empty (trimmed)
- Must be unique within list

---

## Local Behavior

- Create Section:
  - id: UUID
  - list_id
  - name
  - order = append to end
  - created_at = now
  - updated_at = now
  - deleted_at = null

- Save to SQLite

---

## Sync Behavior

- Included in next push

---

## UI Behavior

- Section appears immediately at bottom
- Input shown on creation
- Save on blur
- If empty → discard

---

## Edge Cases

- Duplicate name → reject
- List deleted → section removed on next sync
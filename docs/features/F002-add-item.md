# Feature: Add Item

## Context
- List Screen

---

## Inputs
- list_id
- optional section_id
- text (string)

---

## Validation

- Text must be non-empty (trimmed)
- Must be unique within list (case-insensitive)

---

## Local Behavior

- Create new Item:
  - id: UUID
  - text
  - list_id
  - section_id (nullable)
  - completed = false
  - order = append to end
  - created_at = now
  - updated_at = now
  - deleted_at = null

- Insert into SQLite

---

## Sync Behavior

- Included in next push

---

## UI Behavior

- Input appears immediately
- Save on blur
- If empty → discard

---

## Edge Cases

- Section deleted before sync → set section_id = null
- Duplicate detected → reject
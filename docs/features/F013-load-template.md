# Feature: Load Template Into List

## Context
- List Screen (ellipsis menu)

---

## Inputs
- list_id
- template_id

---

## Validation

- Template must exist
- Must belong to user

---

## Local Behavior

For each section in template:
- Create new section with new UUID

For each item:
- Normalize text (trim, lowercase)
- If item already exists in list → skip
- Else:
  - Create new item
  - completed = false
  - assign correct section

- Save all to SQLite

---

## Sync Behavior

- All new records included in next push

---

## UI Behavior

- Items appear immediately in list

---

## Edge Cases

- Duplicate items skipped
- Section mismatch → create section
# Feature: Clear Completed Items

## Context
- List Screen (ellipsis menu)

---

## Inputs
- list_id

---

## Validation

- User must have write or owner access

---

## Local Behavior

- For all items in list where:
  - completed = true
  - deleted_at = null

- Set:
  - deleted_at = now
  - updated_at = now

- Save to SQLite

---

## Sync Behavior

- All affected items included in next push

---

## UI Behavior

- Completed items removed immediately

---

## Edge Cases

- No completed items → no-op
- Items updated elsewhere → resolved via LWW
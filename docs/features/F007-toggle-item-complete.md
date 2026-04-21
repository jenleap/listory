# Feature: Toggle Item Complete

## Context
- List Screen

---

## Inputs
- item_id

---

## Validation

- Item must exist
- User must have write or owner access

---

## Local Behavior

- Toggle:
  - completed = !completed
  - updated_at = now

- Save to SQLite

---

## Sync Behavior

- Included in next push

---

## UI Behavior

- Checkbox updates immediately

---

## Edge Cases

- Item deleted on another device → removed on sync
- Conflicting toggles → last write wins
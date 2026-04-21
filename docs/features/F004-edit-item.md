# Feature: Edit Item

## Context
- List Screen
- Triggered when user taps item text

---

## Inputs
- item_id
- new_text (string)

---

## Validation

- Must not be empty (after trim)
- Must be unique within list (case-insensitive)

---

## Local Behavior

- Update Item:
  - text = new_text
  - updated_at = now

- Save to SQLite

---

## Sync Behavior

- Included in next push

---

## UI Behavior

- Item enters edit mode on tap
- Input replaces text
- Save on blur
- Exit edit mode after save

---

## Edge Cases

- Empty text → delete item instead
- Duplicate detected → reject update
- Item deleted on another device → removed on next sync
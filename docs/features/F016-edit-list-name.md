# Feature: Edit List Name

## Context
- List Screen (tap list name)

---

## Inputs

- list_id
- new_name (string)

---

## Validation

- Must not be empty (trimmed)
- Must be unique per user (case-insensitive)
- User must have:
  - owner access OR
  - write access (if allowed by product decision)

---

## Local Behavior

- Update List:
  - name = new_name (trimmed)
  - updated_at = now

- Save to SQLite

---

## Sync Behavior

- Included in next push

---

## UI Behavior

- Tap name → enters edit mode
- Input replaces title
- Save on blur or submit
- Exit edit mode after save

---

## Edge Cases

- Duplicate name → reject update
- List deleted on another device → removed on next sync
- Unauthorized edit → reverted on sync

---

## Constraints

- Name must remain unique per user
- Templates and Lists share same namespace (no duplicates across both)
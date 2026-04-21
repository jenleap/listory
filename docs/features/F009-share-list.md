# Feature: Share List

## Context
- List Screen (ellipsis menu)

---

## Inputs
- list_id
- target_user_id
- access ("write" | "read")

---

## Validation

- Current user must be owner
- Target user must exist
- Cannot share with self

---

## Local Behavior

- Create ListUser record:
  - list_id
  - user_id
  - access
  - created_at = now
  - updated_at = now
  - deleted_at = null

- Save to SQLite

---

## Sync Behavior

- Included in next push

---

## UI Behavior

- User appears in shared users list

---

## Edge Cases

- Duplicate share → update access instead
- User removed elsewhere → resolved on sync
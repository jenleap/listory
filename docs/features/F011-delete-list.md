# Feature: Delete List

## Context
- List Screen (ellipsis menu)

---

## Inputs
- list_id

---

## Validation

- User must be owner
- No other users have write access

---

## Local Behavior

- Soft delete list:
  - deleted_at = now
  - updated_at = now

- Soft delete:
  - all sections
  - all items
  - all ListUser records

- Save to SQLite

---

## Sync Behavior

- Included in next push

---

## UI Behavior

- Navigate to Main Screen
- List removed immediately

---

## Edge Cases

- Shared users exist → reject
- Already deleted → no-op
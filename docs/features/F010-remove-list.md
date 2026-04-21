# Feature: Remove Self From List

## Context
- List Screen (ellipsis menu)

---

## Inputs
- list_id
- current_user_id

---

## Validation

- User must not be owner

---

## Local Behavior

- Soft delete ListUser record:
  - deleted_at = now
  - updated_at = now

- Save to SQLite

---

## Sync Behavior

- Included in next push

---

## UI Behavior

- List removed from Main Screen immediately

---

## Edge Cases

- Already removed → no-op
- Owner cannot perform this action
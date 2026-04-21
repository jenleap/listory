# Feature: Delete Item

## Context
- List Screen
- Triggered from item edit mode

---

## Inputs
- item_id

---

## Validation

- Item must exist
- User must have write or owner access

---

## Local Behavior

- Soft delete item:
  - deleted_at = now
  - updated_at = now

- Save to SQLite

---

## Sync Behavior

- Included in next push
- Delete propagated to all clients

---

## UI Behavior

- Item is immediately removed from UI

---

## Edge Cases

- Item already deleted → no-op
- Item edited on another device → delete wins if newer
# Feature: Reorder Sections (Drag and Drop)

## Context
- List Screen
- Applies only to sections within a list

---

## Inputs

- section_id
- destination_index (integer)

---

## Validation

- Section must exist
- User must have write or owner access

---

## Local Behavior

### 1. Get Sections

- Fetch all sections in list:
  - list_id
  - deleted_at = null

---

### 2. Reorder

- Remove section from current position
- Insert at destination_index

---

### 3. Recalculate Order

- Assign new order values:
  - Use gap strategy (10, 20, 30)

- For affected sections:
  - update:
    - order
    - updated_at = now

---

### 4. Save to SQLite

- Persist updated sections

---

## Sync Behavior

- Included in next push

---

## UI Behavior

- Drag section vertically
- Drop updates order immediately

---

## Edge Cases

- Dropped in same position → no-op
- Section deleted during reorder → cancel operation
- Concurrent reorder on another device → LWW applies

---

## Constraints

- Section ordering must be consistent across clients after sync
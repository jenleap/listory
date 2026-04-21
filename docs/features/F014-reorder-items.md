# Feature: Reorder Items (Drag and Drop)

## Context
- List Screen
- Applies to:
  - Items within same section
  - Items moved across sections
  - Items moved between section ↔ main list

---

## Inputs

- item_id
- source_section_id (nullable)
- destination_section_id (nullable)
- destination_index (integer)

---

## Validation

- Item must exist
- User must have write or owner access
- Destination section must exist (if not null)

---

## Local Behavior

### 1. Determine Scope

- If destination_section_id = null:
  → item belongs to main list
- Else:
  → item belongs to destination section

---

### 2. Update Item Location

- Update:
  - section_id = destination_section_id
  - updated_at = now

---

### 3. Recalculate Order (Destination Group)

- Get all items in destination group:
  - same list_id
  - same section_id (including null)

- Insert item at destination_index

- Reassign order values:
  - Use gap strategy (e.g., 10, 20, 30)
  - Only update affected items

- For each updated item:
  - order = new value
  - updated_at = now

---

### 4. Update Source Group (if moved across groups)

- Recalculate order for source group (remove gap)
- Update affected items:
  - order
  - updated_at

---

### 5. Save to SQLite

- Persist all modified items

---

## Sync Behavior

- All updated items included in next push

---

## UI Behavior

- Drag interaction moves item visually
- Drop triggers reorder logic
- UI updates immediately

---

## Edge Cases

- Dropped at same position → no-op
- Destination section deleted → fallback to main list
- Item deleted during drag → cancel operation
- Conflicting reorders across devices → resolved via LWW

---

## Constraints

- Ordering must remain stable and deterministic
- Minimize number of updated records
# Feature: Create Template

## Context
- List Screen (ellipsis menu → "Save As Template")

---

## Inputs
- source_list_id
- template_name (string)

---

## Validation

- Template name must not be empty (trimmed)
- Must be unique per user (case-insensitive)
- Source list must exist
- User must have access (read or higher)

---

## Local Behavior

### 1. Create Template List

- Create new List:
  - id: UUID
  - name = template_name
  - owner_id = current user
  - is_template = true
  - created_at = now
  - updated_at = now
  - deleted_at = null

---

### 2. Copy Sections

For each section in source list:
- Create new Section:
  - id: UUID
  - list_id = template_id
  - name (same)
  - order (same)
  - created_at = now
  - updated_at = now
  - deleted_at = null

- Maintain mapping:
  - old_section_id → new_section_id

---

### 3. Copy Items

For each item in source list where:
- deleted_at = null

Create new Item:
- id: UUID
- text (same)
- list_id = template_id
- section_id:
  - mapped from section map
  - or null if not in section
- completed = false
- order (same)
- created_at = now
- updated_at = now
- deleted_at = null

---

### 4. Save to SQLite

- Insert all new records locally

---

## Sync Behavior

- All created records included in next push

---

## UI Behavior

- Template appears in Templates section on Main Screen
- No navigation required (stay on List screen)
- Optional: show success feedback (toast/snackbar)

---

## Edge Cases

- Duplicate template name → reject
- Source list deleted during operation → abort
- Sections missing during copy → assign items to null section
- Items with empty text → skip

---

## Constraints

- Templates:
  - Cannot contain completed items
  - Cannot be shared
  - Are only visible to owner
# Task T003: Item DB Operations

## Feature
F002 - Add Item

## Description
Implement low-level SQLite read/write functions for items.

## Files
- `mobile/features/items/db/items-db.ts` (create)

## Implementation Steps
1. Create the directory `mobile/features/items/db/`
2. Create `items-db.ts` and import `db` from `'../../../db/client'` and `Item` from `'../types'`
3. Implement `insertItem(item: Item): void`
   - Run an INSERT with all columns: id, text, list_id, section_id, completed (0/1), order, created_at, updated_at, deleted_at
4. Implement `getItemsByList(list_id: string): Item[]`
   - SELECT all rows WHERE list_id = ? AND deleted_at IS NULL
   - ORDER BY "order" ASC
   - Map `completed` integer → boolean before returning
5. Implement `itemTextExistsInList(text: string, list_id: string): boolean`
   - SELECT id WHERE list_id = ? AND deleted_at IS NULL AND LOWER(TRIM(text)) = LOWER(TRIM(?))
   - Return `row != null`

## Constraints
- Use `db.runSync`, `db.getAllSync`, `db.getFirstSync` (same pattern as `lists-db.ts`)
- Map `completed` integer to boolean in `getItemsByList` (SQLite stores as 0/1)
- Do not add business logic here

## Acceptance Criteria
- `insertItem` writes a row to SQLite
- `getItemsByList` returns items for the given list, sorted by order, excluding soft-deleted rows
- `itemTextExistsInList` returns true when a matching (case-insensitive, trimmed) text exists

## Test Steps
1. Call `insertItem` with a test item and verify `getItemsByList` returns it
2. Call `itemTextExistsInList` with the same text — should return true
3. Call with different capitalisation — should still return true

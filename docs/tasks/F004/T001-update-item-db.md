# Task T001: Add updateItem and softDeleteItem to items-db

## Feature
F004 - Edit Item

## Description
Add two new DB operations to `items-db.ts`: `updateItem` for persisting text edits, and `softDeleteItem` for the empty-text edge case (required by F004 spec).

## Files
- `mobile/features/items/db/items-db.ts`

## Implementation Steps
1. Add `updateItem(id: string, text: string, updatedAt: string): void` using `db.runSync` to UPDATE the row's `text` and `updated_at` WHERE `id = ?`
2. Add `softDeleteItem(id: string, deletedAt: string, updatedAt: string): void` using `db.runSync` to UPDATE `deleted_at` and `updated_at` WHERE `id = ?`
3. Add `itemTextExistsInListExcluding(text: string, list_id: string, excludeId: string): boolean` using `db.getFirstSync` — same query as `itemTextExistsInList` but with `AND id != ?` to allow self-match during edit

## Constraints
- Use `db.runSync` and `db.getFirstSync` (existing patterns in the file)
- snake_case for DB fields
- No hard deletes — soft delete only

## Acceptance Criteria
- `updateItem` updates `text` and `updated_at` for the given id
- `softDeleteItem` sets `deleted_at` and `updated_at` for the given id
- `itemTextExistsInListExcluding` returns false when only the item being edited matches the text

## Test Steps
1. Call `updateItem` then `getItemsByList` — confirm updated text is returned
2. Call `softDeleteItem` then `getItemsByList` — confirm item no longer appears
3. Call `itemTextExistsInListExcluding` with same id as matching item — confirm returns false

## Notes
`softDeleteItem` is a prerequisite for the empty-text-deletes-item edge case in F004. F005 (Delete Item) will build on this same operation.

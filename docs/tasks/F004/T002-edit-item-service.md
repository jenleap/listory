# Task T002: Add editItem to item-service

## Feature
F004 - Edit Item

## Description
Add `editItem` function to `item-service.ts` that validates input, handles the empty-text → delete edge case, checks uniqueness (excluding self), and persists to SQLite.

## Files
- `mobile/features/items/services/item-service.ts`
- `mobile/features/items/types/index.ts`

## Implementation Steps
1. In `types/index.ts`, add `EditItemInput` type:
   ```ts
   export type EditItemInput = {
     id: string;
     list_id: string;
     new_text: string;
   };
   ```
2. Add `EditItemResult` union type in `item-service.ts`:
   ```ts
   type EditItemResult =
     | { success: true; deleted: false; item: Item }
     | { success: true; deleted: true }
     | { success: false; error: string };
   ```
3. Add `editItem(input: EditItemInput): EditItemResult` function:
   - Trim `new_text`
   - If trimmed is empty → call `softDeleteItem(id, now, now)` → return `{ success: true, deleted: true }`
   - If `itemTextExistsInListExcluding(trimmed, list_id, id)` → return `{ success: false, error: 'An item with this name already exists' }`
   - Call `updateItem(id, trimmed, now)`
   - Return `{ success: true, deleted: false, item: { ...existing fields with updated text and updated_at } }`
4. To build the returned `Item`, call `getItemsByList(list_id)` and find the updated row by id after the write, OR construct the Item from known fields (prefer reading from DB to stay consistent)

## Constraints
- Import only from existing db functions added in T001
- Follow same pattern as `addItem` in the same file
- No server calls — local only
- `now` = `new Date().toISOString()`

## Acceptance Criteria
- Empty text triggers soft delete and returns `{ success: true, deleted: true }`
- Duplicate name returns `{ success: false, error: '...' }`
- Valid unique text updates item and returns `{ success: true, deleted: false, item }`

## Test Steps
1. Call `editItem` with empty string — confirm item removed from `getItemsByList`
2. Call `editItem` with a name already used by another item in same list — confirm error returned
3. Call `editItem` with same text as current item — confirm success (no false duplicate)
4. Call `editItem` with new valid text — confirm updated item returned

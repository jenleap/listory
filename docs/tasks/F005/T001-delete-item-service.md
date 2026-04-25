# Task T001: Add deleteItem service function

## Feature
F005 - Delete Item

## Description
Add a `deleteItem` function to `item-service.ts` that soft-deletes an item by ID. Handles the "already deleted" no-op edge case and validates item existence.

## Files
- `mobile/features/items/services/item-service.ts` (modify)
- `mobile/features/items/types/index.ts` (modify — add DeleteItemInput type)

## Implementation Steps
1. Open `mobile/features/items/types/index.ts` and add:
   ```ts
   export type DeleteItemInput = {
     id: string;
   };
   ```
2. Open `mobile/features/items/services/item-service.ts`
3. Add `DeleteItemInput` to the import from `../types`
4. Add `getItemById` to the import from `../db/items-db` if not already imported (it is already imported)
5. Define the result type:
   ```ts
   type DeleteItemResult =
     | { success: true }
     | { success: false; error: string };
   ```
6. Implement the function:
   ```ts
   export function deleteItem(input: DeleteItemInput): DeleteItemResult {
     const item = getItemById(input.id);

     if (item == null) {
       return { success: false, error: 'Item not found' };
     }

     if (item.deleted_at != null) {
       return { success: true };
     }

     const now = new Date().toISOString();
     softDeleteItem(input.id, now, now);

     return { success: true };
   }
   ```

## Constraints
- Use existing `softDeleteItem` from `items-db.ts` — do not write new DB logic
- Use existing `getItemById` from `items-db.ts` — already imported
- Do not modify any other function in the file

## Acceptance Criteria
- `deleteItem` with a valid, non-deleted item sets `deleted_at` and `updated_at` in SQLite
- `deleteItem` with an already-deleted item returns `{ success: true }` without modifying DB
- `deleteItem` with an unknown id returns `{ success: false, error: 'Item not found' }`

## Test Steps
1. Call `deleteItem` with a valid item id — item disappears from `getItemsByList`
2. Call `deleteItem` again on the same id — returns success without error
3. Call `deleteItem` with a non-existent id — returns error

## Notes
`softDeleteItem` is already implemented in `items-db.ts` (line 84). No new DB work needed.

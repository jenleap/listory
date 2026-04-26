# Task T002: Add ToggleItemInput type and toggleItem service

## Feature
F007 - Toggle Item Complete

## Description
Add a `ToggleItemInput` type to the items types file and implement a `toggleItem` function in `item-service.ts` that validates the item exists and flips its `completed` state.

## Files
- `mobile/features/items/types/index.ts` (modify)
- `mobile/features/items/services/item-service.ts` (modify)

## Implementation Steps
1. Open `mobile/features/items/types/index.ts` and add at the bottom:
   ```ts
   export interface ToggleItemInput {
     id: string;
   }
   ```
2. Open `mobile/features/items/services/item-service.ts`
3. Add `ToggleItemInput` to the import from `../types`
4. Add `toggleItemComplete` to the import from `../db/items-db`
5. Define the result type and implement the function:
   ```ts
   type ToggleItemResult =
     | { success: true; item: Item }
     | { success: false; error: string };

   export function toggleItem(input: ToggleItemInput): ToggleItemResult {
     const item = getItemById(input.id);

     if (item == null) {
       return { success: false, error: 'Item not found' };
     }

     const now = new Date().toISOString();
     toggleItemComplete(input.id, !item.completed, now);

     const updated = getItemById(input.id);
     return { success: true, item: updated! };
   }
   ```

## Constraints
- Use existing `getItemById` from `items-db.ts` (already imported)
- Use `toggleItemComplete` from T001 — do not write new DB logic here
- Do not modify existing functions

## Acceptance Criteria
- `toggleItem` with a valid item flips `completed` and returns updated item
- `toggleItem` with an unknown id returns `{ success: false, error: 'Item not found' }`
- `updated_at` is set to current timestamp on every toggle

## Test Steps
1. Call `toggleItem` on an incomplete item — returned item has `completed === true`
2. Call `toggleItem` again on same item — returned item has `completed === false`
3. Call `toggleItem` with a non-existent id — returns error

## Notes
Follows the same validation + DB call + re-fetch pattern used by `editItem`.

# Task T001: Add clearCompletedItems to items-db

## Feature
F008 - Clear Completed Items

## Description
Add a `clearCompletedItems` function to `items-db.ts` that soft-deletes all completed, non-deleted items for a given list.

## Files
- `mobile/features/items/db/items-db.ts` (modify)

## Implementation Steps
1. Open `mobile/features/items/db/items-db.ts`
2. Add the following function at the bottom of the file:
   ```ts
   export function clearCompletedItems(list_id: string, deletedAt: string, updatedAt: string): void {
     db.runSync(
       `UPDATE items SET deleted_at = ?, updated_at = ? WHERE list_id = ? AND completed = 1 AND deleted_at IS NULL`,
       [deletedAt, updatedAt, list_id]
     );
   }
   ```

## Constraints
- Use `db.runSync` (existing pattern in the file)
- Do not modify any existing functions
- Single SQL UPDATE statement — no per-item loops

## Acceptance Criteria
- `clearCompletedItems` sets `deleted_at` and `updated_at` on all completed, non-deleted items for the given `list_id`
- Items already soft-deleted are not touched
- Incomplete items (`completed = 0`) are not touched

## Test Steps
1. Insert several items: some completed, some not, one already deleted
2. Call `clearCompletedItems(list_id, now, now)`
3. Call `getItemsByList(list_id)` — confirm only incomplete items remain
4. Confirm the previously-deleted item still has its original `deleted_at`

## Notes
Follows the same `db.runSync` pattern as `softDeleteItem`.

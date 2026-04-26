# Task T001: Add toggleItemComplete to items-db

## Feature
F007 - Toggle Item Complete

## Description
Add a `toggleItemComplete` function to `items-db.ts` that updates the `completed` flag and `updated_at` for an item by ID.

## Files
- `mobile/features/items/db/items-db.ts` (modify)

## Implementation Steps
1. Open `mobile/features/items/db/items-db.ts`
2. Add the following function at the bottom of the file:
   ```ts
   export function toggleItemComplete(id: string, completed: boolean, updatedAt: string): void {
     db.runSync(
       `UPDATE items SET completed = ?, updated_at = ? WHERE id = ?`,
       [completed ? 1 : 0, updatedAt, id]
     );
   }
   ```

## Constraints
- Use `db.runSync` (existing pattern in the file)
- Convert `boolean` to `1`/`0` for SQLite (existing pattern in `insertItem`)
- Do not modify any existing functions

## Acceptance Criteria
- `toggleItemComplete` updates `completed` and `updated_at` for the given item ID in SQLite
- Calling with `completed = true` sets `completed = 1`
- Calling with `completed = false` sets `completed = 0`

## Test Steps
1. Call `toggleItemComplete(id, true, now)` then `getItemById(id)` — confirm `completed === true`
2. Call `toggleItemComplete(id, false, now)` then `getItemById(id)` — confirm `completed === false`

## Notes
No new DB logic patterns — follows the same `db.runSync` + boolean-to-int conversion already used by `insertItem` and `softDeleteItem`.

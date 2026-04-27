# Task T002: Add ClearCompletedInput type and clearCompletedItems service

## Feature
F008 - Clear Completed Items

## Description
Add the `ClearCompletedInput` type to the items types file and a `clearCompletedItems` service function that calls the DB layer.

## Files
- `mobile/features/items/types/index.ts` (modify)
- `mobile/features/items/services/item-service.ts` (modify)

## Implementation Steps
1. Open `mobile/features/items/types/index.ts`
2. Append the following interface at the bottom:
   ```ts
   export interface ClearCompletedInput {
     list_id: string;
   }
   ```
3. Open `mobile/features/items/services/item-service.ts`
4. Import `ClearCompletedInput` alongside the existing type imports
5. Import `clearCompletedItems` from `items-db`
6. Add the following function at the bottom of the file:
   ```ts
   type ClearCompletedResult =
     | { success: true }
     | { success: false; error: string };

   export function clearCompletedItems(input: ClearCompletedInput): ClearCompletedResult {
     const now = new Date().toISOString();
     clearCompletedItems(input.list_id, now, now);
     return { success: true };
   }
   ```
   Note: rename the imported DB function to avoid the name collision, e.g.:
   ```ts
   import { ..., clearCompletedItems as clearCompletedItemsDb } from '../db/items-db';
   ```
   Then call `clearCompletedItemsDb(input.list_id, now, now)` inside the service.

## Constraints
- Follow existing result-type pattern (`{ success: true } | { success: false; error: string }`)
- No per-item logic — delegate entirely to the DB function
- Do not modify existing functions

## Acceptance Criteria
- `clearCompletedItems({ list_id })` calls the DB function and returns `{ success: true }`
- `ClearCompletedInput` is exported from the types file

## Test Steps
1. Call `clearCompletedItems({ list_id })` with a list that has completed items
2. Call `getItemsByList(list_id)` — confirm completed items are gone
3. Confirm the function returns `{ success: true }`

## Notes
No validation needed beyond what the DB enforces — if there are no completed items, it is a silent no-op per the feature spec.

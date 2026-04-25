# Task T002: Add deleteItem handler to useItems hook

## Feature
F005 - Delete Item

## Description
Add a `handleDeleteItem` callback to the `useItems` hook that calls the `deleteItem` service and removes the item from local state on success.

## Files
- `mobile/features/items/hooks/use-items.ts` (modify)

## Implementation Steps
1. Open `mobile/features/items/hooks/use-items.ts`
2. Add `deleteItem` to the import from `../services/item-service`:
   ```ts
   import { addItem, editItem, deleteItem } from '../services/item-service';
   ```
3. Add the `handleDeleteItem` callback after `handleEditItem`:
   ```ts
   const handleDeleteItem = useCallback(
     (id: string): boolean => {
       const result = deleteItem({ id });
       if (!result.success) {
         setError(result.error);
         return false;
       }
       setItems((prev) => prev.filter((i) => i.id !== id));
       setError(null);
       return true;
     },
     []
   );
   ```
4. Add `deleteItem: handleDeleteItem` to the return value of `useItems`

## Constraints
- Do not modify `handleAddItem` or `handleEditItem`
- `handleDeleteItem` callback has no dependency on `list_id` — use empty deps array `[]`
- Follow the same boolean return pattern as the other handlers

## Acceptance Criteria
- `deleteItem(id)` removes the item from the `items` state array immediately
- Returns `true` on success, `false` on failure
- On failure, `error` state is set with the error message

## Test Steps
1. Add an item to a list, call `deleteItem(id)` — item no longer appears in the list UI
2. Call `deleteItem` with an invalid id — `error` state is set, item list unchanged

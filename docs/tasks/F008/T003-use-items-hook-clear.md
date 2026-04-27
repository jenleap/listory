# Task T003: Add clearCompleted to use-items hook

## Feature
F008 - Clear Completed Items

## Description
Add a `clearCompleted` handler to the `useItems` hook that calls the service and removes completed items from React state.

## Files
- `mobile/features/items/hooks/use-items.ts` (modify)

## Implementation Steps
1. Open `mobile/features/items/hooks/use-items.ts`
2. Import `clearCompletedItems` from `../services/item-service`
3. Add the following handler inside `useItems`, after the existing handlers:
   ```ts
   const handleClearCompleted = useCallback((): boolean => {
     const result = clearCompletedItems({ list_id });
     if (!result.success) {
       setError(result.error);
       return false;
     }
     setItems((prev) => prev.filter((i) => !i.completed));
     setError(null);
     return true;
   }, [list_id]);
   ```
4. Add `clearCompleted: handleClearCompleted` to the return value of `useItems`

## Constraints
- Follow the existing `useCallback` + `setItems` pattern used by `handleDeleteItem` and `handleToggleItem`
- Do not modify existing handlers

## Acceptance Criteria
- `clearCompleted()` removes all completed items from the `items` state array
- Returns `true` on success, `false` on error
- `clearCompleted` is exported from the hook's return value

## Test Steps
1. Load a list with a mix of completed and incomplete items
2. Call `clearCompleted()`
3. Confirm the returned `items` array contains only incomplete items

## Notes
The filter `!i.completed` mirrors the DB predicate (`completed = 1 AND deleted_at IS NULL`). Since `items` state already excludes soft-deleted records, this is safe.

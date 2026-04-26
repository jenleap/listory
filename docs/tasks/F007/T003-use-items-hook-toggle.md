# Task T003: Add toggleItem to use-items hook

## Feature
F007 - Toggle Item Complete

## Description
Add a `handleToggleItem` callback to `use-items.ts` that calls the `toggleItem` service and updates the local items state optimistically.

## Files
- `mobile/features/items/hooks/use-items.ts` (modify)

## Implementation Steps
1. Open `mobile/features/items/hooks/use-items.ts`
2. Add `toggleItem` to the import from `../services/item-service`
3. Add a new `useCallback` after `handleDeleteItem`:
   ```ts
   const handleToggleItem = useCallback(
     (id: string): boolean => {
       const result = toggleItem({ id });
       if (!result.success) {
         setError(result.error);
         return false;
       }
       setItems((prev) => prev.map((i) => (i.id === id ? result.item : i)));
       setError(null);
       return true;
     },
     []
   );
   ```
4. Add `toggleItem: handleToggleItem` to the return object

## Constraints
- Follow the same `useCallback` + optimistic state pattern used by `handleEditItem` and `handleDeleteItem`
- Empty dependency array is correct — `toggleItem` service has no external deps
- Do not modify existing callbacks

## Acceptance Criteria
- `toggleItem(id)` flips the item's `completed` value in the `items` state array
- Returns `true` on success, `false` on failure
- `error` state is set on failure and cleared on success

## Test Steps
1. Call `toggleItem` from the hook — item in state has flipped `completed`
2. Call `toggleItem` again — item flips back

## Notes
No new patterns introduced. Mirrors the structure of `handleEditItem`.

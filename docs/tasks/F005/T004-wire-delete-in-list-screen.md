# Task T004: Wire onDelete in ListScreen

## Feature
F005 - Delete Item

## Description
Pass the `deleteItem` handler from `useItems` into each `ItemRow` via the `onDelete` prop in `ListScreen`.

## Files
- `mobile/features/lists/ui/list-screen.tsx` (modify)

## Implementation Steps
1. Open `mobile/features/lists/ui/list-screen.tsx`
2. Destructure `deleteItem` from `useItems`:
   ```ts
   const { items, error, addItem, editItem, deleteItem } = useItems(listId);
   ```
3. Update the `renderItem` function to pass `onDelete`:
   ```ts
   function renderItem({ item }: { item: Item }) {
     return <ItemRow item={item} onEdit={editItem} onDelete={deleteItem} />;
   }
   ```

## Constraints
- Do not change any other logic in `ListScreen`
- No new state or side effects needed — `deleteItem` from the hook handles state internally

## Acceptance Criteria
- Deleting an item from `ItemRow` immediately removes it from the list in `ListScreen`
- No TypeScript errors — `onDelete` prop is satisfied on `ItemRow`

## Test Steps
1. Run app, navigate to a list, tap an item to enter edit mode
2. Tap "Delete" — item is removed from the list without a reload
3. Verify no TypeScript errors: `npx tsc --noEmit` from the `mobile/` directory

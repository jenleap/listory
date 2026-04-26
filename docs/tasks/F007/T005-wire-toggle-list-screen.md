# Task T005: Wire toggleItem into ListScreen

## Feature
F007 - Toggle Item Complete

## Description
Extract `toggleItem` from the `useItems` hook in `ListScreen` and pass it as `onToggle` to each `ItemRow`.

## Files
- `mobile/features/lists/ui/list-screen.tsx` (modify)

## Implementation Steps
1. Open `mobile/features/lists/ui/list-screen.tsx`
2. Destructure `toggleItem` from the `useItems` hook call (line 32):
   ```ts
   const { items, error: itemError, addItem, editItem, deleteItem, toggleItem } = useItems(listId);
   ```
3. In `renderRow`, pass `onToggle={toggleItem}` to `ItemRow`:
   ```tsx
   return <ItemRow item={row.item} onEdit={editItem} onDelete={deleteItem} onToggle={toggleItem} />;
   ```

## Constraints
- Only modify the two lines described above
- Do not change any other logic in this file

## Acceptance Criteria
- `ItemRow` receives `onToggle` and can call it
- Tapping a checkbox on the list screen toggles the item's `completed` state immediately
- No TypeScript errors

## Test Steps
1. Open the list screen in the simulator
2. Tap a checkbox — item toggles to completed (strikethrough + filled checkbox)
3. Tap again — item toggles back to incomplete
4. Kill and reopen the app — toggled state persists (loaded from SQLite)

## Notes
ListScreen already destructures from `useItems` — this is a minimal two-line change.

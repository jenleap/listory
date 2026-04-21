# Task T005: Wire ItemRow into list-screen

## Feature
F004 - Edit Item

## Description
Replace the inline item renderer in `list-screen.tsx` with the new `ItemRow` component and wire the `editItem` callback from `useItems`.

## Files
- `mobile/features/lists/ui/list-screen.tsx`

## Implementation Steps
1. Import `ItemRow` from `../../items/ui/item-row`
2. Destructure `editItem` from `useItems(listId)` alongside existing `items`, `error`, `addItem`
3. Replace the `renderItem` function body: return `<ItemRow item={item} onEdit={editItem} />`
4. Remove the now-unused inline `View`/`Text` row styles from `StyleSheet.create` (`row`, `rowText`, `completedText`) — only if they are no longer referenced anywhere else in the file

## Constraints
- Do not change any other behavior in list-screen (add item flow, keyboard avoidance, error display)
- Keep the `renderItem` function signature unchanged (`{ item: Item }`)

## Acceptance Criteria
- List screen renders items via `ItemRow`
- Tapping an item enters edit mode
- Edit completes and list updates without a full re-render of the list
- Add-item flow continues to work as before
- Error display (duplicate name) still appears

## Test Steps
1. Run app, navigate to list — items render as before
2. Tap item text — enters edit mode
3. Edit text and blur — list updates with new text
4. Add a new item — still works
5. Edit item to empty — item disappears from list
6. Edit item to duplicate name — error shown below input bar

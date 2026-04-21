# Task T006: List Screen Update

## Feature
F002 - Add Item

## Description
Update the List Screen to display items and allow the user to add a new item via an inline text input that saves on blur and discards if empty.

## Files
- `mobile/features/lists/ui/list-screen.tsx` (modify)

## Implementation Steps
1. Replace the current placeholder implementation with a fully functional screen
2. Extract `listId` and `listName` from `route.params`
3. Call `useItems(listId)` from `mobile/features/items/hooks/use-items`
4. Render a `FlatList` of current items:
   - Each row shows `item.text`
   - Completed items show with a strikethrough style (`textDecorationLine: 'line-through'`, grey color)
   - If `items` is empty, render a centred "No items yet." placeholder text
5. Render an inline `TextInput` at the bottom of the screen for adding a new item:
   - Placeholder: `"Add an item…"`
   - `onBlur`: call `addItem(inputText)` if text is non-empty; clear input regardless
   - `value` / `onChangeText` controlled input
   - If `error` is non-null, display it above the input in red; clear it when the user starts typing
6. Use `KeyboardAvoidingView` wrapping the whole screen so the input is not hidden by the keyboard

## Constraints
- Use only React Native core components (no third-party UI libraries)
- Do not add item completion toggle — that is F007
- Do not add item deletion — that is F005
- Keep styles consistent with `main-screen.tsx` (white background, hairline separators, #007AFF accent)

## Acceptance Criteria
- List screen renders items from SQLite on mount
- Typing in the input and blurring creates a new item visible in the list immediately
- Blurring with empty input discards without creating an item
- Duplicate text shows an error message
- Error clears when the user starts typing again

## Test Steps
1. Navigate to a list — "No items yet." is shown
2. Tap the input, type "Buy milk", blur — item appears in the list
3. Type "buy milk" again, blur — error "An item with this name already exists" is shown
4. Clear the input and blur — no item added, no error

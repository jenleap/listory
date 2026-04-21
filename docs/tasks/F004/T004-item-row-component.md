# Task T004: Create ItemRow component with inline edit mode

## Feature
F004 - Edit Item

## Description
Create a new `ItemRow` component that renders an item as text normally, and switches to an inline `TextInput` when the user taps the text. Saves on blur and exits edit mode.

## Files
- `mobile/features/items/ui/item-row.tsx` (new file)

## Implementation Steps
1. Create `mobile/features/items/ui/item-row.tsx`
2. Define props:
   ```ts
   type Props = {
     item: Item;
     onEdit: (id: string, newText: string) => boolean;
   };
   ```
3. Use `useState<boolean>` for `isEditing` (default false)
4. Use `useState<string>` for `editText` initialized to `item.text`
5. When not editing: render a `TouchableOpacity` wrapping a `Text` displaying `item.text`; on press set `isEditing = true` and `editText = item.text`
6. When editing: render a `TextInput` with:
   - `value={editText}`
   - `onChangeText={setEditText}`
   - `autoFocus={true}`
   - `onBlur`: call `onEdit(item.id, editText)`, then set `isEditing = false` and reset `editText = item.text` (the parent will update `item.text` via state)
   - `returnKeyType="done"`
   - `onSubmitEditing`: blur the input (trigger `onBlur`)
7. Apply the same row styles as the current inline row in `list-screen.tsx` (`paddingHorizontal: 16`, `paddingVertical: 14`, `borderBottomWidth`, etc.)
8. Apply `completedText` strike-through style when `item.completed` is true (both in display and edit mode text style)

## Constraints
- Do not import anything from outside `features/items` except RN core components
- Use `useRef<TextInput>` to call `.blur()` on submit
- Keep styles in a local `StyleSheet.create`

## Acceptance Criteria
- Tapping item text enters edit mode with a focused TextInput pre-filled with current text
- Blurring the input exits edit mode and calls `onEdit`
- Pressing return key on keyboard exits edit mode (via blur)
- Completed items show strike-through in both modes

## Test Steps
1. Run app, navigate to a list, tap an item — TextInput appears pre-filled
2. Change text and tap elsewhere — edit mode exits, parent receives new text
3. Press return key — same as blur
4. Tap a completed item — strike-through text is editable

# Task T004: Add checkbox to ItemRow component

## Feature
F007 - Toggle Item Complete

## Description
Add an `onToggle` prop to `ItemRow` and render a tappable checkbox to the left of the item text. Tapping the checkbox calls `onToggle`; tapping the text row still opens the edit input.

## Files
- `mobile/features/items/ui/item-row.tsx` (modify)

## Implementation Steps
1. Open `mobile/features/items/ui/item-row.tsx`
2. Add `onToggle: (id: string) => boolean` to the `Props` type
3. Add a `handleToggle` function:
   ```ts
   function handleToggle() {
     onToggle(item.id);
   }
   ```
4. Update both the read-only and editing `return` blocks to wrap the content in a row `View` and add a checkbox `TouchableOpacity` on the left:

   **Read-only row** (replace the existing `TouchableOpacity` return):
   ```tsx
   return (
     <View style={styles.row}>
       <TouchableOpacity style={styles.checkbox} onPress={handleToggle}>
         <View style={[styles.checkboxBox, item.completed && styles.checkboxBoxChecked]}>
           {item.completed && <Text style={styles.checkmark}>✓</Text>}
         </View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.textArea} onPress={handlePress}>
         <Text style={[styles.rowText, item.completed && styles.completedText]}>
           {item.text}
         </Text>
       </TouchableOpacity>
     </View>
   );
   ```

   **Editing row** (update the existing editing `View` to include checkbox on left):
   ```tsx
   return (
     <View style={styles.row}>
       <TouchableOpacity style={styles.checkbox} onPress={handleToggle}>
         <View style={[styles.checkboxBox, item.completed && styles.checkboxBoxChecked]}>
           {item.completed && <Text style={styles.checkmark}>✓</Text>}
         </View>
       </TouchableOpacity>
       <View style={styles.textArea}>
         <TextInput
           ref={inputRef}
           style={[styles.input, item.completed && styles.completedText]}
           value={editText}
           onChangeText={setEditText}
           autoFocus
           onBlur={handleBlur}
           onSubmitEditing={handleSubmitEditing}
           returnKeyType="done"
         />
         <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
           <Text style={styles.deleteButtonText}>Delete</Text>
         </TouchableOpacity>
       </View>
     </View>
   );
   ```

5. Add the following new styles to the `StyleSheet.create` block:
   ```ts
   checkbox: {
     justifyContent: 'center',
     paddingRight: 12,
   },
   checkboxBox: {
     width: 22,
     height: 22,
     borderRadius: 4,
     borderWidth: 2,
     borderColor: '#aaa',
     alignItems: 'center',
     justifyContent: 'center',
   },
   checkboxBoxChecked: {
     backgroundColor: '#007AFF',
     borderColor: '#007AFF',
   },
   checkmark: {
     color: '#fff',
     fontSize: 13,
     fontWeight: '700',
   },
   textArea: {
     flex: 1,
   },
   ```
6. Update the existing `row` style to use `flexDirection: 'row'` and `alignItems: 'center'`:
   ```ts
   row: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingHorizontal: 16,
     paddingVertical: 14,
     borderBottomWidth: StyleSheet.hairlineWidth,
     borderBottomColor: '#ddd',
   },
   ```

## Constraints
- Use `TouchableOpacity` for the checkbox (no third-party checkbox lib)
- Checkbox tap must NOT trigger the text edit flow
- Text area tap must NOT trigger toggle
- Completed text styling (`line-through`, `#aaa`) stays unchanged
- Do not change `onEdit` or `onDelete` prop signatures

## Acceptance Criteria
- Checkbox renders to the left of item text in both read and edit states
- Tapping checkbox calls `onToggle(item.id)` immediately
- Checked state shows filled blue box with white checkmark
- Unchecked state shows empty box with grey border
- Completed items still show strikethrough text in grey

## Test Steps
1. Open list screen — each item shows checkbox on left
2. Tap checkbox on an incomplete item — box fills blue, text gets strikethrough
3. Tap checkbox again — box empties, text returns to normal
4. Tap item text — edit input opens (checkbox still visible)

## Notes
Checkbox is a custom `View`-based implementation to avoid adding a new dependency.

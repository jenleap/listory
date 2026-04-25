# Task T003: Add delete button to ItemRow edit mode

## Feature
F005 - Delete Item

## Description
Update `ItemRow` to accept an `onDelete` prop and render a "Delete" button when the item is in edit mode. Tapping the button calls `onDelete` and exits edit mode.

## Files
- `mobile/features/items/ui/item-row.tsx` (modify)

## Implementation Steps
1. Open `mobile/features/items/ui/item-row.tsx`
2. Update the `Props` type to add `onDelete`:
   ```ts
   type Props = {
     item: Item;
     onEdit: (id: string, newText: string) => boolean;
     onDelete: (id: string) => boolean;
   };
   ```
3. Destructure `onDelete` from props in the component function signature
4. Add a `handleDelete` function inside the component:
   ```ts
   function handleDelete() {
     onDelete(item.id);
     setIsEditing(false);
   }
   ```
5. In the editing branch (`if (isEditing)`), wrap the current `TextInput` and add a "Delete" button below it:
   ```tsx
   <View style={styles.row}>
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
   ```
6. Add styles for the delete button:
   ```ts
   deleteButton: {
     marginTop: 4,
     paddingVertical: 6,
     paddingHorizontal: 12,
     alignSelf: 'flex-start',
   },
   deleteButtonText: {
     color: '#cc0000',
     fontSize: 14,
   },
   ```

## Constraints
- Do not change the non-editing (display) branch
- `handleDelete` must call `onDelete` before `setIsEditing(false)` so the parent removes the item from state
- Do not add any animation or confirmation dialog — delete is immediate per spec

## Acceptance Criteria
- Tapping an item to enter edit mode shows the existing TextInput AND a "Delete" button below it
- Tapping "Delete" removes the item immediately from the list and exits edit mode
- The display mode (non-editing) is unchanged

## Test Steps
1. Run app, tap an item — TextInput appears with a "Delete" button below
2. Tap "Delete" — item disappears from the list immediately
3. Tap another item to edit text — "Delete" button is present but text edit still works normally

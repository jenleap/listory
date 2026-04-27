# Task T004: Wire Clear Completed to list screen ellipsis menu

## Feature
F008 - Clear Completed Items

## Description
Add an ellipsis (⋯) button to the list screen header. Pressing it shows an action alert with a "Clear Completed" option. Confirming calls `clearCompleted` from the hook.

## Files
- `mobile/features/lists/ui/list-screen.tsx` (modify)

## Implementation Steps
1. Open `mobile/features/lists/ui/list-screen.tsx`
2. Add `navigation` to the destructured Props:
   ```ts
   export default function ListScreen({ route, navigation }: Props)
   ```
3. Import `useEffect` if not already imported (it is already imported via `useState`/`useRef` — add `useEffect` to the React import if missing)
4. Import `Alert` from `react-native`
5. Destructure `clearCompleted` from `useItems`:
   ```ts
   const { items, error: itemError, addItem, editItem, deleteItem, toggleItem, clearCompleted } = useItems(listId);
   ```
6. Add a `useEffect` that sets the header right button after the component mounts:
   ```ts
   useEffect(() => {
     navigation.setOptions({
       headerRight: () => (
         <TouchableOpacity onPress={handleEllipsisPress} style={styles.headerButton}>
           <Text style={styles.headerButtonText}>•••</Text>
         </TouchableOpacity>
       ),
     });
   }, [navigation]);
   ```
7. Add the `handleEllipsisPress` function before the return:
   ```ts
   function handleEllipsisPress() {
     Alert.alert('List Actions', undefined, [
       {
         text: 'Clear Completed',
         onPress: () => clearCompleted(),
       },
       { text: 'Cancel', style: 'cancel' },
     ]);
   }
   ```
8. Add the following styles to the `StyleSheet.create` block:
   ```ts
   headerButton: {
     paddingHorizontal: 12,
     paddingVertical: 4,
   },
   headerButtonText: {
     fontSize: 20,
     color: '#007AFF',
     letterSpacing: 2,
   },
   ```

## Constraints
- Use `Alert.alert` — no third-party action sheet libraries
- Use `navigation.setOptions` to place the button in the native header
- Do not modify the existing bottom toolbar or FlatList logic
- `navigation` must be typed as part of the existing `NativeStackScreenProps` — no new type imports needed

## Acceptance Criteria
- An ellipsis button appears in the top-right of the list screen header
- Pressing it shows an alert with "Clear Completed" and "Cancel" options
- Pressing "Clear Completed" removes all completed items from the list immediately
- Pressing "Cancel" dismisses the alert with no changes
- If there are no completed items, pressing "Clear Completed" is a no-op

## Test Steps
1. Open a list with at least one completed item and one incomplete item
2. Tap the ellipsis button — confirm the alert appears
3. Tap "Clear Completed" — confirm completed items are removed immediately
4. Tap the ellipsis button on a list with no completed items — confirm no crash or visible change
5. Tap "Cancel" — confirm the list is unchanged

## Notes
`useEffect` dependency array includes only `navigation` (stable ref). `handleEllipsisPress` is a plain function defined in render scope — no `useCallback` needed since it is only called via the Alert, not passed as a prop to a child component.

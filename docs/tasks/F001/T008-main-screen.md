# Task T008: Main Screen

## Feature
F001 - Create List

## Description
Implement the Main Screen that displays the user's lists and provides a button to create a new list via an inline modal input.

## Files
- `mobile/features/lists/ui/main-screen.tsx`

## Implementation Steps
1. Create the directory `mobile/features/lists/ui/`
2. Use a hardcoded `CURRENT_USER_ID = 'user-1'` constant at the top of the file (auth is out of scope)
3. Import `useLists` from `mobile/features/lists/hooks/use-lists`
4. Import `NativeStackScreenProps` from `@react-navigation/native-stack` and `RootStackParamList` from `mobile/navigation/types`
5. Type the component as `NativeStackScreenProps<RootStackParamList, 'Main'>`
6. Use `useLists(CURRENT_USER_ID)` to get `lists`, `error`, and `createList`
7. Local state: `modalVisible: boolean`, `inputName: string`
8. Render:
   - A `FlatList` of lists. Each row shows the list name. Tapping a row navigates to `navigation.navigate('List', { listId: list.id, listName: list.name })`
   - An empty state message when `lists` is empty: `"No lists yet. Tap + to create one."`
   - A `+` button (TouchableOpacity) in the top-right header or bottom-right to open the modal
   - A `Modal` (React Native Modal) with:
     - A `TextInput` for the list name (auto-focused)
     - A "Create" button that calls `createList(inputName)` and closes the modal on success
     - A "Cancel" button that closes the modal and clears input
     - An error message shown below the input when `error` is not null
9. When modal closes (success or cancel): reset `inputName` to `''` and `error` to `null`

## Constraints
- Use React Native core components only: View, Text, TextInput, FlatList, Modal, TouchableOpacity, StyleSheet
- No third-party UI libraries
- Hardcoded user ID is intentional — auth is a future feature
- Keep styles inline with StyleSheet.create

## Acceptance Criteria
- Main screen renders a list of lists from SQLite
- Tapping + opens the modal
- Creating a list with a valid name closes the modal and adds the list to the FlatList immediately
- Creating a list with an empty name shows an error message in the modal
- Creating a duplicate name shows an error message in the modal
- Tapping a list row navigates to ListScreen

## Test Steps
1. Launch app — MainScreen visible with empty state text
2. Tap + → modal opens
3. Type a name, tap Create → modal closes, list appears in FlatList
4. Tap + again, type same name, tap Create → error shown, modal stays open
5. Tap + again, leave blank, tap Create → error shown, modal stays open
6. Tap a list row → navigates to List screen

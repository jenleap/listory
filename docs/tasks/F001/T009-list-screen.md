# Task T009: List Screen

## Feature
F001 - Create List

## Description
Implement the List Screen that users land on after creating a list. For F001 it shows an empty state — items are added in a later feature.

## Files
- `mobile/features/lists/ui/list-screen.tsx`

## Implementation Steps
1. Import `NativeStackScreenProps` from `@react-navigation/native-stack`
2. Import `RootStackParamList` from `mobile/navigation/types`
3. Type the component as `NativeStackScreenProps<RootStackParamList, 'List'>`
4. Render a centered `View` with a `Text` that reads: `"No items yet."`
5. The screen title is set by the navigator using `route.params.listName` (no need to set it manually)

## Constraints
- Minimal implementation — this screen is a placeholder for future item features
- Use only React Native core components: View, Text, StyleSheet
- Do not add any item logic

## Acceptance Criteria
- List screen renders without error when navigated to from MainScreen
- Displays the text "No items yet."
- The screen header shows the list name passed via navigation params

## Test Steps
1. Create a list and tap it on MainScreen
2. List screen appears with correct title and "No items yet." text

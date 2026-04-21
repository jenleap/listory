# Task T007: Navigation Setup

## Feature
F001 - Create List

## Description
Configure React Navigation with a native stack navigator containing MainScreen and ListScreen routes.

## Files
- `mobile/App.tsx`
- `mobile/navigation/types.ts`

## Implementation Steps
1. Create the directory `mobile/navigation/`
2. In `mobile/navigation/types.ts`:
   - Define and export `RootStackParamList`:
     - `Main: undefined`
     - `List: { listId: string; listName: string }`
3. In `mobile/App.tsx`:
   - Import `NavigationContainer` from `@react-navigation/native`
   - Import `createNativeStackNavigator` from `@react-navigation/native-stack`
   - Import `RootStackParamList` from `mobile/navigation/types`
   - Import `MainScreen` from `mobile/features/lists/ui/main-screen` (placeholder — will be created in T008)
   - Import `ListScreen` from `mobile/features/lists/ui/list-screen` (placeholder — will be created in T009)
   - Create `const Stack = createNativeStackNavigator<RootStackParamList>()`
   - Wrap the app in `<NavigationContainer>` with a `<Stack.Navigator>` containing:
     - `<Stack.Screen name="Main" component={MainScreen} options={{ title: 'My Lists' }} />`
     - `<Stack.Screen name="List" component={ListScreen} options={({ route }) => ({ title: route.params.listName })} />`
   - Keep `initSchema()` call before the navigator (call it at module level or as the first thing in the component)

## Constraints
- Use `@react-navigation/native-stack` (already installed)
- Do not add more screens than Main and List
- TypeScript-safe navigation using `RootStackParamList`

## Acceptance Criteria
- App renders without error
- Two routes defined: `Main` and `List`
- `List` route accepts `listId` and `listName` params

## Test Steps
1. App launches and shows MainScreen without error
2. No TypeScript errors on navigation types

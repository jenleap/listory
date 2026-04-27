# Task T006: Wire Remove Me From List in List Screen

## Feature
F010 - Remove Self From List

## Description
Add a "Remove Me From List" option to the ellipsis menu in the List Screen for non-owner users. On confirmation, call the service and navigate back to the Main Screen.

## Files
- `mobile/features/lists/ui/list-screen.tsx`

## Implementation Steps
1. Open `mobile/features/lists/ui/list-screen.tsx`
2. The screen already uses `useListUsers` — confirm `removeListUser` is now available from the hook (added in T003)
3. In `handleEllipsisPress`, locate the `isOwner` check
4. Add an `else` branch (or add to the options array when `!isOwner`):
   - Push option: `{ text: 'Remove Me From List', style: 'destructive', onPress: handleRemoveFromList }`
5. Add `handleRemoveFromList` function:
   - Show a confirmation `Alert` asking "Are you sure you want to remove yourself from this list?"
   - On confirm: call `removeListUser({ list_id, user_id: CURRENT_USER_ID, owner_id: ownerId })`
   - If `result.success`, call `navigation.goBack()`
   - If `!result.success`, show `Alert.alert('Error', result.error)`

## Constraints
- Only show "Remove Me From List" when `!isOwner`
- Owner sees "Share" in the menu; non-owner sees "Remove Me From List" — they are mutually exclusive
- Do not remove or modify existing "Clear Completed" or "Cancel" options
- No new imports beyond what is already available in the file

## Acceptance Criteria
- Non-owner user sees "Remove Me From List" in the ellipsis menu
- Owner does not see "Remove Me From List"
- Confirming the action soft-deletes the list_users record and navigates back
- The list no longer appears on the Main Screen after navigating back

## Test Steps
1. Open a shared list as a non-owner user
2. Tap the ellipsis (⋯) menu
3. Confirm "Remove Me From List" is present
4. Tap it → confirm the alert → verify the list disappears from the Main Screen
5. Open a list as the owner → confirm "Remove Me From List" is NOT shown

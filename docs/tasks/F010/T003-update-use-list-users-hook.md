# Task T003: Add removeListUser to useListUsers Hook

## Feature
F010 - Remove Self From List

## Description
Expose `removeListUser` from the `useListUsers` hook so the List Screen can call it.

## Files
- `mobile/features/list-users/hooks/use-list-users.ts`

## Implementation Steps
1. Open `mobile/features/list-users/hooks/use-list-users.ts`
2. Import `removeListUser` and `RemoveListUserInput` from `../services/share-list-service`
3. Add a `removeListUser` callback inside the hook using `useCallback`:
   - Accepts `(input: RemoveListUserInput) => RemoveListUserResult`
   - Calls the service `removeListUser(input)` and returns the result
4. Include `removeListUser` in the hook's return value

## Constraints
- No other changes to the hook
- Follow the existing `shareList` callback pattern already in the hook

## Acceptance Criteria
- `removeListUser` is returned from `useListUsers`
- Calling it delegates directly to the service function

## Test Steps
1. Read the hook file and verify the callback is exported correctly

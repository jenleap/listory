# Task T005: Update useLists Hook to Include Shared Lists

## Feature
F010 - Remove Self From List

## Description
Update the `useLists` hook to use `getListsForUser` instead of `getListsByOwner` so shared lists appear on the Main Screen.

## Files
- `mobile/features/lists/hooks/use-lists.ts`

## Implementation Steps
1. Open `mobile/features/lists/hooks/use-lists.ts`
2. Import `getListsForUser` from `../db/lists-db`
3. Replace the call to `getListsByOwner(userId)` with `getListsForUser(userId)` in the lists query
4. Leave all other hook logic unchanged

## Constraints
- No other changes to the hook or the component
- Do not remove the `getListsByOwner` import if it is used elsewhere in the same file

## Acceptance Criteria
- `useLists` returns both owned and shared (non-deleted) lists for the user
- Main Screen displays shared lists alongside owned lists

## Test Steps
1. Read the hook file and confirm it calls `getListsForUser`
2. Visually verify shared lists appear on the Main Screen

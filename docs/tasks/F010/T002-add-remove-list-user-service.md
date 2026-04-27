# Task T002: Add removeListUser Service Function

## Feature
F010 - Remove Self From List

## Description
Add a `removeListUser` service function to the share-list service that validates the user is not the owner, then soft-deletes their ListUser record.

## Files
- `mobile/features/list-users/services/share-list-service.ts`

## Implementation Steps
1. Open `mobile/features/list-users/services/share-list-service.ts`
2. Import `softDeleteListUser` from `../db/list-users-db`
3. Add input type `RemoveListUserInput` with fields: `list_id: string`, `user_id: string`, `owner_id: string`
4. Add result type `RemoveListUserResult` as `{ success: true } | { success: false; error: string }`
5. Add exported function `removeListUser(input: RemoveListUserInput): RemoveListUserResult`:
   - If `input.user_id === input.owner_id` return `{ success: false, error: 'Owner cannot remove themselves from the list' }`
   - Set `now = new Date().toISOString()`
   - Call `softDeleteListUser(input.list_id, input.user_id, now, now)`
   - Return `{ success: true }`

## Constraints
- No new files — add to existing service file
- Follow the same result type pattern as `shareList`
- No network calls; local DB only

## Acceptance Criteria
- `removeListUser` is exported from the service file
- Returns error if `user_id === owner_id`
- Calls `softDeleteListUser` with correct timestamps on valid input

## Test Steps
1. Read the file and verify the function, validation, and import are correct

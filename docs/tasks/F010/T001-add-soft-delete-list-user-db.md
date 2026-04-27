# Task T001: Add softDeleteListUser DB Function

## Feature
F010 - Remove Self From List

## Description
Add a `softDeleteListUser` function to the list-users DB layer that sets `deleted_at` and `updated_at` on a list_users record.

## Files
- `mobile/features/list-users/db/list-users-db.ts`

## Implementation Steps
1. Open `mobile/features/list-users/db/list-users-db.ts`
2. Add a new exported function `softDeleteListUser(list_id: string, user_id: string, deletedAt: string, updatedAt: string): void`
3. Execute: `UPDATE list_users SET deleted_at = ?, updated_at = ? WHERE list_id = ? AND user_id = ?`

## Constraints
- Use `db.runSync` consistent with existing functions in the file
- No other changes to the file

## Acceptance Criteria
- `softDeleteListUser` is exported from `list-users-db.ts`
- Calling it sets `deleted_at` and `updated_at` on the matching row

## Test Steps
1. Verify the function is exported and the SQL is correct by reading the file

## Notes
Follow the same pattern as `softDeleteItem` in `mobile/features/items/db/items-db.ts`.

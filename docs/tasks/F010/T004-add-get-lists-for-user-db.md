# Task T004: Add getListsForUser DB Query

## Feature
F010 - Remove Self From List

## Description
Add a `getListsForUser` query to the lists DB layer that returns all lists the user can access — both owned lists and lists shared with the user (via list_users).

## Files
- `mobile/features/lists/db/lists-db.ts`

## Implementation Steps
1. Open `mobile/features/lists/db/lists-db.ts`
2. Add exported function `getListsForUser(userId: string): List[]`
3. Execute a query that returns all lists where:
   - `lists.deleted_at IS NULL`
   - AND either:
     - `lists.owner_id = ?` (owned)
     - OR there is a `list_users` row where `list_users.user_id = ?` AND `list_users.deleted_at IS NULL`
4. Use a LEFT JOIN with list_users and a WHERE clause using OR, or use UNION — whichever is simpler
5. Return the mapped `List[]` results using the existing List type

## Constraints
- Do not remove or modify `getListsByOwner` — it may still be used elsewhere
- Use `db.getAllSync` consistent with existing functions
- Map rows to `List` type using the same field mapping as existing queries

## Acceptance Criteria
- `getListsForUser` is exported from `lists-db.ts`
- Returns owned lists AND lists shared with the user
- Excludes soft-deleted lists and lists where the user's list_users row is soft-deleted

## Test Steps
1. Read the file and verify the SQL and return type mapping are correct

## Notes
Example SQL:
```sql
SELECT DISTINCT l.*
FROM lists l
LEFT JOIN list_users lu ON lu.list_id = l.id AND lu.user_id = ? AND lu.deleted_at IS NULL
WHERE l.deleted_at IS NULL
  AND (l.owner_id = ? OR lu.list_id IS NOT NULL)
ORDER BY l.created_at ASC
```
Pass `userId` twice as the bound parameters.

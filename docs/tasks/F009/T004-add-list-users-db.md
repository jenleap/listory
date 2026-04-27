# Task T004: Create list-users-db with insert and query functions

## Feature
F009 - Share List

## Description
Create `features/list-users/db/list-users-db.ts` with functions to insert or update a `list_users` record and to query existing shares for a list.

## Files
- `mobile/features/list-users/db/list-users-db.ts` (create)

## Implementation Steps
1. Create `mobile/features/list-users/db/list-users-db.ts` with:
   ```ts
   import { db } from '../../../db/client';
   import { ListUser, ListUserWithName } from '../types';

   export function insertListUser(record: ListUser): void {
     db.runSync(
       `INSERT INTO list_users (list_id, user_id, access, created_at, updated_at, deleted_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
       [record.list_id, record.user_id, record.access, record.created_at, record.updated_at, record.deleted_at]
     );
   }

   export function upsertListUserAccess(
     list_id: string,
     user_id: string,
     access: 'write' | 'read',
     updatedAt: string
   ): void {
     db.runSync(
       `UPDATE list_users SET access = ?, updated_at = ?, deleted_at = NULL WHERE list_id = ? AND user_id = ?`,
       [access, updatedAt, list_id, user_id]
     );
   }

   export function getListUserExists(list_id: string, user_id: string): boolean {
     const row = db.getFirstSync<{ user_id: string }>(
       `SELECT user_id FROM list_users WHERE list_id = ? AND user_id = ?`,
       [list_id, user_id]
     );
     return row != null;
   }

   export function getListUsersWithNames(list_id: string): ListUserWithName[] {
     return db.getAllSync<ListUserWithName>(
       `SELECT lu.list_id, lu.user_id, lu.access, lu.created_at, lu.updated_at, lu.deleted_at,
               u.name, u.email
        FROM list_users lu
        JOIN users u ON u.id = lu.user_id
        WHERE lu.list_id = ? AND lu.deleted_at IS NULL`,
       [list_id]
     );
   }
   ```

## Constraints
- Use `db.runSync` and `db.getFirstSync` / `db.getAllSync` (existing pattern)
- `upsertListUserAccess` also clears `deleted_at` (handles re-sharing after removal)
- Do not create placeholder types — import from `../types`

## Acceptance Criteria
- `insertListUser` inserts a new row into `list_users`
- `upsertListUserAccess` updates `access` and `updated_at` for an existing row
- `getListUserExists` returns `true` if a row exists for (list_id, user_id) regardless of deleted_at
- `getListUsersWithNames` returns only non-deleted rows, joined with `users` for name and email

## Test Steps
1. Call `insertListUser` with a test record, then `getListUsersWithNames` — row should appear
2. Call `upsertListUserAccess` to change the access, then query — access should be updated
3. Call `getListUserExists` — should return true for existing row, false for unknown user

## Notes
`getListUserExists` checks all rows (including deleted) so the service can decide whether to INSERT or UPDATE.

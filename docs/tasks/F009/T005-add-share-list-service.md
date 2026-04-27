# Task T005: Create share-list-service with validation and share logic

## Feature
F009 - Share List

## Description
Create `features/list-users/services/share-list-service.ts` that validates the share request and creates or updates the `list_users` record in SQLite.

## Files
- `mobile/features/list-users/services/share-list-service.ts` (create)

## Implementation Steps
1. Create `mobile/features/list-users/services/share-list-service.ts` with:
   ```ts
   import { ShareListInput, ListUser } from '../types';
   import { insertListUser, upsertListUserAccess, getListUserExists } from '../db/list-users-db';

   type ShareListResult =
     | { success: true }
     | { success: false; error: string };

   export function shareList(input: ShareListInput): ShareListResult {
     if (input.current_user_id !== input.list_owner_id) {
       return { success: false, error: 'Only the list owner can share this list' };
     }

     if (input.current_user_id === input.target_user_id) {
       return { success: false, error: 'Cannot share a list with yourself' };
     }

     const now = new Date().toISOString();
     const alreadyExists = getListUserExists(input.list_id, input.target_user_id);

     if (alreadyExists) {
       upsertListUserAccess(input.list_id, input.target_user_id, input.access, now);
     } else {
       const record: ListUser = {
         list_id: input.list_id,
         user_id: input.target_user_id,
         access: input.access,
         created_at: now,
         updated_at: now,
         deleted_at: null,
       };
       insertListUser(record);
     }

     return { success: true };
   }
   ```

## Constraints
- `target_user_id` existence is validated by the caller (hook) before calling this service
- This service receives `list_owner_id` directly — it does not perform a DB lookup
- Duplicate share → update access (upsert), not a hard error
- Do not import from outside `list-users` feature except for the DB functions

## Acceptance Criteria
- Returns `{ success: false, error: '...' }` when `current_user_id !== list_owner_id`
- Returns `{ success: false, error: '...' }` when `current_user_id === target_user_id`
- Inserts a new `ListUser` row if none exists for (list_id, target_user_id)
- Updates `access` and `updated_at` if a row already exists
- Returns `{ success: true }` on both insert and upsert paths

## Test Steps
1. Call `shareList` with `current_user_id !== list_owner_id` — expect error
2. Call `shareList` with `current_user_id === target_user_id` — expect error
3. Call `shareList` with valid inputs — expect `{ success: true }` and row in `list_users`
4. Call `shareList` again with different `access` for same user — expect `{ success: true }` and updated access

## Notes
Target user existence check is intentionally in the hook (`use-list-users.ts`), keeping this service focused on ownership and deduplication logic.

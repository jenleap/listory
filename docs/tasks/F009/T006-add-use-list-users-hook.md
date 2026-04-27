# Task T006: Create use-list-users hook

## Feature
F009 - Share List

## Description
Create `features/list-users/hooks/use-list-users.ts`. The hook loads shared users for a list and exposes a `shareList` function that resolves an email to a user_id, validates target user existence, and calls the share service.

## Files
- `mobile/features/list-users/hooks/use-list-users.ts` (create)

## Implementation Steps
1. Create `mobile/features/list-users/hooks/use-list-users.ts` with:
   ```ts
   import { useState, useEffect, useCallback } from 'react';
   import { ListUserWithName } from '../types';
   import { getListUsersWithNames } from '../db/list-users-db';
   import { shareList as shareListService } from '../services/share-list-service';
   import { getUserByEmail } from '../../users/db/users-db';

   export function useListUsers(listId: string, listOwnerId: string, currentUserId: string) {
     const [sharedUsers, setSharedUsers] = useState<ListUserWithName[]>([]);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
       setSharedUsers(getListUsersWithNames(listId));
     }, [listId]);

     const shareList = useCallback(
       (email: string, access: 'write' | 'read'): boolean => {
         const trimmedEmail = email.trim();

         if (trimmedEmail === '') {
           setError('Email is required');
           return false;
         }

         const targetUser = getUserByEmail(trimmedEmail);

         if (targetUser == null) {
           setError('User not found');
           return false;
         }

         const result = shareListService({
           list_id: listId,
           list_owner_id: listOwnerId,
           current_user_id: currentUserId,
           target_user_id: targetUser.id,
           access,
         });

         if (!result.success) {
           setError(result.error);
           return false;
         }

         setSharedUsers(getListUsersWithNames(listId));
         setError(null);
         return true;
       },
       [listId, listOwnerId, currentUserId]
     );

     return { sharedUsers, error, shareList };
   }
   ```

## Constraints
- Resolve email → user_id inside the hook, not the service
- After a successful share, re-read shared users from SQLite and update state
- `error` is cleared on success and set on failure

## Acceptance Criteria
- `sharedUsers` is loaded from SQLite on mount
- `shareList('')` returns `false` and sets `error = 'Email is required'`
- `shareList('nobody@example.com', 'write')` returns `false` and sets `error = 'User not found'`
- `shareList('bob@example.com', 'write')` returns `true` and `sharedUsers` includes Bob
- `shareList('bob@example.com', 'read')` after an existing share updates Bob's access

## Test Steps
1. Render a component using `useListUsers` with a valid listId
2. Call `shareList('bob@example.com', 'write')` — `sharedUsers` should include Bob
3. Call `shareList('bob@example.com', 'read')` — Bob's access in `sharedUsers` should be 'read'
4. Call `shareList('bad@example.com', 'write')` — `error` should be 'User not found'

## Notes
`sharedUsers` is refreshed by re-querying SQLite after each successful share to keep UI consistent.

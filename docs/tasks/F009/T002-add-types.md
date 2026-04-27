# Task T002: Add types for User and ListUser

## Feature
F009 - Share List

## Description
Create type definition files for the `users` and `list-users` features.

## Files
- `mobile/features/users/types/index.ts` (create)
- `mobile/features/list-users/types/index.ts` (create)

## Implementation Steps
1. Create `mobile/features/users/types/index.ts` with:
   ```ts
   export interface User {
     id: string;
     email: string;
     name: string;
     password_hash: string;
     created_at: string;
   }
   ```

2. Create `mobile/features/list-users/types/index.ts` with:
   ```ts
   export interface ListUser {
     list_id: string;
     user_id: string;
     access: 'write' | 'read';
     created_at: string;
     updated_at: string;
     deleted_at: string | null;
   }

   export interface ShareListInput {
     list_id: string;
     list_owner_id: string;
     current_user_id: string;
     target_user_id: string;
     access: 'write' | 'read';
   }

   export interface ListUserWithName extends ListUser {
     name: string;
     email: string;
   }
   ```

## Constraints
- `access` must be a union type `'write' | 'read'`
- No logic in type files

## Acceptance Criteria
- `User` interface matches the `users` table schema from T001
- `ListUser` interface matches the `list_users` table schema from T001
- `ShareListInput` captures all fields needed for the share-list service
- `ListUserWithName` extends `ListUser` with display fields for the UI

## Test Steps
1. TypeScript compilation passes with no errors on the new files

## Notes
`ListUserWithName` is used by the hook to return enriched data for rendering in the modal.

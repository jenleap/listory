# Task T003: Create users-db with lookup functions

## Feature
F009 - Share List

## Description
Create `features/users/db/users-db.ts` with functions to look up users by email or ID. Used by the share-list hook to resolve an email address to a user_id.

## Files
- `mobile/features/users/db/users-db.ts` (create)

## Implementation Steps
1. Create `mobile/features/users/db/users-db.ts` with:
   ```ts
   import { db } from '../../../db/client';
   import { User } from '../types';

   export function getUserByEmail(email: string): User | null {
     return db.getFirstSync<User>(
       `SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))`,
       [email]
     ) ?? null;
   }

   export function getUserById(id: string): User | null {
     return db.getFirstSync<User>(
       `SELECT * FROM users WHERE id = ?`,
       [id]
     ) ?? null;
   }
   ```

## Constraints
- Use `db.getFirstSync` (existing pattern)
- Email lookup is case-insensitive and trimmed
- Return `null` when not found (not undefined)

## Acceptance Criteria
- `getUserByEmail('alice@example.com')` returns the user-1 seed row
- `getUserByEmail('ALICE@EXAMPLE.COM')` returns the same row (case-insensitive)
- `getUserByEmail('nobody@example.com')` returns `null`
- `getUserById('user-1')` returns the user-1 seed row
- `getUserById('unknown')` returns `null`

## Test Steps
1. After schema init, call `getUserByEmail('bob@example.com')` and log the result — should return the Bob seed user
2. Call `getUserByEmail('missing@example.com')` — should return null

## Notes
No users feature file — functions are kept minimal, only what F009 needs.

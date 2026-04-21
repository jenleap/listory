# Task T004: List DB Operations

## Feature
F001 - Create List

## Description
Implement SQLite database operations for the lists feature: insert a list and query all non-deleted lists for a user.

## Files
- `mobile/features/lists/db/lists-db.ts`

## Implementation Steps
1. Create the directory `mobile/features/lists/db/`
2. Import `db` from `mobile/db/client`
3. Import `List` and `CreateListInput` from `mobile/features/lists/types`
4. Implement and export `insertList(list: List): void`
   - Use `db.runSync` with a parameterized INSERT statement
   - Insert all fields: id, name, owner_id, is_template, created_at, updated_at, deleted_at
   - Store `is_template` as 0 or 1 (integer)
5. Implement and export `getListsByOwner(owner_id: string): List[]`
   - Use `db.getAllSync` with `SELECT * FROM lists WHERE owner_id = ? AND deleted_at IS NULL ORDER BY created_at ASC`
   - Map each row: convert `is_template` integer back to boolean
6. Implement and export `listNameExistsForOwner(name: string, owner_id: string): boolean`
   - Use `db.getFirstSync` with `SELECT id FROM lists WHERE owner_id = ? AND deleted_at IS NULL AND LOWER(TRIM(name)) = LOWER(TRIM(?))`
   - Return `true` if a row is found, `false` otherwise

## Constraints
- Use parameterized queries only — never string interpolation in SQL
- Use `db.runSync`, `db.getAllSync`, `db.getFirstSync` (synchronous expo-sqlite API)
- No business logic here — only raw DB operations

## Acceptance Criteria
- `insertList` inserts a row into the `lists` table
- `getListsByOwner` returns only non-deleted lists for a given owner
- `listNameExistsForOwner` returns true when a case-insensitive name match exists for the owner
- No TypeScript errors

## Test Steps
1. Call `insertList` with a valid List object — no crash
2. Call `getListsByOwner` — returns the inserted list
3. Call `listNameExistsForOwner` with the same name — returns true
4. Call `listNameExistsForOwner` with a different name — returns false

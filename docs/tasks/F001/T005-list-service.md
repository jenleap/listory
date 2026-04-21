# Task T005: List Service

## Feature
F001 - Create List

## Description
Implement the list service layer that handles validation and coordinates DB operations for creating a list.

## Files
- `mobile/features/lists/services/list-service.ts`

## Implementation Steps
1. Create the directory `mobile/features/lists/services/`
2. Import `uuid` from `uuid` (v4)
3. Import `List`, `CreateListInput` from `mobile/features/lists/types`
4. Import `insertList`, `listNameExistsForOwner` from `mobile/features/lists/db/lists-db`
5. Implement and export `createList(input: CreateListInput): { success: true; list: List } | { success: false; error: string }`
   - Trim the name
   - If trimmed name is empty → return `{ success: false, error: 'Name is required' }`
   - Call `listNameExistsForOwner(trimmedName, input.owner_id)`
   - If duplicate → return `{ success: false, error: 'A list with this name already exists' }`
   - Build a `List` object:
     - `id`: `uuid()` (v4)
     - `name`: trimmedName
     - `owner_id`: input.owner_id
     - `is_template`: false
     - `created_at`: new Date().toISOString()
     - `updated_at`: new Date().toISOString()
     - `deleted_at`: null
   - Call `insertList(list)`
   - Return `{ success: true, list }`

## Constraints
- No UI logic or React imports
- Validation must happen before DB operations
- Use discriminated union return type (not exceptions) for expected errors

## Acceptance Criteria
- Returns `{ success: false }` when name is empty or blank
- Returns `{ success: false }` when duplicate name exists for the owner
- Returns `{ success: true, list }` with full list object on success
- Inserted list appears in DB after successful call

## Test Steps
1. Call `createList({ name: '', owner_id: 'u1' })` → returns `success: false`
2. Call `createList({ name: '   ', owner_id: 'u1' })` → returns `success: false`
3. Call `createList({ name: 'Groceries', owner_id: 'u1' })` → returns `success: true` with list
4. Call `createList({ name: 'GROCERIES', owner_id: 'u1' })` again → returns `success: false` (duplicate)

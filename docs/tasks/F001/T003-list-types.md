# Task T003: List Types

## Feature
F001 - Create List

## Description
Define TypeScript types for the List data model used across DB, service, and UI layers.

## Files
- `mobile/features/lists/types/index.ts`

## Implementation Steps
1. Create the directory `mobile/features/lists/types/`
2. Define and export a `List` interface with these fields:
   - `id: string`
   - `name: string`
   - `owner_id: string`
   - `is_template: boolean`
   - `created_at: string`
   - `updated_at: string`
   - `deleted_at: string | null`
3. Define and export a `CreateListInput` interface with:
   - `name: string`
   - `owner_id: string`

## Constraints
- Plain TypeScript interfaces only — no classes, no Zod, no validation logic
- Field names match the SQLite schema from T002 exactly (snake_case)

## Acceptance Criteria
- `List` and `CreateListInput` are exported from `mobile/features/lists/types/index.ts`
- No TypeScript errors

## Test Steps
1. Import `List` type in another file — no TS error

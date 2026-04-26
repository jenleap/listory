# Task T003: Section DB Operations

## Feature
F006 - Create Section

## Description
Implement the SQLite read/write functions for the sections feature.

## Files
- `mobile/features/sections/db/sections-db.ts` (create)

## Implementation Steps
1. Create directory `mobile/features/sections/db/`
2. Create `sections-db.ts` with the following functions:

**insertSection(section: Section): void**
- Runs an INSERT into `sections` with all columns

**getSectionsByList(list_id: string): Section[]**
- SELECT all sections WHERE list_id = ? AND deleted_at IS NULL ORDER BY "order" ASC

**sectionNameExistsInList(name: string, list_id: string): boolean**
- SELECT id WHERE list_id = ? AND deleted_at IS NULL AND LOWER(TRIM(name)) = LOWER(TRIM(?))
- Returns true if a row is found

**getMaxSectionOrder(list_id: string): number**
- SELECT MAX("order") FROM sections WHERE list_id = ? AND deleted_at IS NULL
- Returns 0 if no sections exist

## Constraints
- Import `db` from `../../../db/client`
- Import `Section` from `../types`
- Follow the exact same patterns as `mobile/features/items/db/items-db.ts`
- Quote `"order"` in SQL

## Acceptance Criteria
- All four functions are exported
- `getSectionsByList` filters out soft-deleted records and sorts ascending by order
- `sectionNameExistsInList` is case-insensitive and trims whitespace

## Test Steps
1. TypeScript compiles with no errors

# Task T004: Section Service

## Feature
F006 - Create Section

## Description
Implement the `createSection` service function with validation and DB write.

## Files
- `mobile/features/sections/services/section-service.ts` (create)

## Implementation Steps
1. Create directory `mobile/features/sections/services/`
2. Create `section-service.ts` with the following:

**Imports**
- `generateId` from `../../../utils/generate-id`
- `Section`, `CreateSectionInput` from `../types`
- `insertSection`, `sectionNameExistsInList`, `getMaxSectionOrder` from `../db/sections-db`

**Return type**
```ts
type CreateSectionResult =
  | { success: true; section: Section }
  | { success: false; error: string };
```

**createSection(input: CreateSectionInput): CreateSectionResult**
1. Trim `input.name`
2. If trimmed name is empty → return `{ success: false, error: 'Name is required' }`
3. If `sectionNameExistsInList(trimmedName, input.list_id)` → return `{ success: false, error: 'A section with this name already exists' }`
4. Compute `order = getMaxSectionOrder(input.list_id) + 10`
5. Build a `Section` object with a new UUID, now for created_at/updated_at, deleted_at: null
6. Call `insertSection(section)`
7. Return `{ success: true, section }`

## Constraints
- Follow the same pattern as `mobile/features/items/services/item-service.ts`
- Use `new Date().toISOString()` for timestamps
- Use `generateId()` for the UUID

## Acceptance Criteria
- Empty name returns error
- Duplicate name (case-insensitive) returns error
- Valid input inserts into DB and returns the new section
- order appends after the last existing section (max order + 10)

## Test Steps
1. TypeScript compiles with no errors

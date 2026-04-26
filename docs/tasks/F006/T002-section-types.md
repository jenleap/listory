# Task T002: Section Types

## Feature
F006 - Create Section

## Description
Define TypeScript types for the sections feature.

## Files
- `mobile/features/sections/types/index.ts` (create)

## Implementation Steps
1. Create directory `mobile/features/sections/types/`
2. Create `index.ts` with the following types:
   - `Section` interface matching the DB schema
   - `CreateSectionInput` interface for service input

```ts
export interface Section {
  id: string;
  list_id: string;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateSectionInput {
  list_id: string;
  name: string;
}
```

## Constraints
- Follow the existing pattern from `mobile/features/items/types/index.ts`
- Only define types needed for F006 (no edit/delete input types)

## Acceptance Criteria
- `Section` and `CreateSectionInput` are exported from the types file
- All fields match the Section data model in `docs/project-overview.md`

## Test Steps
1. TypeScript compiles with no errors

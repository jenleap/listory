# Task T001: Item Types

## Feature
F002 - Add Item

## Description
Define TypeScript types for the Item model and item creation input.

## Files
- `mobile/features/items/types/index.ts` (create)

## Implementation Steps
1. Create the directory `mobile/features/items/types/`
2. Create `index.ts` and export an `Item` interface matching the data model:
   - id: string
   - text: string
   - list_id: string
   - section_id: string | null
   - completed: boolean
   - order: number
   - created_at: string
   - updated_at: string
   - deleted_at: string | null
3. Export a `CreateItemInput` interface with:
   - list_id: string
   - section_id: string | null
   - text: string

## Constraints
- No logic — types only
- snake_case for all interface fields (database naming convention)
- Do not import from other features

## Acceptance Criteria
- `Item` and `CreateItemInput` interfaces are exported from `mobile/features/items/types/index.ts`
- All fields match the project data model exactly

## Test Steps
1. Import `Item` and `CreateItemInput` in another file — TypeScript should compile without error

# Task T005: useSections Hook

## Feature
F006 - Create Section

## Description
Implement the `useSections` React hook to manage section state for a list.

## Files
- `mobile/features/sections/hooks/use-sections.ts` (create)

## Implementation Steps
1. Create directory `mobile/features/sections/hooks/`
2. Create `use-sections.ts` with the following:

**Imports**
- `useState`, `useEffect`, `useCallback` from `react`
- `Section` from `../types`
- `createSection` from `../services/section-service`
- `getSectionsByList` from `../db/sections-db`

**Hook signature**
```ts
export function useSections(list_id: string) { ... }
```

**State**
- `sections: Section[]` — initialized from `getSectionsByList(list_id)` on mount
- `error: string | null`

**handleAddSection(name: string): boolean**
- Calls `createSection({ list_id, name })`
- On success: append the new section to `sections`, clear error, return true
- On failure: set error, return false

**Return**
```ts
return { sections, error, addSection: handleAddSection };
```

## Constraints
- Follow the exact same pattern as `mobile/features/items/hooks/use-items.ts`
- Load sections on mount with `useEffect` scoped to `list_id`

## Acceptance Criteria
- `sections` is populated from SQLite on mount
- `addSection` updates local state immediately on success
- Error is surfaced when creation fails

## Test Steps
1. TypeScript compiles with no errors

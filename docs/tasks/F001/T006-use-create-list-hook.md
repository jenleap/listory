# Task T006: useCreateList Hook

## Feature
F001 - Create List

## Description
Implement a React hook that exposes list creation to UI components and keeps a local list of lists in sync after creation.

## Files
- `mobile/features/lists/hooks/use-lists.ts`

## Implementation Steps
1. Create the directory `mobile/features/lists/hooks/`
2. Import `useState`, `useCallback`, `useEffect` from `react`
3. Import `List` from `mobile/features/lists/types`
4. Import `createList` from `mobile/features/lists/services/list-service`
5. Import `getListsByOwner` from `mobile/features/lists/db/lists-db`
6. Implement and export `useLists(owner_id: string)` hook:
   - State: `lists: List[]` (initialized to `[]`)
   - State: `error: string | null` (initialized to `null`)
   - On mount (`useEffect`): call `getListsByOwner(owner_id)` and set `lists`
   - Implement `handleCreateList(name: string): boolean`
     - Call `createList({ name, owner_id })`
     - If `success: false` → set `error` to the returned error string, return `false`
     - If `success: true` → append the new list to `lists` state, clear `error`, return `true`
   - Return `{ lists, error, createList: handleCreateList }`

## Constraints
- Hook name must start with `use`
- DB calls are synchronous (expo-sqlite sync API) — no async/await needed
- Do not use Zustand here — local component state is sufficient for this hook

## Acceptance Criteria
- `useLists` returns `lists`, `error`, and `createList`
- After calling `createList('Groceries')`, the list appears in `lists` immediately
- On duplicate name, `error` is set and `lists` is unchanged
- No TypeScript errors

## Test Steps
1. Mount a component using `useLists('user-1')` — `lists` is initially `[]`
2. Call `createList('Groceries')` — `lists` now contains one item
3. Call `createList('Groceries')` again — `error` is set, `lists` still has one item

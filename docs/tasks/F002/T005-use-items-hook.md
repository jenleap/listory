# Task T005: useItems Hook

## Feature
F002 - Add Item

## Description
Create a React hook that loads items for a list and exposes an `addItem` action, keeping local state in sync with SQLite.

## Files
- `mobile/features/items/hooks/use-items.ts` (create)

## Implementation Steps
1. Create the directory `mobile/features/items/hooks/`
2. Create `use-items.ts`
3. Import `useState`, `useEffect`, `useCallback` from `'react'`
4. Import `Item` from `'../types'`
5. Import `addItem` from `'../services/item-service'`
6. Import `getItemsByList` from `'../db/items-db'`
7. Define and export `useItems(list_id: string)`:
   - State: `items: Item[]`, `error: string | null`
   - `useEffect` on `list_id`: call `getItemsByList(list_id)` and set state
   - `handleAddItem(text: string): boolean` (useCallback on list_id):
     - Call `addItem({ list_id, section_id: null, text })`
     - If `result.success` → append `result.item` to `items`, clear error, return `true`
     - If `!result.success` → set `error`, return `false`
   - Return `{ items, error, addItem: handleAddItem }`

## Constraints
- Follow the exact same shape as `useLists` in `mobile/features/lists/hooks/use-lists.ts`
- No direct DB calls inside the hook — delegate to service and db layer
- `section_id` is always `null` for F002 (sections are a later feature)

## Acceptance Criteria
- Hook returns current items for the list on mount
- Calling `addItem` with valid text updates `items` state immediately (optimistic)
- Calling `addItem` with invalid/duplicate text sets `error`

## Test Steps
1. Render a component using `useItems(listId)` — items array should be empty initially
2. Call `addItem('Buy milk')` — items array should contain the new item without re-querying
3. Call `addItem('buy milk')` — should return false and set error

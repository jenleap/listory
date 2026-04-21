# Task T003: Add editItem to use-items hook

## Feature
F004 - Edit Item

## Description
Extend the `useItems` hook to expose an `editItem` callback that calls the service, then updates local React state optimistically.

## Files
- `mobile/features/items/hooks/use-items.ts`

## Implementation Steps
1. Import `editItem` from `../services/item-service` and `EditItemInput` from `../types`
2. Add `handleEditItem` using `useCallback`:
   - Call `editItem({ id, list_id, new_text })`
   - On `result.success && result.deleted`: remove item from `items` state by filtering out `id`
   - On `result.success && !result.deleted`: replace item in `items` state with `result.item`
   - On `!result.success`: set `error` to `result.error`, return false
   - On success: clear `error`, return true
3. Return `editItem: handleEditItem` alongside existing `addItem`

## Constraints
- Follow existing `handleAddItem` pattern (useCallback, setItems updater function)
- Do not fetch from DB after write — update state directly from service result
- Return boolean to let the UI know if the edit succeeded

## Acceptance Criteria
- Calling the hook's `editItem` with empty text removes the item from state
- Calling with duplicate name sets error and does not modify items state
- Calling with valid new text updates the matching item in state

## Test Steps
1. Render a list screen, tap item, clear text and blur — item disappears
2. Render a list screen, tap item, type a duplicate name and blur — error shown, item unchanged
3. Render a list screen, tap item, type new text and blur — item text updates in list

# Task T004: Item Service

## Feature
F002 - Add Item

## Description
Implement the `addItem` service function that validates input and writes a new item to SQLite.

## Files
- `mobile/features/items/services/item-service.ts` (create)

## Implementation Steps
1. Create the directory `mobile/features/items/services/`
2. Create `item-service.ts`
3. Import `uuid` from `'uuid'`, `Item` and `CreateItemInput` from `'../types'`, and the three db functions from `'../db/items-db'`
4. Define a discriminated union result type:
   ```ts
   type AddItemResult =
     | { success: true; item: Item }
     | { success: false; error: string };
   ```
5. Implement `addItem(input: CreateItemInput): AddItemResult`:
   - Trim `input.text`
   - If trimmed text is empty → return `{ success: false, error: 'Text is required' }`
   - Call `itemTextExistsInList(trimmedText, input.list_id)`
   - If duplicate → return `{ success: false, error: 'An item with this name already exists' }`
   - Determine `order`: call `getItemsByList(input.list_id)`, take `items.length * 10 + 10` (append to end)
   - Build the `Item` object with a new UUID, `completed = false`, `deleted_at = null`, `created_at` and `updated_at` = `new Date().toISOString()`
   - Call `insertItem(item)`
   - Return `{ success: true, item }`

## Constraints
- No UI, no React imports
- Validation must happen before any DB write
- Use gap ordering strategy (×10 + 10) matching system-rules.md

## Acceptance Criteria
- Empty text → returns `success: false`
- Duplicate text (case-insensitive) → returns `success: false`
- Valid text → inserts item and returns `success: true` with the new item

## Test Steps
1. Call `addItem` with empty string → expect `success: false`
2. Call `addItem` with valid text → expect `success: true`, item present in `getItemsByList`
3. Call `addItem` with same text again → expect `success: false` (duplicate)

# Task T001: Add Sections DB Schema

## Feature
F006 - Create Section

## Description
Add the `sections` table to the SQLite schema initialization file.

## Files
- `mobile/db/schema/init.ts`

## Implementation Steps
1. Open `mobile/db/schema/init.ts`
2. Inside the `db.execSync` template literal, append a `CREATE TABLE IF NOT EXISTS sections` statement after the `items` table:
   ```sql
   CREATE TABLE IF NOT EXISTS sections (
     id TEXT PRIMARY KEY NOT NULL,
     list_id TEXT NOT NULL,
     name TEXT NOT NULL,
     "order" INTEGER NOT NULL DEFAULT 0,
     created_at TEXT NOT NULL,
     updated_at TEXT NOT NULL,
     deleted_at TEXT
   );
   ```

## Constraints
- Do not modify the lists or items table definitions
- Column names must use snake_case
- Match the schema shape in `docs/project-overview.md`

## Acceptance Criteria
- `sections` table is created on app start without errors
- All columns match the Section data model: id, list_id, name, order, created_at, updated_at, deleted_at

## Test Steps
1. Run the app
2. Confirm no crash on startup
3. Confirm the sections table exists in the SQLite file (or via app log if available)

## Notes
`"order"` must be quoted in SQL because `order` is a reserved keyword.

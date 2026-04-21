# Task T002: Items DB Schema

## Feature
F002 - Add Item

## Description
Add the `items` table to the SQLite schema initialisation so it is created on app start.

## Files
- `mobile/db/schema/init.ts` (modify)

## Implementation Steps
1. Open `mobile/db/schema/init.ts`
2. Inside the existing `db.execSync(...)` call, append a second `CREATE TABLE IF NOT EXISTS items` statement after the `lists` table DDL:
   ```sql
   CREATE TABLE IF NOT EXISTS items (
     id TEXT PRIMARY KEY NOT NULL,
     text TEXT NOT NULL,
     list_id TEXT NOT NULL,
     section_id TEXT,
     completed INTEGER NOT NULL DEFAULT 0,
     "order" INTEGER NOT NULL DEFAULT 0,
     created_at TEXT NOT NULL,
     updated_at TEXT NOT NULL,
     deleted_at TEXT
   );
   ```
3. Keep the existing `lists` DDL untouched

## Constraints
- Do not drop or recreate the `lists` table
- Use `CREATE TABLE IF NOT EXISTS` — schema must be idempotent
- `order` must be quoted because it is a reserved keyword in SQLite

## Acceptance Criteria
- App starts without error
- Running `SELECT * FROM items;` in the SQLite shell returns an empty result (table exists)

## Test Steps
1. Launch the app
2. Confirm no crash on startup

# Task T002: DB Schema Init

## Feature
F001 - Create List

## Description
Create the SQLite schema initialization function that creates the `lists` table. This runs once on app start.

## Files
- `mobile/db/schema/init.ts`

## Implementation Steps
1. Import `db` from `mobile/db/client`
2. Define and export an `initSchema()` function
3. Inside `initSchema`, run `db.execSync` with a `CREATE TABLE IF NOT EXISTS lists` statement
4. The lists table must include these columns:
   - `id TEXT PRIMARY KEY NOT NULL`
   - `name TEXT NOT NULL`
   - `owner_id TEXT NOT NULL`
   - `is_template INTEGER NOT NULL DEFAULT 0`
   - `created_at TEXT NOT NULL`
   - `updated_at TEXT NOT NULL`
   - `deleted_at TEXT`
5. Call `initSchema()` from `mobile/App.tsx` before rendering the app (at module level or in a setup effect)

## Constraints
- Use `db.execSync` for DDL statements
- Use `CREATE TABLE IF NOT EXISTS` — never drop or recreate tables
- Boolean stored as INTEGER (0/1) per SQLite convention

## Acceptance Criteria
- App starts without error
- `lists` table exists in the SQLite database after first launch
- Re-running `initSchema()` is idempotent

## Test Steps
1. Start the app — no crash
2. Verify table creation by querying `SELECT name FROM sqlite_master WHERE type='table' AND name='lists'` (can be logged temporarily)

# Task T003: Postgres Schema

## Feature
F003 - Sync Engine

## Description
Create the Postgres schema for `lists` and `items` tables, including Row-Level Security (RLS) policies so the server only returns data the requesting user owns or is shared on.

## Files
- `server/src/migrations/001-init.sql` (create)
- `server/src/migrate.ts` (create)

## Implementation Steps
1. Create `server/src/migrations/001-init.sql` with:
   - `CREATE TABLE IF NOT EXISTS lists` matching the data model (id, name, owner_id, is_template, created_at, updated_at, deleted_at)
   - `CREATE TABLE IF NOT EXISTS items` matching the data model (id, text, list_id, section_id, completed, order, created_at, updated_at, deleted_at)
   - `CREATE TABLE IF NOT EXISTS list_users` (list_id, user_id, access, created_at, updated_at, deleted_at)
   - `CREATE TABLE IF NOT EXISTS sync_meta` (user_id TEXT PRIMARY KEY, last_synced_at TEXT)
   - Enable RLS on `lists`, `items`, `list_users`:
     ```sql
     ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
     ```
   - RLS policy for `lists`: allow SELECT/INSERT/UPDATE if `owner_id = current_setting('app.user_id')` OR `id IN (SELECT list_id FROM list_users WHERE user_id = current_setting('app.user_id') AND deleted_at IS NULL)`
   - RLS policy for `items`: allow SELECT/INSERT/UPDATE if `list_id IN (SELECT id FROM lists WHERE ...)`  — reference the lists RLS logic
   - RLS policy for `list_users`: allow SELECT/INSERT/UPDATE if `user_id = current_setting('app.user_id')`
2. Create `server/src/migrate.ts`:
   - Read `001-init.sql` using `fs.readFileSync`
   - Execute it using the `pool` from `db.ts`
   - Export a `runMigrations()` function
3. Call `runMigrations()` in `server/src/index.ts` on startup before the server begins listening

## Constraints
- Use `current_setting('app.user_id')` for RLS (set per-request via `SET LOCAL app.user_id = ?`)
- No hard deletes — all tables have `deleted_at`
- `order` column in items must be quoted as `"order"` in SQL (reserved keyword)
- Must be idempotent (`CREATE TABLE IF NOT EXISTS`, `CREATE POLICY IF NOT EXISTS`)

## Acceptance Criteria
- Server starts and runs migrations without error against local Postgres
- Tables `lists`, `items`, `list_users`, `sync_meta` exist in the DB
- RLS is enabled on the main tables

## Test Steps
1. Start Postgres via `docker-compose up -d` in `server/docker/postgres/`
2. Start server — check logs for migration success
3. Connect to DB and verify tables: `\dt` in psql

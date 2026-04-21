# Task T003: Electrify PostgreSQL Tables

## Feature
F003-01 — ElectricSQL Migration

## Description
Add a new SQL migration that electrifies the `lists`, `items`, and `list_users` tables so ElectricSQL can sync them. Also drop the `sync_meta` table which is no longer needed. The existing `001-init.sql` must not be modified.

## Files
- `server/src/migrations/002-electric.sql` — create this new migration file

## Implementation Steps
1. Create `server/src/migrations/002-electric.sql`
2. Add `ALTER TABLE ... ENABLE ELECTRIC` for each synced table:
   - `ALTER TABLE lists ENABLE ELECTRIC;`
   - `ALTER TABLE items ENABLE ELECTRIC;`
   - `ALTER TABLE list_users ENABLE ELECTRIC;`
3. Drop the `sync_meta` table which tracked `last_synced_at` (no longer needed):
   - `DROP TABLE IF EXISTS sync_meta;`
4. Save the file
5. Open `server/src/migrate.ts` and verify the migration runner picks up files in order (alphabetically or by name). If it only runs a hardcoded file, update it to run all `.sql` files in the `migrations/` directory in sorted order.

## Constraints
- Do not modify `001-init.sql`
- Only electrify tables that are part of the sync model (`lists`, `items`, `list_users`)
- The `ENABLE ELECTRIC` command requires ElectricSQL to be running and connected to PostgreSQL before the migration runs

## Acceptance Criteria
- `server/src/migrations/002-electric.sql` exists and contains `ENABLE ELECTRIC` for all three tables
- `sync_meta` table is dropped
- Migration runner applies `002-electric.sql` after `001-init.sql`
- Running migrations against a live PostgreSQL + ElectricSQL instance completes without errors

## Test Steps
1. Confirm `002-electric.sql` exists with the correct SQL statements
2. Start PostgreSQL and ElectricSQL via docker-compose
3. Run `npm run migrate` (or equivalent) in `server/`
4. Query PostgreSQL to confirm `sync_meta` table no longer exists
5. Verify ElectricSQL logs show the tables as electrified

## Notes
ElectricSQL's `ENABLE ELECTRIC` command registers the table with the ElectricSQL service and enables CDC (Change Data Capture). This migration must run after the ElectricSQL service is running.

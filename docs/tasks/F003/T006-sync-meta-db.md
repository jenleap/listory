# Task T006: Sync Meta DB (Mobile)

## Feature
F003 - Sync Engine

## Description
Add a `sync_meta` table to the local SQLite database to persist `last_synced_at` per user. Provide read/write helpers for it.

## Files
- `mobile/db/schema/init.ts` (modify — add sync_meta table)
- `mobile/features/sync/db/sync-meta-db.ts` (create)

## Implementation Steps
1. In `mobile/db/schema/init.ts`, add to the `execSync` block:
   ```sql
   CREATE TABLE IF NOT EXISTS sync_meta (
     user_id TEXT PRIMARY KEY NOT NULL,
     last_synced_at TEXT
   );
   ```
2. Create `mobile/features/sync/db/sync-meta-db.ts`:
   - Import `db` from `../../../db/client`
   - Export `getLastSyncedAt(userId: string): string | null`:
     - SELECT `last_synced_at` from `sync_meta` where `user_id = ?`
     - Return the value or `null` if no row
   - Export `setLastSyncedAt(userId: string, timestamp: string): void`:
     - `INSERT OR REPLACE INTO sync_meta (user_id, last_synced_at) VALUES (?, ?)`

## Constraints
- Use `db.getFirstSync` for SELECT, `db.runSync` for writes
- No React state — this is a pure DB module
- `last_synced_at` is stored as ISO 8601 string

## Acceptance Criteria
- `sync_meta` table is created on app startup
- `getLastSyncedAt` returns `null` for unknown user
- `setLastSyncedAt` upserts correctly (subsequent calls update, not duplicate)

## Test Steps
1. Launch the app — check that `sync_meta` table exists via SQLite browser
2. Call `setLastSyncedAt('user-1', '2026-01-01T00:00:00Z')` and verify row inserted
3. Call again with a new timestamp and verify the row is updated, not duplicated

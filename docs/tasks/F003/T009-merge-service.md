# Task T009: Merge Service (Mobile)

## Feature
F003 - Sync Engine

## Description
Implement the merge service: apply incoming records from the server to local SQLite using Last Write Wins (LWW) conflict resolution and respecting `deleted_at`.

## Files
- `mobile/features/sync/services/merge-service.ts` (create)

## Implementation Steps
1. Create `mobile/features/sync/services/merge-service.ts`:
   - Import `db` from `../../../db/client`
   - Import `PullResponse`, `SyncListRecord`, `SyncItemRecord` from `../types`
   - Export `mergeRemoteChanges(data: PullResponse): void`:
     1. For each list in `data.lists`, call `mergeList(list)`
     2. For each item in `data.items`, call `mergeItem(item)`
   - Implement `mergeList(remote: SyncListRecord): void`:
     1. Fetch existing local record: `SELECT updated_at FROM lists WHERE id = ?`
     2. If no local record exists → INSERT the remote record
     3. If local record exists and `remote.updated_at > local.updated_at` → UPDATE all fields
     4. If local `updated_at` is newer or equal → skip (LWW: local wins)
   - Implement `mergeItem(remote: SyncItemRecord): void`:
     1. Same LWW logic as `mergeList` but for `items` table
     2. After insert/update: if `remote.deleted_at` is set, ensure `deleted_at` is written

## Constraints
- Must not hard delete records — only set `deleted_at`
- LWW comparison: compare `updated_at` as ISO 8601 strings (string comparison works for ISO 8601)
- `deleted_at` from the remote must be written even if it seems like a "downgrade"
- All writes use `db.runSync`
- Do not trigger any React state updates here

## Acceptance Criteria
- Incoming records with newer `updated_at` overwrite local records
- Incoming records with older `updated_at` are ignored
- Incoming records not in local DB are inserted
- Soft deletes (`deleted_at`) are written correctly
- No hard deletes occur

## Test Steps
1. Insert a local list with `updated_at = '2026-01-01'`
2. Call `mergeRemoteChanges` with the same list but `updated_at = '2026-06-01'`
3. Verify local record is updated
4. Call again with `updated_at = '2025-01-01'` — verify local record is unchanged
5. Call with a new list ID — verify it is inserted

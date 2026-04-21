# Task T007: Push Service (Mobile)

## Feature
F003 - Sync Engine

## Description
Implement the mobile push service: collect all locally modified records since `last_synced_at` and POST them to the server's `/sync/push` endpoint.

## Files
- `mobile/features/sync/services/push-service.ts` (create)

## Implementation Steps
1. Create `mobile/features/sync/services/push-service.ts`:
   - Import `db` from `../../../db/client`
   - Import `PushPayload`, `SyncListRecord`, `SyncItemRecord` from `../types`
   - Import `getLastSyncedAt` from `../db/sync-meta-db`
   - Export `pushLocalChanges(userId: string, serverUrl: string): Promise<void>`:
     1. Call `getLastSyncedAt(userId)` → `since` (use `'1970-01-01T00:00:00.000Z'` if null)
     2. Query SQLite for dirty lists:
        ```sql
        SELECT * FROM lists WHERE updated_at > ? AND deleted_at IS NULL OR deleted_at > ?
        ```
        Simplify to: `SELECT * FROM lists WHERE updated_at > ?`
     3. Query SQLite for dirty items: `SELECT * FROM items WHERE updated_at > ?`
     4. If both arrays are empty, return early (nothing to push)
     5. Build `PushPayload` from results
     6. `fetch(`${serverUrl}/sync/push`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': userId }, body: JSON.stringify(payload) })`
     7. If response is not ok, throw an error with the response status
     8. Return on success

## Constraints
- Do not update `last_synced_at` here — that happens in the orchestrator after pull+merge
- Include soft-deleted records in the push (server needs to know about deletes)
- Use `fetch` — no additional HTTP library
- Must not mutate local DB

## Acceptance Criteria
- Collects all records with `updated_at > last_synced_at` from SQLite
- Sends them to `POST /sync/push` with correct headers
- Throws on non-2xx response
- Returns early if no dirty records exist

## Test Steps
1. Add a list to SQLite with a recent `updated_at`
2. Call `pushLocalChanges('test-user', 'http://localhost:3000')`
3. Verify the record appears in Postgres via server

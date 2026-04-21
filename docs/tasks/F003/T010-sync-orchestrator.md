# Task T010: Sync Orchestrator (Mobile)

## Feature
F003 - Sync Engine

## Description
Implement the sync orchestrator that sequences push → pull → merge → finalize in a single atomic operation. This is the single entry point for all sync execution.

## Files
- `mobile/features/sync/services/sync-orchestrator.ts` (create)

## Implementation Steps
1. Create `mobile/features/sync/services/sync-orchestrator.ts`:
   - Import `pushLocalChanges` from `./push-service`
   - Import `pullRemoteChanges` from `./pull-service`
   - Import `mergeRemoteChanges` from `./merge-service`
   - Import `setLastSyncedAt` from `../db/sync-meta-db`
   - Export `runSync(userId: string, serverUrl: string): Promise<{ success: boolean; error?: string }>`:
     1. Record `syncStartedAt = new Date().toISOString()` before any network calls
     2. **Push phase**: call `pushLocalChanges(userId, serverUrl)`. On error: log the error string, return `{ success: false, error: 'push failed: ...' }` — do not proceed
     3. **Pull phase**: call `pullRemoteChanges(userId, serverUrl)`. On error: log error, return `{ success: false, error: 'pull failed: ...' }` — local state is intact
     4. **Merge phase**: call `mergeRemoteChanges(pullResult)`. On error: log error, return `{ success: false, error: 'merge failed: ...' }`
     5. **Finalize**: call `setLastSyncedAt(userId, syncStartedAt)`
     6. Return `{ success: true }`

## Constraints
- `syncStartedAt` must be captured before push, not after — ensures no updates are missed on the next sync
- Push failure aborts the sync — do not pull if push failed
- Pull failure is safe — local state is unmodified
- Merge errors must not corrupt local DB (merge service is synchronous and per-record)
- No React state or hooks here — pure service module

## Acceptance Criteria
- Calls push, then pull, then merge, then setLastSyncedAt in order
- Push failure returns early without pulling or merging
- `last_synced_at` is only updated on full success
- Returns `{ success: false, error: '...' }` on any phase failure

## Test Steps
1. Set up local dirty records and a running server
2. Call `runSync('test-user', 'http://localhost:3000')`
3. Verify push occurred, remote changes merged, `last_synced_at` updated in `sync_meta`
4. Simulate push failure (invalid URL) — verify `last_synced_at` not updated

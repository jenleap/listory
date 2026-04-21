# Task T008: Pull Service (Mobile)

## Feature
F003 - Sync Engine

## Description
Implement the mobile pull service: fetch all records updated on the server since `last_synced_at` and return them for merging.

## Files
- `mobile/features/sync/services/pull-service.ts` (create)

## Implementation Steps
1. Create `mobile/features/sync/services/pull-service.ts`:
   - Import `PullResponse` from `../types`
   - Import `getLastSyncedAt` from `../db/sync-meta-db`
   - Export `pullRemoteChanges(userId: string, serverUrl: string): Promise<PullResponse>`:
     1. Call `getLastSyncedAt(userId)` → `since` (default `'1970-01-01T00:00:00.000Z'` if null)
     2. Build URL: `${serverUrl}/sync/pull?since=${encodeURIComponent(since)}`
     3. `fetch(url, { headers: { 'x-user-id': userId } })`
     4. If response is not ok, throw an error
     5. Parse JSON response as `PullResponse`
     6. Return the parsed response

## Constraints
- Must not write to local DB — that is the merge service's responsibility
- Use `fetch`
- Default to epoch timestamp if `last_synced_at` is null (triggers full sync)

## Acceptance Criteria
- Requests `GET /sync/pull?since=<timestamp>` with correct `x-user-id` header
- Returns typed `PullResponse` with `lists` and `items` arrays
- Throws on non-2xx response
- Returns `{ lists: [], items: [] }` when server has no updates

## Test Steps
1. Insert a record in Postgres for `owner_id = 'test-user'`
2. Call `pullRemoteChanges('test-user', 'http://localhost:3000')`
3. Verify the returned object contains the inserted record

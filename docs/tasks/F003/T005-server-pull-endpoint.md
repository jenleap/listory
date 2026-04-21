# Task T005: Server Pull Endpoint

## Feature
F003 - Sync Engine

## Description
Implement `GET /sync/pull` on the server. Returns all records owned by or shared with the requesting user that have been updated since `last_synced_at`.

## Files
- `server/src/routes/sync.ts` (modify — add GET /pull)

## Implementation Steps
1. Add `GET /pull` route to the sync router:
   - Read `user_id` from `x-user-id` header — return 401 if missing
   - Read `since` query param (ISO 8601 string) — if missing, default to `'1970-01-01T00:00:00.000Z'` (full sync)
   - Acquire a client from `pool`
   - Set RLS context: `SET LOCAL app.user_id = '<user_id>'`
   - Query `lists` where `updated_at > $since` (RLS filters ownership automatically)
   - Query `items` where `updated_at > $since` (RLS filters via list ownership)
   - Release client
   - Return `{ lists: [...], items: [...] }`
2. Ensure the RLS context is set within the same client/connection that runs the queries (do not use `pool.query` for the RLS set + data query — use a checked-out client)

## Constraints
- RLS must be active — the server must not return unauthorized data
- `deleted_at` records must be included in the response (client needs to know about deletes)
- Use parameterized queries
- Return empty arrays, not null, when there are no updates

## Acceptance Criteria
- `GET /sync/pull?since=<timestamp>` returns lists and items updated after the timestamp
- Records belonging to other users are not returned
- Soft-deleted records (deleted_at set) are included
- Missing `x-user-id` returns 401

## Test Steps
1. Insert test records into Postgres with `owner_id = 'test-user'`
2. `GET /sync/pull?since=1970-01-01T00:00:00Z` with `x-user-id: test-user`
3. Verify all owned records are returned
4. Make request with a different `x-user-id` — verify those records are not returned

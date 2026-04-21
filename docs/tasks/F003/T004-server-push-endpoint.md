# Task T004: Server Push Endpoint

## Feature
F003 - Sync Engine

## Description
Implement `POST /sync/push` on the server. Accepts a batch of local records from the mobile client and upserts them into Postgres, respecting LWW conflict resolution and RLS.

## Files
- `server/src/routes/sync.ts` (create)
- `server/src/index.ts` (modify — mount sync router)

## Implementation Steps
1. Create `server/src/routes/sync.ts`:
   - Export an Express Router
   - Implement `POST /push`:
     - Read `user_id` from request header `x-user-id` (simple auth for now)
     - If missing, return 401
     - Parse body as `{ lists: SyncListRecord[], items: SyncItemRecord[] }`
     - Acquire a client from `pool`
     - Begin a transaction
     - Set RLS context: `SET LOCAL app.user_id = '<user_id>'`
     - For each list in `body.lists`:
       - Upsert into `lists` using `INSERT ... ON CONFLICT (id) DO UPDATE SET ... WHERE excluded.updated_at > lists.updated_at`
     - For each item in `body.items`:
       - Upsert into `items` using the same LWW pattern
     - Commit transaction
     - Return `{ success: true, count: { lists: N, items: N } }`
     - On error: rollback, return 500
2. In `server/src/index.ts`:
   - Import sync router
   - Mount at `/sync`

## Constraints
- All DB writes go through a transaction with RLS context set
- LWW: only overwrite if incoming `updated_at` is newer than stored
- `deleted_at` must be upserted as-is (not stripped)
- Use parameterized queries — no string interpolation with user data
- Do not implement authentication beyond the `x-user-id` header for now

## Acceptance Criteria
- `POST /sync/push` with valid `x-user-id` header accepts lists/items and upserts them
- Missing `x-user-id` returns 401
- Records with older `updated_at` than existing do not overwrite
- Returns count of processed records

## Test Steps
1. Start server
2. POST to `http://localhost:3000/sync/push` with header `x-user-id: test-user` and body `{ "lists": [...], "items": [] }`
3. Verify records appear in Postgres
4. POST again with older `updated_at` — verify no overwrite

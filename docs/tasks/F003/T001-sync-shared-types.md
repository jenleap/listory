# Task T001: Sync Shared Types

## Feature
F003 - Sync Engine

## Description
Define TypeScript types shared across the sync system: records, payloads, and responses used by both mobile push/pull services and the server endpoints.

## Files
- `mobile/features/sync/types/index.ts` (create)

## Implementation Steps
1. Create folder `mobile/features/sync/types/`
2. Create `index.ts` with the following types:
   - `SyncableRecord` — base shape with `id`, `updated_at`, `deleted_at`
   - `SyncListRecord` — extends SyncableRecord with list fields
   - `SyncItemRecord` — extends SyncableRecord with item fields
   - `PushPayload` — `{ lists: SyncListRecord[], items: SyncItemRecord[] }`
   - `PullResponse` — `{ lists: SyncListRecord[], items: SyncItemRecord[] }`
   - `SyncMeta` — `{ last_synced_at: string | null }`

## Constraints
- TypeScript only, no runtime logic
- Field names must match SQLite column names (snake_case)
- `deleted_at` must be `string | null`
- Do not introduce new libraries

## Acceptance Criteria
- All types are exported from `mobile/features/sync/types/index.ts`
- Types match the data model in `docs/project-overview.md`
- No TypeScript errors

## Test Steps
1. Import types in another file and verify no TS errors

## Notes
These types are consumed by T008 (push-service), T009 (pull-service), T010 (merge-service), and T004/T005 (server endpoints).

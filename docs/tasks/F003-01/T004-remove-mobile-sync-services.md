# Task T004: Remove Mobile Sync Services

## Feature
F003-01 — ElectricSQL Migration

## Description
Delete the manual push/pull/merge services and the sync-meta database module from the mobile sync feature. These are replaced by ElectricSQL's automatic sync.

## Files
- `mobile/features/sync/services/push-service.ts` — delete
- `mobile/features/sync/services/pull-service.ts` — delete
- `mobile/features/sync/services/merge-service.ts` — delete
- `mobile/features/sync/services/sync-orchestrator.ts` — delete
- `mobile/features/sync/db/sync-meta-db.ts` — delete

## Implementation Steps
1. Delete `mobile/features/sync/services/push-service.ts`
2. Delete `mobile/features/sync/services/pull-service.ts`
3. Delete `mobile/features/sync/services/merge-service.ts`
4. Delete `mobile/features/sync/services/sync-orchestrator.ts`
5. Delete `mobile/features/sync/db/sync-meta-db.ts`
6. Search the codebase for any remaining imports of these deleted files and remove them

## Constraints
- Do not delete `mobile/features/sync/hooks/use-sync.ts` — it will be replaced in T007
- Do not delete `mobile/features/sync/types/index.ts` — it will be updated in T005
- Do not modify any files outside `mobile/features/sync/`

## Acceptance Criteria
- All five listed files are deleted
- No other file in the codebase imports from `push-service`, `pull-service`, `merge-service`, `sync-orchestrator`, or `sync-meta-db`
- TypeScript build shows no errors related to these deleted files (only `use-sync.ts` may have broken imports at this stage, which will be fixed in T007)

## Test Steps
1. Confirm all five files are deleted
2. Run `grep -r "push-service\|pull-service\|merge-service\|sync-orchestrator\|sync-meta-db" mobile/` to verify no remaining imports
3. Note any TypeScript errors in `use-sync.ts` — these are expected and will be resolved in T007

## Notes
After this task, `use-sync.ts` will have broken imports (`runSync` no longer exists). This is intentional — T007 replaces the hook entirely.

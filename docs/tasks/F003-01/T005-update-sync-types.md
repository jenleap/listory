# Task T005: Update Sync Types

## Feature
F003-01 — ElectricSQL Migration

## Description
Replace the push/pull-specific types in the sync types file with ElectricSQL-compatible types. Remove `PushPayload`, `PullResponse`, and `SyncMeta`. Keep `SyncableRecord` and the table record interfaces as they reflect the shared data shape.

## Files
- `mobile/features/sync/types/index.ts` — rewrite

## Implementation Steps
1. Open `mobile/features/sync/types/index.ts`
2. Remove these interfaces:
   - `PushPayload`
   - `PullResponse`
   - `SyncMeta`
3. Keep these interfaces (they describe synced table row shapes):
   - `SyncableRecord`
   - `SyncListRecord`
   - `SyncItemRecord`
4. Add a new `ElectricSyncStatus` type to represent connection state:
   ```ts
   export type ElectricSyncStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
   ```
5. Save the file

## Constraints
- Do not add types that are not used by ElectricSQL hooks or services
- Keep the file minimal — only types required by T006 and T007

## Acceptance Criteria
- `mobile/features/sync/types/index.ts` no longer exports `PushPayload`, `PullResponse`, or `SyncMeta`
- `SyncableRecord`, `SyncListRecord`, and `SyncItemRecord` remain exported
- `ElectricSyncStatus` is exported
- No other file imports the removed types

## Test Steps
1. Open `mobile/features/sync/types/index.ts` and confirm removed types are gone
2. Run `grep -r "PushPayload\|PullResponse\|SyncMeta" mobile/` to confirm no remaining usages
3. TypeScript build reports no errors from this file

## Notes
`SyncListRecord` and `SyncItemRecord` remain useful as typed representations of ElectricSQL shape query results.

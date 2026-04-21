# Task T007: Replace use-sync Hook with ElectricSQL Hook

## Feature
F003-01 — ElectricSQL Migration

## Description
Replace the manual `useSync` hook (which called `runSync` with push/pull/merge phases) with a new hook that initializes the ElectricSQL client and syncs shapes for `lists` and `items`. The hook exposes connection status and a manual reconnect function.

## Files
- `mobile/features/sync/hooks/use-sync.ts` — rewrite entirely

## Implementation Steps
1. Open `mobile/features/sync/hooks/use-sync.ts` and delete all existing content
2. Implement a new `useSync` hook:
   - Import `useEffect`, `useState`, `useRef` from React
   - Import `NetInfo` from `@react-native-community/netinfo`
   - Import `initElectric` from `../services/electric-client`
   - Import `ElectricSyncStatus` from `../types`
   - Inside the hook:
     a. Declare state: `status: ElectricSyncStatus` (initial value: `'connecting'`)
     b. Declare a `clientRef` to hold the Electric client instance
     c. Implement `connect()` async function:
        - Set status to `'connecting'`
        - Call `initElectric()`
        - On success: store client in `clientRef`, call `syncShapes()`, set status to `'connected'`
        - On error: set status to `'error'`, log the error
     d. Implement `syncShapes()` function:
        - Call `clientRef.current.db.lists.sync()` to subscribe to `lists` shape
        - Call `clientRef.current.db.items.sync()` to subscribe to `items` shape
     e. `useEffect` on mount: call `connect()`
     f. `useEffect` for network reconnect:
        - Use `NetInfo.addEventListener` to watch `isConnected`
        - If transitioning from `false` → `true` and `status !== 'connected'`, call `connect()`
        - Return the unsubscribe function
3. Return `{ status, reconnect: connect }` from the hook

## Constraints
- Do not call push/pull/merge or any manual HTTP sync
- The hook must not block the UI — all Electric calls are async and non-blocking
- If Electric client initialization fails, set status to `'error'` and do not crash
- Keep the same return shape convention as before: a simple object with status and a manual trigger

## Acceptance Criteria
- `use-sync.ts` no longer imports from `sync-orchestrator`, `push-service`, `pull-service`, `merge-service`, or `sync-meta-db`
- The hook calls `initElectric()` on mount
- The hook subscribes to `lists` and `items` shapes after connecting
- The hook re-connects when the network transitions from offline to online
- `status` reflects the current connection state using `ElectricSyncStatus`
- TypeScript compiles without errors

## Test Steps
1. Start the app and confirm the hook initializes without errors
2. Start with network offline, then reconnect — confirm `connect()` is called automatically
3. Check that `status` transitions: `'connecting'` → `'connected'` when Electric service is reachable
4. Check that `status` transitions to `'error'` when Electric service is unreachable
5. Verify lists and items sync from PostgreSQL to local SQLite via ElectricSQL

## Notes
After this task, the full ElectricSQL migration is complete. The manual sync pipeline (push → pull → merge → finalize) is fully replaced by ElectricSQL's continuous subscription model.

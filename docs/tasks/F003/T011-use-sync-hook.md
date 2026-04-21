# Task T011: useSync Hook + App Integration

## Feature
F003 - Sync Engine

## Description
Implement the `useSync` hook that exposes sync state (syncing/error) and triggers sync on app launch and network reconnect. Wire it into `App.tsx`.

## Files
- `mobile/features/sync/hooks/use-sync.ts` (create)
- `mobile/App.tsx` (modify — call useSync)

## Implementation Steps
1. Create `mobile/features/sync/hooks/use-sync.ts`:
   - Import `useEffect`, `useState` from `react`
   - Import `useNetInfo` from `@react-native-community/netinfo`
   - Import `runSync` from `../services/sync-orchestrator`
   - Import `AppState` from `react-native`
   - Define constants: `USER_ID` (hardcoded `'local-user'` for now), `SERVER_URL` (hardcoded `'http://localhost:3000'` for now)
   - Export `useSync()`:
     - State: `syncing: boolean`, `lastError: string | null`
     - Implement `triggerSync()`:
       - If already syncing, return
       - Set `syncing = true`, `lastError = null`
       - Call `runSync(USER_ID, SERVER_URL)`
       - On result: if `!result.success`, set `lastError = result.error`
       - Set `syncing = false`
     - `useEffect` on mount: call `triggerSync()` once (app launch)
     - `useEffect` on `netInfo.isConnected`: call `triggerSync()` when it transitions from false → true (network reconnect)
     - Return `{ syncing, lastError, triggerSync }`

2. In `mobile/App.tsx`:
   - Import `useSync`
   - Call `useSync()` at the top of the root component
   - Optionally display a subtle sync indicator (a `Text` saying "Syncing..." visible only when `syncing === true`) — place it outside the navigator, at the top of the screen

## Constraints
- Install `@react-native-community/netinfo` if not already present
- `USER_ID` and `SERVER_URL` are hardcoded constants for now — no auth system yet
- Sync must not block UI — all async, state updates trigger re-render naturally
- Do not debounce network reconnect for now

## Acceptance Criteria
- `useSync` triggers sync automatically on app launch
- `useSync` triggers sync when network reconnects (isConnected transitions false → true)
- `syncing` is `true` while sync is in progress
- `lastError` is set when sync fails, null on success
- App compiles and runs without errors

## Test Steps
1. Launch the app — verify sync is triggered (check server logs for push/pull requests)
2. Disable network → re-enable — verify sync triggers again
3. With server offline, verify `lastError` is set after failed sync

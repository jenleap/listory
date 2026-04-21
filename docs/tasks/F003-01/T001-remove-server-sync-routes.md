# Task T001: Remove Server Sync Routes

## Feature
F003-01 — ElectricSQL Migration

## Description
Delete the Express `/push` and `/pull` sync endpoints and remove the syncRouter from the server entry point. ElectricSQL replaces these routes entirely.

## Files
- `server/src/routes/sync.ts` — delete this file
- `server/src/index.ts` — remove syncRouter import and `app.use('/sync', syncRouter)` line

## Implementation Steps
1. Delete `server/src/routes/sync.ts`
2. Open `server/src/index.ts`
3. Remove the line: `import { syncRouter } from './routes/sync';`
4. Remove the line: `app.use('/sync', syncRouter);`
5. Save `server/src/index.ts`

## Constraints
- Do not remove the `/health` endpoint
- Do not remove `runMigrations()` or the server start logic
- Do not modify any other server files

## Acceptance Criteria
- `server/src/routes/sync.ts` no longer exists
- `server/src/index.ts` has no reference to `syncRouter` or `./routes/sync`
- Server starts without errors (no reference to deleted file)

## Test Steps
1. Confirm `server/src/routes/sync.ts` is deleted
2. Open `server/src/index.ts` and verify no sync route imports remain
3. Run `npm run build` in `server/` and confirm it compiles without errors

## Notes
The `/push` and `/pull` endpoints are replaced by ElectricSQL's automatic bidirectional sync. No replacement routes are needed.

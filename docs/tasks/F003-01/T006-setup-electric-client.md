# Task T006: Set Up ElectricSQL Client

## Feature
F003-01 — ElectricSQL Migration

## Description
Install the ElectricSQL client package for React Native and create an initialization module that establishes the ElectricSQL connection bound to the local SQLite database. This module is used by the sync hook in T007.

## Files
- `mobile/package.json` — add `electric-sql` dependency
- `mobile/features/sync/services/electric-client.ts` — create this file

## Implementation Steps
1. In `mobile/`, run:
   ```
   npm install electric-sql
   ```
2. Create `mobile/features/sync/services/electric-client.ts`
3. In the new file:
   - Import `electrify` and the React Native SQLite adapter from `electric-sql`
   - Import the local SQLite database instance from the existing mobile DB module
   - Export an `initElectric` async function that:
     - Calls `electrify(db, schema, config)` with the Electric service URL from an environment variable or constant (`ELECTRIC_URL`, defaulting to `http://localhost:5133`)
     - Returns the Electric client instance
   - Export a module-level `electricClient` variable (initially `null`) that is set after `initElectric` resolves
4. The schema passed to `electrify` must include the `lists`, `items`, and `list_users` tables with their column definitions matching `001-init.sql`

## Constraints
- Use `electric-sql` package — do not introduce any other sync library
- The Electric service URL must be configurable (constant or env var), not hardcoded
- Do not initialize ElectricSQL inside a React component — keep initialization in this service module
- Follow the offline-first pattern: if `initElectric` fails, log the error and allow the app to continue with local SQLite only

## Acceptance Criteria
- `electric-sql` appears in `mobile/package.json` dependencies
- `mobile/features/sync/services/electric-client.ts` exists and exports `initElectric` and `electricClient`
- `initElectric` connects to the ElectricSQL service and returns a client without throwing on network failure
- TypeScript compiles without errors

## Test Steps
1. Confirm `electric-sql` is in `mobile/package.json`
2. Start ElectricSQL via docker-compose
3. Call `initElectric()` and confirm it resolves without error when the service is available
4. Call `initElectric()` with the service offline and confirm it does not crash the app

## Notes
The ElectricSQL client wraps the local SQLite instance and intercepts writes to stream them to PostgreSQL via the Electric service. It also listens for server-side changes and applies them locally.

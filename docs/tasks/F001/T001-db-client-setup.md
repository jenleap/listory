# Task T001: DB Client Setup

## Feature
F001 - Create List

## Description
Initialize the expo-sqlite database client that will be used across all features.

## Files
- `mobile/db/client.ts`

## Implementation Steps
1. Import `openDatabaseSync` from `expo-sqlite`
2. Open (or create) a database named `listory.db` using `openDatabaseSync`
3. Export the `db` instance as a named export

## Constraints
- Use `expo-sqlite` only (already installed)
- Export as a singleton — one shared instance across the app
- Do not add connection pooling or abstractions

## Acceptance Criteria
- `mobile/db/client.ts` exports a `db` constant
- The db instance is created with `openDatabaseSync('listory.db')`

## Test Steps
1. Import `db` from `mobile/db/client` in another file — no runtime error on app start

## Notes
This is the foundational DB setup required by all subsequent tasks.

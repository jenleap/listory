# Task T001: Add users and list_users tables to schema

## Feature
F009 - Share List

## Description
Add `users` and `list_users` tables to `db/schema/init.ts`. Seed two test users so the share flow can be manually tested.

## Files
- `mobile/db/schema/init.ts` (modify)

## Implementation Steps
1. Open `mobile/db/schema/init.ts`
2. Append the following two CREATE TABLE statements inside the existing `db.execSync` call, after the `sync_meta` block:
   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id TEXT PRIMARY KEY NOT NULL,
     email TEXT NOT NULL,
     name TEXT NOT NULL,
     password_hash TEXT NOT NULL,
     created_at TEXT NOT NULL
   );

   CREATE TABLE IF NOT EXISTS list_users (
     list_id TEXT NOT NULL,
     user_id TEXT NOT NULL,
     access TEXT NOT NULL,
     created_at TEXT NOT NULL,
     updated_at TEXT NOT NULL,
     deleted_at TEXT,
     PRIMARY KEY (list_id, user_id)
   );
   ```
3. After the `db.execSync` call (on the next line), add seed inserts using `db.runSync` with INSERT OR IGNORE to avoid re-inserting on hot reload:
   ```ts
   db.runSync(
     `INSERT OR IGNORE INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)`,
     ['user-1', 'alice@example.com', 'Alice', '', new Date().toISOString()]
   );
   db.runSync(
     `INSERT OR IGNORE INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)`,
     ['user-2', 'bob@example.com', 'Bob', '', new Date().toISOString()]
   );
   ```

## Constraints
- Do not modify existing table definitions
- Use `PRIMARY KEY (list_id, user_id)` composite key for `list_users`
- `access` is stored as TEXT (values enforced at service layer)

## Acceptance Criteria
- `users` table exists after `initSchema()` runs
- `list_users` table exists after `initSchema()` runs
- `users` table contains rows for `user-1` (alice@example.com) and `user-2` (bob@example.com) on first run
- Calling `initSchema()` multiple times does not throw (idempotent)

## Test Steps
1. Run the app and verify no crash on startup
2. Open the Expo SQLite inspector or add a `db.getAllSync('SELECT * FROM users')` log to confirm seed rows exist

## Notes
Seed data uses INSERT OR IGNORE so hot reloads do not fail on the PRIMARY KEY constraint.

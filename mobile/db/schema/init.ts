import { db } from '../client';

export function initSchema(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS lists (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      is_template INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY NOT NULL,
      text TEXT NOT NULL,
      list_id TEXT NOT NULL,
      section_id TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_meta (
      user_id TEXT PRIMARY KEY NOT NULL,
      last_synced_at TEXT
    );
  `);
}

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

CREATE TABLE IF NOT EXISTS list_users (
  list_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  access TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (list_id, user_id)
);

CREATE TABLE IF NOT EXISTS sync_meta (
  user_id TEXT PRIMARY KEY NOT NULL,
  last_synced_at TEXT
);

ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lists_policy ON lists;
CREATE POLICY lists_policy ON lists
  FOR ALL
  USING (
    owner_id = current_setting('app.user_id', true)
    OR id IN (
      SELECT list_id FROM list_users
      WHERE user_id = current_setting('app.user_id', true)
        AND deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS items_policy ON items;
CREATE POLICY items_policy ON items
  FOR ALL
  USING (
    list_id IN (
      SELECT id FROM lists
      WHERE owner_id = current_setting('app.user_id', true)
        OR id IN (
          SELECT list_id FROM list_users
          WHERE user_id = current_setting('app.user_id', true)
            AND deleted_at IS NULL
        )
    )
  );

DROP POLICY IF EXISTS list_users_policy ON list_users;
CREATE POLICY list_users_policy ON list_users
  FOR ALL
  USING (user_id = current_setting('app.user_id', true));

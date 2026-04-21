import { db } from '../../../db/client';
import { List } from '../types';

export function insertList(list: List): void {
  db.runSync(
    `INSERT INTO lists (id, name, owner_id, is_template, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      list.id,
      list.name,
      list.owner_id,
      list.is_template ? 1 : 0,
      list.created_at,
      list.updated_at,
      list.deleted_at,
    ]
  );
}

export function getListsByOwner(owner_id: string): List[] {
  const rows = db.getAllSync<{
    id: string;
    name: string;
    owner_id: string;
    is_template: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>(
    'SELECT * FROM lists WHERE owner_id = ? AND deleted_at IS NULL ORDER BY created_at ASC',
    [owner_id]
  );

  return rows.map((row) => ({
    ...row,
    is_template: row.is_template === 1,
  }));
}

export function listNameExistsForOwner(name: string, owner_id: string): boolean {
  const row = db.getFirstSync<{ id: string }>(
    `SELECT id FROM lists WHERE owner_id = ? AND deleted_at IS NULL AND LOWER(TRIM(name)) = LOWER(TRIM(?))`,
    [owner_id, name]
  );
  return row != null;
}

import { db } from '../../../db/client';
import { Item } from '../types';

export function insertItem(item: Item): void {
  db.runSync(
    `INSERT INTO items (id, text, list_id, section_id, completed, "order", created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.text,
      item.list_id,
      item.section_id,
      item.completed ? 1 : 0,
      item.order,
      item.created_at,
      item.updated_at,
      item.deleted_at,
    ]
  );
}

export function getItemsByList(list_id: string): Item[] {
  const rows = db.getAllSync<{
    id: string;
    text: string;
    list_id: string;
    section_id: string | null;
    completed: number;
    order: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>(
    `SELECT * FROM items WHERE list_id = ? AND deleted_at IS NULL ORDER BY "order" ASC`,
    [list_id]
  );

  return rows.map((row) => ({
    ...row,
    completed: row.completed === 1,
  }));
}

export function itemTextExistsInList(text: string, list_id: string): boolean {
  const row = db.getFirstSync<{ id: string }>(
    `SELECT id FROM items WHERE list_id = ? AND deleted_at IS NULL AND LOWER(TRIM(text)) = LOWER(TRIM(?))`,
    [list_id, text]
  );
  return row != null;
}

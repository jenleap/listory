import { db } from '../../../db/client';
import { PullResponse, SyncListRecord, SyncItemRecord } from '../types';

export function mergeRemoteChanges(data: PullResponse): void {
  for (const list of data.lists) {
    mergeList(list);
  }
  for (const item of data.items) {
    mergeItem(item);
  }
}

function mergeList(remote: SyncListRecord): void {
  const existing = db.getFirstSync<{ updated_at: string }>(
    'SELECT updated_at FROM lists WHERE id = ?',
    [remote.id]
  );

  if (!existing) {
    db.runSync(
      `INSERT INTO lists (id, name, owner_id, is_template, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [remote.id, remote.name, remote.owner_id, remote.is_template, remote.created_at, remote.updated_at, remote.deleted_at]
    );
    return;
  }

  if (remote.updated_at > existing.updated_at) {
    db.runSync(
      `UPDATE lists SET name = ?, owner_id = ?, is_template = ?, updated_at = ?, deleted_at = ?
       WHERE id = ?`,
      [remote.name, remote.owner_id, remote.is_template, remote.updated_at, remote.deleted_at, remote.id]
    );
  }
}

function mergeItem(remote: SyncItemRecord): void {
  const existing = db.getFirstSync<{ updated_at: string }>(
    'SELECT updated_at FROM items WHERE id = ?',
    [remote.id]
  );

  if (!existing) {
    db.runSync(
      `INSERT INTO items (id, text, list_id, section_id, completed, "order", created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [remote.id, remote.text, remote.list_id, remote.section_id, remote.completed, remote.order, remote.created_at, remote.updated_at, remote.deleted_at]
    );
    return;
  }

  if (remote.updated_at > existing.updated_at) {
    db.runSync(
      `UPDATE items SET text = ?, list_id = ?, section_id = ?, completed = ?, "order" = ?, updated_at = ?, deleted_at = ?
       WHERE id = ?`,
      [remote.text, remote.list_id, remote.section_id, remote.completed, remote.order, remote.updated_at, remote.deleted_at, remote.id]
    );
  }
}

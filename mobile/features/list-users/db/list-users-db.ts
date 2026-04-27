import { db } from '../../../db/client';
import { ListUser, ListUserWithName } from '../types';

export function insertListUser(record: ListUser): void {
  db.runSync(
    `INSERT INTO list_users (list_id, user_id, access, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [record.list_id, record.user_id, record.access, record.created_at, record.updated_at, record.deleted_at]
  );
}

export function upsertListUserAccess(
  list_id: string,
  user_id: string,
  access: 'write' | 'read',
  updatedAt: string
): void {
  db.runSync(
    `UPDATE list_users SET access = ?, updated_at = ?, deleted_at = NULL WHERE list_id = ? AND user_id = ?`,
    [access, updatedAt, list_id, user_id]
  );
}

export function getListUserExists(list_id: string, user_id: string): boolean {
  const row = db.getFirstSync<{ user_id: string }>(
    `SELECT user_id FROM list_users WHERE list_id = ? AND user_id = ?`,
    [list_id, user_id]
  );
  return row != null;
}

export function softDeleteListUser(list_id: string, user_id: string, deletedAt: string, updatedAt: string): void {
  db.runSync(
    `UPDATE list_users SET deleted_at = ?, updated_at = ? WHERE list_id = ? AND user_id = ?`,
    [deletedAt, updatedAt, list_id, user_id]
  );
}

export function getListUsersWithNames(list_id: string): ListUserWithName[] {
  return db.getAllSync<ListUserWithName>(
    `SELECT lu.list_id, lu.user_id, lu.access, lu.created_at, lu.updated_at, lu.deleted_at,
            u.name, u.email
     FROM list_users lu
     JOIN users u ON u.id = lu.user_id
     WHERE lu.list_id = ? AND lu.deleted_at IS NULL`,
    [list_id]
  );
}

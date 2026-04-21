import { db } from '../../../db/client';

export function getLastSyncedAt(userId: string): string | null {
  const row = db.getFirstSync<{ last_synced_at: string | null }>(
    'SELECT last_synced_at FROM sync_meta WHERE user_id = ?',
    [userId]
  );
  return row?.last_synced_at ?? null;
}

export function setLastSyncedAt(userId: string, timestamp: string): void {
  db.runSync(
    'INSERT OR REPLACE INTO sync_meta (user_id, last_synced_at) VALUES (?, ?)',
    [userId, timestamp]
  );
}

import { db } from '../../../db/client';
import { PushPayload, SyncListRecord, SyncItemRecord } from '../types';
import { getLastSyncedAt } from '../db/sync-meta-db';

export async function pushLocalChanges(userId: string, serverUrl: string): Promise<void> {
  const since = getLastSyncedAt(userId) ?? '1970-01-01T00:00:00.000Z';

  const lists = db.getAllSync<SyncListRecord>(
    'SELECT * FROM lists WHERE updated_at > ?',
    [since]
  );
  const items = db.getAllSync<SyncItemRecord>(
    'SELECT * FROM items WHERE updated_at > ?',
    [since]
  );

  if (lists.length === 0 && items.length === 0) {
    return;
  }

  const payload: PushPayload = { lists, items };

  const response = await fetch(`${serverUrl}/sync/push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Push failed with status ${response.status}`);
  }
}

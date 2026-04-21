import { PullResponse } from '../types';
import { getLastSyncedAt } from '../db/sync-meta-db';

export async function pullRemoteChanges(userId: string, serverUrl: string): Promise<PullResponse> {
  const since = getLastSyncedAt(userId) ?? '1970-01-01T00:00:00.000Z';
  const url = `${serverUrl}/sync/pull?since=${encodeURIComponent(since)}`;

  const response = await fetch(url, {
    headers: { 'x-user-id': userId },
  });

  if (!response.ok) {
    throw new Error(`Pull failed with status ${response.status}`);
  }

  return response.json() as Promise<PullResponse>;
}

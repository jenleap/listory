import { pushLocalChanges } from './push-service';
import { pullRemoteChanges } from './pull-service';
import { mergeRemoteChanges } from './merge-service';
import { setLastSyncedAt } from '../db/sync-meta-db';

export async function runSync(
  userId: string,
  serverUrl: string
): Promise<{ success: boolean; error?: string }> {
  const syncStartedAt = new Date().toISOString();

  try {
    await pushLocalChanges(userId, serverUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Sync push failed:', message);
    return { success: false, error: `push failed: ${message}` };
  }

  let pullResult;
  try {
    pullResult = await pullRemoteChanges(userId, serverUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Sync pull failed:', message);
    return { success: false, error: `pull failed: ${message}` };
  }

  try {
    mergeRemoteChanges(pullResult);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Sync merge failed:', message);
    return { success: false, error: `merge failed: ${message}` };
  }

  setLastSyncedAt(userId, syncStartedAt);
  return { success: true };
}

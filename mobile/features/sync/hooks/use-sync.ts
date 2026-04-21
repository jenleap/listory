import { useEffect, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { runSync } from '../services/sync-orchestrator';

const USER_ID = 'local-user';
const SERVER_URL = 'http://localhost:3000';

export function useSync() {
  const [syncing, setSyncing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const syncingRef = useRef(false);
  const wasConnected = useRef<boolean | null>(null);

  async function triggerSync() {
    if (syncingRef.current) return;
    syncingRef.current = true;
    setSyncing(true);
    setLastError(null);

    const result = await runSync(USER_ID, SERVER_URL);

    if (!result.success) {
      setLastError(result.error ?? 'Unknown sync error');
    }

    syncingRef.current = false;
    setSyncing(false);
  }

  useEffect(() => {
    triggerSync();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected ?? false;
      if (wasConnected.current === false && isConnected) {
        triggerSync();
      }
      wasConnected.current = isConnected;
    });
    return unsubscribe;
  }, []);

  return { syncing, lastError, triggerSync };
}

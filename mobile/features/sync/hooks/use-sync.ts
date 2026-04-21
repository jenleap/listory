import { useCallback, useEffect, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { db } from '../../../db/client';
import { initElectric, ElectricClient, ShapeMessage } from '../services/electric-client';
import { ElectricSyncStatus } from '../types';

function applyListMessage(msg: ShapeMessage): void {
  const v = msg.value as {
    id: string; name: string; owner_id: string; is_template: number;
    created_at: string; updated_at: string; deleted_at: string | null;
  };
  db.runSync(
    `INSERT INTO lists (id, name, owner_id, is_template, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       owner_id = excluded.owner_id,
       is_template = excluded.is_template,
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at
     WHERE excluded.updated_at > lists.updated_at`,
    [v.id, v.name, v.owner_id, v.is_template, v.created_at, v.updated_at, v.deleted_at ?? null]
  );
}

function applyItemMessage(msg: ShapeMessage): void {
  const v = msg.value as {
    id: string; text: string; list_id: string; section_id: string | null;
    completed: number; order: number; created_at: string; updated_at: string; deleted_at: string | null;
  };
  db.runSync(
    `INSERT INTO items (id, text, list_id, section_id, completed, "order", created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       text = excluded.text,
       list_id = excluded.list_id,
       section_id = excluded.section_id,
       completed = excluded.completed,
       "order" = excluded."order",
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at
     WHERE excluded.updated_at > items.updated_at`,
    [v.id, v.text, v.list_id, v.section_id ?? null, v.completed, v.order, v.created_at, v.updated_at, v.deleted_at ?? null]
  );
}

export function useSync() {
  const [status, setStatus] = useState<ElectricSyncStatus>('connecting');
  const clientRef = useRef<ElectricClient | null>(null);
  const unsubscribeRefs = useRef<Array<() => void>>([]);
  const wasConnected = useRef<boolean | null>(null);

  const syncShapes = useCallback(async (client: ElectricClient) => {
    for (const unsub of unsubscribeRefs.current) {
      unsub();
    }
    unsubscribeRefs.current = [];

    const unsubLists = await client.subscribeToShape('lists', applyListMessage);
    const unsubItems = await client.subscribeToShape('items', applyItemMessage);
    unsubscribeRefs.current = [unsubLists, unsubItems];
  }, []);

  const connect = useCallback(async () => {
    setStatus('connecting');
    try {
      const client = await initElectric();
      clientRef.current = client;
      await syncShapes(client);
      setStatus('connected');
    } catch (err) {
      console.error('ElectricSQL connect failed:', err);
      setStatus('error');
    }
  }, [syncShapes]);

  useEffect(() => {
    connect();
    return () => {
      for (const unsub of unsubscribeRefs.current) {
        unsub();
      }
      clientRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected ?? false;
      if (wasConnected.current === false && isConnected && status !== 'connected') {
        connect();
      }
      wasConnected.current = isConnected;
    });
    return unsubscribe;
  }, [status, connect]);

  return { status, reconnect: connect };
}

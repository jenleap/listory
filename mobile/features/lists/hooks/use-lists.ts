import { useState, useEffect, useCallback } from 'react';
import { List } from '../types';
import { createList } from '../services/list-service';
import { getListsByOwner } from '../db/lists-db';

export function useLists(owner_id: string) {
  const [lists, setLists] = useState<List[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLists(getListsByOwner(owner_id));
  }, [owner_id]);

  const handleCreateList = useCallback(
    (name: string): boolean => {
      const result = createList({ name, owner_id });
      if (!result.success) {
        setError(result.error);
        return false;
      }
      setLists((prev) => [...prev, result.list]);
      setError(null);
      return true;
    },
    [owner_id]
  );

  return { lists, error, createList: handleCreateList };
}

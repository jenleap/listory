import { useState, useEffect, useCallback } from 'react';
import { Item } from '../types';
import { addItem } from '../services/item-service';
import { getItemsByList } from '../db/items-db';

export function useItems(list_id: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(getItemsByList(list_id));
  }, [list_id]);

  const handleAddItem = useCallback(
    (text: string): boolean => {
      const result = addItem({ list_id, section_id: null, text });
      if (!result.success) {
        setError(result.error);
        return false;
      }
      setItems((prev) => [...prev, result.item]);
      setError(null);
      return true;
    },
    [list_id]
  );

  return { items, error, addItem: handleAddItem };
}

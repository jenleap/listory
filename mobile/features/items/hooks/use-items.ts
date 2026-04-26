import { useState, useEffect, useCallback } from 'react';
import { Item } from '../types';
import { addItem, editItem, deleteItem, toggleItem } from '../services/item-service';
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

  const handleEditItem = useCallback(
    (id: string, newText: string): boolean => {
      const result = editItem({ id, list_id, new_text: newText });
      if (!result.success) {
        setError(result.error);
        return false;
      }
      if (result.deleted) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        setItems((prev) => prev.map((i) => (i.id === id ? result.item : i)));
      }
      setError(null);
      return true;
    },
    [list_id]
  );

  const handleDeleteItem = useCallback(
    (id: string): boolean => {
      const result = deleteItem({ id });
      if (!result.success) {
        setError(result.error);
        return false;
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
      setError(null);
      return true;
    },
    []
  );

  const handleToggleItem = useCallback(
    (id: string): boolean => {
      const result = toggleItem({ id });
      if (!result.success) {
        setError(result.error);
        return false;
      }
      setItems((prev) => prev.map((i) => (i.id === id ? result.item : i)));
      setError(null);
      return true;
    },
    []
  );

  return { items, error, addItem: handleAddItem, editItem: handleEditItem, deleteItem: handleDeleteItem, toggleItem: handleToggleItem };
}

import { useState, useEffect, useCallback } from 'react';
import { Section } from '../types';
import { createSection } from '../services/section-service';
import { getSectionsByList } from '../db/sections-db';

export function useSections(list_id: string) {
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSections(getSectionsByList(list_id));
  }, [list_id]);

  const handleAddSection = useCallback(
    (name: string): boolean => {
      const result = createSection({ list_id, name });
      if (!result.success) {
        setError(result.error);
        return false;
      }
      setSections((prev) => [...prev, result.section]);
      setError(null);
      return true;
    },
    [list_id]
  );

  return { sections, error, addSection: handleAddSection };
}

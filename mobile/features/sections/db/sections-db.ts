import { db } from '../../../db/client';
import { Section } from '../types';

export function insertSection(section: Section): void {
  db.runSync(
    `INSERT INTO sections (id, list_id, name, "order", created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      section.id,
      section.list_id,
      section.name,
      section.order,
      section.created_at,
      section.updated_at,
      section.deleted_at,
    ]
  );
}

export function getSectionsByList(list_id: string): Section[] {
  return db.getAllSync<Section>(
    `SELECT * FROM sections WHERE list_id = ? AND deleted_at IS NULL ORDER BY "order" ASC`,
    [list_id]
  );
}

export function sectionNameExistsInList(name: string, list_id: string): boolean {
  const row = db.getFirstSync<{ id: string }>(
    `SELECT id FROM sections WHERE list_id = ? AND deleted_at IS NULL AND LOWER(TRIM(name)) = LOWER(TRIM(?))`,
    [list_id, name]
  );
  return row != null;
}

export function getMaxSectionOrder(list_id: string): number {
  const row = db.getFirstSync<{ max_order: number | null }>(
    `SELECT MAX("order") AS max_order FROM sections WHERE list_id = ? AND deleted_at IS NULL`,
    [list_id]
  );
  return row?.max_order ?? 0;
}

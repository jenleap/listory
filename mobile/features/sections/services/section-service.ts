import { generateId } from '../../../utils/generate-id';
import { Section, CreateSectionInput } from '../types';
import {
  insertSection,
  sectionNameExistsInList,
  getMaxSectionOrder,
} from '../db/sections-db';

type CreateSectionResult =
  | { success: true; section: Section }
  | { success: false; error: string };

export function createSection(input: CreateSectionInput): CreateSectionResult {
  const trimmedName = input.name.trim();

  if (trimmedName === '') {
    return { success: false, error: 'Name is required' };
  }

  if (sectionNameExistsInList(trimmedName, input.list_id)) {
    return { success: false, error: 'A section with this name already exists' };
  }

  const order = getMaxSectionOrder(input.list_id) + 10;
  const now = new Date().toISOString();

  const section: Section = {
    id: generateId(),
    list_id: input.list_id,
    name: trimmedName,
    order,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };

  insertSection(section);

  return { success: true, section };
}

import { generateId } from '../../../utils/generate-id';
import { List, CreateListInput } from '../types';
import { insertList, listNameExistsForOwner } from '../db/lists-db';

type CreateListResult =
  | { success: true; list: List }
  | { success: false; error: string };

export function createList(input: CreateListInput): CreateListResult {
  const trimmedName = input.name.trim();

  if (trimmedName === '') {
    return { success: false, error: 'Name is required' };
  }

  if (listNameExistsForOwner(trimmedName, input.owner_id)) {
    return { success: false, error: 'A list with this name already exists' };
  }

  const now = new Date().toISOString();
  const list: List = {
    id: generateId(),
    name: trimmedName,
    owner_id: input.owner_id,
    is_template: false,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };

  insertList(list);

  return { success: true, list };
}

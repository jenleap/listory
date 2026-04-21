import { generateId } from '../../../utils/generate-id';
import { Item, CreateItemInput } from '../types';
import { insertItem, getItemsByList, itemTextExistsInList } from '../db/items-db';

type AddItemResult =
  | { success: true; item: Item }
  | { success: false; error: string };

export function addItem(input: CreateItemInput): AddItemResult {
  const trimmedText = input.text.trim();

  if (trimmedText === '') {
    return { success: false, error: 'Text is required' };
  }

  if (itemTextExistsInList(trimmedText, input.list_id)) {
    return { success: false, error: 'An item with this name already exists' };
  }

  const existingItems = getItemsByList(input.list_id);
  const order = existingItems.length * 10 + 10;

  const now = new Date().toISOString();
  const item: Item = {
    id: generateId(),
    text: trimmedText,
    list_id: input.list_id,
    section_id: input.section_id,
    completed: false,
    order,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };

  insertItem(item);

  return { success: true, item };
}

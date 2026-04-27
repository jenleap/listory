import { generateId } from '../../../utils/generate-id';
import { Item, CreateItemInput, EditItemInput, DeleteItemInput, ToggleItemInput, ClearCompletedInput } from '../types';
import {
  insertItem,
  getItemsByList,
  itemTextExistsInList,
  itemTextExistsInListExcluding,
  updateItem,
  softDeleteItem,
  getItemById,
  toggleItemComplete,
  clearCompletedItems as clearCompletedItemsDb,
} from '../db/items-db';

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

type EditItemResult =
  | { success: true; deleted: false; item: Item }
  | { success: true; deleted: true }
  | { success: false; error: string };

export function editItem(input: EditItemInput): EditItemResult {
  const trimmedText = input.new_text.trim();
  const now = new Date().toISOString();

  if (trimmedText === '') {
    softDeleteItem(input.id, now, now);
    return { success: true, deleted: true };
  }

  if (itemTextExistsInListExcluding(trimmedText, input.list_id, input.id)) {
    return { success: false, error: 'An item with this name already exists' };
  }

  updateItem(input.id, trimmedText, now);

  const updated = getItemById(input.id);
  return { success: true, deleted: false, item: updated! };
}

type ToggleItemResult =
  | { success: true; item: Item }
  | { success: false; error: string };

export function toggleItem(input: ToggleItemInput): ToggleItemResult {
  const item = getItemById(input.id);

  if (item == null) {
    return { success: false, error: 'Item not found' };
  }

  const now = new Date().toISOString();
  toggleItemComplete(input.id, !item.completed, now);

  const updated = getItemById(input.id);
  return { success: true, item: updated! };
}

type DeleteItemResult =
  | { success: true }
  | { success: false; error: string };

export function deleteItem(input: DeleteItemInput): DeleteItemResult {
  const item = getItemById(input.id);

  if (item == null) {
    return { success: false, error: 'Item not found' };
  }

  if (item.deleted_at != null) {
    return { success: true };
  }

  const now = new Date().toISOString();
  softDeleteItem(input.id, now, now);

  return { success: true };
}

type ClearCompletedResult =
  | { success: true }
  | { success: false; error: string };

export function clearCompletedItems(input: ClearCompletedInput): ClearCompletedResult {
  const now = new Date().toISOString();
  clearCompletedItemsDb(input.list_id, now, now);
  return { success: true };
}

export interface Item {
  id: string;
  text: string;
  list_id: string;
  section_id: string | null;
  completed: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateItemInput {
  list_id: string;
  section_id: string | null;
  text: string;
}

export interface EditItemInput {
  id: string;
  list_id: string;
  new_text: string;
}

export interface DeleteItemInput {
  id: string;
}

export interface ToggleItemInput {
  id: string;
}

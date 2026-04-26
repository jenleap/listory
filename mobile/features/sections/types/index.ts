export interface Section {
  id: string;
  list_id: string;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateSectionInput {
  list_id: string;
  name: string;
}

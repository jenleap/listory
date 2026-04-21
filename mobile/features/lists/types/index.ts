export interface List {
  id: string;
  name: string;
  owner_id: string;
  is_template: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateListInput {
  name: string;
  owner_id: string;
}

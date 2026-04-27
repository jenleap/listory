export interface ListUser {
  list_id: string;
  user_id: string;
  access: 'write' | 'read';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ShareListInput {
  list_id: string;
  list_owner_id: string;
  current_user_id: string;
  target_user_id: string;
  access: 'write' | 'read';
}

export interface ListUserWithName extends ListUser {
  name: string;
  email: string;
}

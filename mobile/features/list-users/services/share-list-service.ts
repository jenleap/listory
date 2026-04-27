import { ShareListInput, ListUser } from '../types';
import { insertListUser, upsertListUserAccess, getListUserExists } from '../db/list-users-db';

type ShareListResult =
  | { success: true }
  | { success: false; error: string };

export function shareList(input: ShareListInput): ShareListResult {
  if (input.current_user_id !== input.list_owner_id) {
    return { success: false, error: 'Only the list owner can share this list' };
  }

  if (input.current_user_id === input.target_user_id) {
    return { success: false, error: 'Cannot share a list with yourself' };
  }

  const now = new Date().toISOString();
  const alreadyExists = getListUserExists(input.list_id, input.target_user_id);

  if (alreadyExists) {
    upsertListUserAccess(input.list_id, input.target_user_id, input.access, now);
  } else {
    const record: ListUser = {
      list_id: input.list_id,
      user_id: input.target_user_id,
      access: input.access,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    insertListUser(record);
  }

  return { success: true };
}

import { useState, useEffect, useCallback } from 'react';
import { ListUserWithName } from '../types';
import { getListUsersWithNames } from '../db/list-users-db';
import { shareList as shareListService } from '../services/share-list-service';
import { getUserByEmail } from '../../users/db/users-db';

export function useListUsers(listId: string, listOwnerId: string, currentUserId: string) {
  const [sharedUsers, setSharedUsers] = useState<ListUserWithName[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSharedUsers(getListUsersWithNames(listId));
  }, [listId]);

  const shareList = useCallback(
    (email: string, access: 'write' | 'read'): boolean => {
      const trimmedEmail = email.trim();

      if (trimmedEmail === '') {
        setError('Email is required');
        return false;
      }

      const targetUser = getUserByEmail(trimmedEmail);

      if (targetUser == null) {
        setError('User not found');
        return false;
      }

      const result = shareListService({
        list_id: listId,
        list_owner_id: listOwnerId,
        current_user_id: currentUserId,
        target_user_id: targetUser.id,
        access,
      });

      if (!result.success) {
        setError(result.error);
        return false;
      }

      setSharedUsers(getListUsersWithNames(listId));
      setError(null);
      return true;
    },
    [listId, listOwnerId, currentUserId]
  );

  return { sharedUsers, error, shareList };
}

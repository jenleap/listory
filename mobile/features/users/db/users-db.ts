import { db } from '../../../db/client';
import { User } from '../types';

export function getUserByEmail(email: string): User | null {
  return db.getFirstSync<User>(
    `SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))`,
    [email]
  ) ?? null;
}

export function getUserById(id: string): User | null {
  return db.getFirstSync<User>(
    `SELECT * FROM users WHERE id = ?`,
    [id]
  ) ?? null;
}

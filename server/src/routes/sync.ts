import { Router, Request, Response } from 'express';
import { pool } from '../db';

interface SyncListRecord {
  id: string;
  name: string;
  owner_id: string;
  is_template: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface SyncItemRecord {
  id: string;
  text: string;
  list_id: string;
  section_id: string | null;
  completed: number;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface PushBody {
  lists: SyncListRecord[];
  items: SyncItemRecord[];
}

interface PullResponse {
  lists: SyncListRecord[];
  items: SyncItemRecord[];
}

export const syncRouter = Router();

syncRouter.post('/push', async (req: Request, res: Response): Promise<void> => {
  const userId = req.headers['x-user-id'] as string | undefined;
  if (!userId) {
    res.status(401).json({ error: 'Missing x-user-id header' });
    return;
  }

  const body = req.body as PushBody;
  const lists = body.lists || [];
  const items = body.items || [];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`SET LOCAL "app.user_id" = $1`, [userId]);

    for (const list of lists) {
      await client.query(
        `INSERT INTO lists (id, name, owner_id, is_template, created_at, updated_at, deleted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           owner_id = EXCLUDED.owner_id,
           is_template = EXCLUDED.is_template,
           updated_at = EXCLUDED.updated_at,
           deleted_at = EXCLUDED.deleted_at
         WHERE EXCLUDED.updated_at > lists.updated_at`,
        [list.id, list.name, list.owner_id, list.is_template, list.created_at, list.updated_at, list.deleted_at]
      );
    }

    for (const item of items) {
      await client.query(
        `INSERT INTO items (id, text, list_id, section_id, completed, "order", created_at, updated_at, deleted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           text = EXCLUDED.text,
           list_id = EXCLUDED.list_id,
           section_id = EXCLUDED.section_id,
           completed = EXCLUDED.completed,
           "order" = EXCLUDED."order",
           updated_at = EXCLUDED.updated_at,
           deleted_at = EXCLUDED.deleted_at
         WHERE EXCLUDED.updated_at > items.updated_at`,
        [item.id, item.text, item.list_id, item.section_id, item.completed, item.order, item.created_at, item.updated_at, item.deleted_at]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, count: { lists: lists.length, items: items.length } });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Push error:', err);
    res.status(500).json({ error: 'Push failed' });
  } finally {
    client.release();
  }
});

syncRouter.get('/pull', async (req: Request, res: Response): Promise<void> => {
  const userId = req.headers['x-user-id'] as string | undefined;
  if (!userId) {
    res.status(401).json({ error: 'Missing x-user-id header' });
    return;
  }

  const since = (req.query.since as string) || '1970-01-01T00:00:00.000Z';

  const client = await pool.connect();
  try {
    await client.query(`SET LOCAL "app.user_id" = $1`, [userId]);

    const listsResult = await client.query<SyncListRecord>(
      `SELECT * FROM lists WHERE updated_at > $1`,
      [since]
    );
    const itemsResult = await client.query<SyncItemRecord>(
      `SELECT * FROM items WHERE updated_at > $1`,
      [since]
    );

    const response: PullResponse = {
      lists: listsResult.rows,
      items: itemsResult.rows,
    };
    res.json(response);
  } catch (err) {
    console.error('Pull error:', err);
    res.status(500).json({ error: 'Pull failed' });
  } finally {
    client.release();
  }
});

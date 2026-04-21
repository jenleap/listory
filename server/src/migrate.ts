import fs from 'fs';
import path from 'path';
import { pool } from './db';

export async function runMigrations(): Promise<void> {
  const sql = fs.readFileSync(
    path.join(__dirname, 'migrations', '001-init.sql'),
    'utf8'
  );
  await pool.query(sql);
  console.log('Migrations complete');
}

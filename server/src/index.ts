import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { runMigrations } from './migrate';
import { syncRouter } from './routes/sync';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/sync', syncRouter);

const PORT = process.env.PORT || 3000;

runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });

import { readFile } from 'node:fs/promises';
import pg from 'pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const schema = await readFile(new URL('../db/render-schema.sql', import.meta.url), 'utf8');
const database = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.RENDER ? { rejectUnauthorized: false } : undefined });
try {
  await database.query(schema);
  console.log('Render PostgreSQL schema is ready.');
} finally {
  await database.end();
}

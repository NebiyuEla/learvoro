import { isAdmin } from '@/lib/admin-auth';
import { query } from '@/lib/db';

const table = `CREATE TABLE IF NOT EXISTS visitor_sessions(id text PRIMARY KEY,user_id text,email text,masked_ip text NOT NULL,browser text NOT NULL,device text NOT NULL,path text NOT NULL,first_seen bigint NOT NULL,last_seen bigint NOT NULL)`;
export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  await query(table);
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  await query('DELETE FROM visitor_sessions WHERE last_seen < $1', [cutoff]);
  const result = await query<{ id: string; email: string | null; masked_ip: string; browser: string; device: string; path: string; first_seen: number; last_seen: number }>('SELECT id,email,masked_ip,browser,device,path,first_seen,last_seen FROM visitor_sessions ORDER BY last_seen DESC LIMIT 100');
  return Response.json({ sessions: result.rows, snapshotAt: Date.now() });
}

import { cookies, headers } from 'next/headers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { query } from '@/lib/db';

const table = `CREATE TABLE IF NOT EXISTS visitor_sessions(id text PRIMARY KEY,user_id text,email text,masked_ip text NOT NULL,browser text NOT NULL,device text NOT NULL,path text NOT NULL,first_seen bigint NOT NULL,last_seen bigint NOT NULL)`;
const cleanPath = (value: unknown) => typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value.slice(0, 240) : '/';
function maskedIp(value: string) {
  const ip = value.split(',')[0]?.trim() || 'Unavailable';
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return ip.replace(/\.\d+$/, '.xxx');
  if (ip.includes(':')) return `${ip.split(':').slice(0, 3).join(':')}:…`;
  return 'Unavailable';
}
function client(ua: string) {
  const browser = /Edg\//.test(ua) ? 'Microsoft Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Other browser';
  const device = /iPad|Tablet/i.test(ua) ? 'Tablet' : /Mobile|Android|iPhone/i.test(ua) ? 'Mobile' : 'Desktop';
  return { browser, device };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { path?: string };
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const sessionId = cookieStore.get('learvoro_visitor')?.value || crypto.randomUUID();
  const user = await getChatGPTUser();
  const { browser, device } = client(requestHeaders.get('user-agent') || '');
  const ip = maskedIp(requestHeaders.get('x-forwarded-for') || requestHeaders.get('x-real-ip') || '');
  const now = Date.now();
  await query(table);
  await query(`INSERT INTO visitor_sessions(id,user_id,email,masked_ip,browser,device,path,first_seen,last_seen) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$8) ON CONFLICT(id) DO UPDATE SET user_id=EXCLUDED.user_id,email=EXCLUDED.email,masked_ip=EXCLUDED.masked_ip,browser=EXCLUDED.browser,device=EXCLUDED.device,path=EXCLUDED.path,last_seen=EXCLUDED.last_seen`, [sessionId, user?.userId || null, user?.email || null, ip, browser, device, cleanPath(body.path), now]);
  if (!cookieStore.get('learvoro_visitor')) cookieStore.set('learvoro_visitor', sessionId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 2592000 });
  return Response.json({ ok: true });
}

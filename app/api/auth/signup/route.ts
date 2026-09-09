import bcrypt from 'bcryptjs';
import { createSession } from '@/app/chatgpt-auth';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string; fullName?: string; returnTo?: string };
    const email = body.email?.trim().toLowerCase();
    const fullName = body.fullName?.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email) || !fullName || !body.password || body.password.length < 10) {
      return Response.json({ error: 'Enter a valid name, email, and password of at least 10 characters.' }, { status: 400 });
    }
    const existing = await query<{ id: string }>('SELECT id FROM users WHERE email=$1 LIMIT 1', [email]);
    if (existing.rows[0]) return Response.json({ error: 'An account with this email already exists. Log in instead.' }, { status: 409 });
    const id = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    await query("INSERT INTO users(id,email,password_hash,first_name,last_name,role,created_at,updated_at) VALUES($1,$2,$3,$4,$5,'student',$6,$6)", [id, email, await bcrypt.hash(body.password, 12), fullName.split(' ')[0], fullName.split(' ').slice(1).join(' ') || null, now]);
    await createSession({ userId: id, email, fullName, displayName: fullName });
    return Response.json({ redirect: safe(body.returnTo) });
  } catch (error) {
    console.error('Signup failed', error);
    return Response.json({ error: configurationError(error) }, { status: 503 });
  }
}
function safe(value?: string) { return value?.startsWith('/') && !value.startsWith('//') ? value : '/my-learning'; }
function configurationError(error: unknown) { const message = error instanceof Error ? error.message : ''; return message.includes('DATABASE_URL') || message.includes('AUTH_SECRET') ? 'Account service is not configured yet. Add DATABASE_URL and AUTH_SECRET in Render.' : 'Account creation is temporarily unavailable. Please try again.'; }

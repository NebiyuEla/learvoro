import bcrypt from 'bcryptjs';
import { createSession } from '@/app/chatgpt-auth';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string; returnTo?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email || !body.password) return Response.json({ error: 'Enter your email and password.' }, { status: 400 });
    const result = await query<{ id: string; email: string; password_hash: string | null; first_name: string | null; last_name: string | null }>('SELECT id,email,password_hash,first_name,last_name FROM users WHERE email=$1 LIMIT 1', [email]);
    const user = result.rows[0];
    if (!user?.password_hash || !await bcrypt.compare(body.password, user.password_hash)) return Response.json({ error: 'Incorrect email or password.' }, { status: 401 });
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
    await createSession({ userId: user.id, email: user.email, fullName: fullName || null, displayName: fullName || user.email });
    return Response.json({ redirect: safe(body.returnTo) });
  } catch (error) {
    console.error('Login failed', error);
    const message = error instanceof Error ? error.message : '';
    return Response.json({ error: message.includes('DATABASE_URL') || message.includes('AUTH_SECRET') ? 'Account service is not configured yet. Add DATABASE_URL and AUTH_SECRET in Render.' : 'Login is temporarily unavailable. Please try again.' }, { status: 503 });
  }
}
function safe(value?: string) { return value?.startsWith('/') && !value.startsWith('//') ? value : '/my-learning'; }

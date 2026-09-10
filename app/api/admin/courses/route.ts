import { isAdmin } from '@/lib/admin-auth';
import { courses } from '@/lib/course-data';
import { query } from '@/lib/db';

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { courseId?: string; price?: number };
  const course = courses.find((item) => item.id === body.courseId);
  const price = Number(body.price);
  if (!course || !Number.isInteger(price) || price < 50 || price > 10000000) return Response.json({ error: 'INVALID_PRICE' }, { status: 400 });
  const now = Date.now();
  await query(
    `INSERT INTO courses(id,title,slug,description,level,language,price,currency,status,created_at,updated_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,'published',$9,$9)
     ON CONFLICT(id) DO UPDATE SET price=EXCLUDED.price,updated_at=EXCLUDED.updated_at`,
    [course.id, course.title, course.slug, course.description, course.level, course.language, price, course.currency, now],
  );
  return Response.json({ ok: true, price });
}

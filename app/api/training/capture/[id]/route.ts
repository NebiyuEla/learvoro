import { isAdmin } from '@/lib/admin-auth';
import { findCourse } from '@/lib/course-data';
import { query } from '@/lib/db';
import { findTrainingCapture } from '@/lib/training-capture';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { id } = await params;
  const record = findTrainingCapture(id);
  if (!record) return Response.json({ error: 'NOT_FOUND' }, { status: 404 });
  const body = (await request.json().catch(() => ({}))) as { action?: string };
  if (body.action !== 'approve' && body.action !== 'decline')
    return Response.json({ error: 'INVALID_ACTION' }, { status: 400 });
  if (record.status !== 'pending')
    return Response.json({ status: record.status });

  if (body.action === 'approve') {
    const course = findCourse(record.courseSlug);
    if (!course) return Response.json({ error: 'COURSE_NOT_FOUND' }, { status: 404 });
    const now = Date.now();
    await query(
      `INSERT INTO courses(id,title,slug,description,level,language,price,currency,status,created_at,updated_at)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,'published',$9,$9)
       ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title, updated_at=EXCLUDED.updated_at`,
      [course.id, course.title, course.slug, course.description, course.level, course.language, course.price, course.currency, now],
    );
    await query(
      `INSERT INTO entitlements(id,user_id,course_id,source,order_id,status,granted_at)
       VALUES($1,$2,$3,'admin_training_approval',NULL,'active',$4)
       ON CONFLICT(user_id,course_id) DO UPDATE SET status='active', granted_at=EXCLUDED.granted_at`,
      [crypto.randomUUID(), record.userId, record.courseId, now],
    );
    record.status = 'approved';
  } else {
    record.status = 'declined';
  }
  record.decidedAt = Date.now();
  return Response.json({ status: record.status });
}

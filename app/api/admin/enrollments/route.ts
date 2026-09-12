import { isAdmin } from '@/lib/admin-auth';
import { query } from '@/lib/db';

type Enrollment = { entitlementId:string;userId:string;email:string;fullName:string;courseId:string;courseTitle:string;courseSlug:string;grantedAt:string };
export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const result = await query<Enrollment>(`SELECT e.id AS "entitlementId",u.id AS "userId",u.email,TRIM(CONCAT(COALESCE(u.first_name,''),' ',COALESCE(u.last_name,''))) AS "fullName",c.id AS "courseId",c.title AS "courseTitle",c.slug AS "courseSlug",e.granted_at::text AS "grantedAt" FROM entitlements e JOIN users u ON u.id=e.user_id JOIN courses c ON c.id=e.course_id WHERE e.status='active' ORDER BY e.granted_at DESC`);
  return Response.json({ enrollments: result.rows });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { userId?:string;courseId?:string };
  if (!body.userId || !body.courseId) return Response.json({ error: 'INVALID_REQUEST' }, { status: 400 });
  const result = await query(`UPDATE entitlements SET status='revoked' WHERE user_id=$1 AND course_id=$2 AND status='active'`, [body.userId, body.courseId]);
  if (!result.rowCount) return Response.json({ error: 'NOT_FOUND' }, { status: 404 });
  await query(`INSERT INTO audit_logs(id,actor_user_id,action,entity_type,entity_id,metadata,created_at) VALUES($1,NULL,'course_access_revoked','entitlement',$2,$3,$4)`, [crypto.randomUUID(), `${body.userId}:${body.courseId}`, JSON.stringify({ userId:body.userId,courseId:body.courseId }), Date.now()]);
  return Response.json({ ok: true });
}

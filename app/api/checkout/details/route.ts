import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { findCourse } from '@/lib/course-data';

type CheckoutDetails = {
  courseSlug?: unknown;
  fullName?: unknown;
  countryCode?: unknown;
  addressLine1?: unknown;
  city?: unknown;
  postalCode?: unknown;
};

const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user)
    return Response.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });

  let body: CheckoutDetails;
  try {
    body = (await request.json()) as CheckoutDetails;
  } catch {
    return Response.json({ error: 'INVALID_REQUEST' }, { status: 400 });
  }

  const courseSlug = clean(body.courseSlug, 120);
  const fullName = clean(body.fullName, 120);
  const countryCode = clean(body.countryCode, 2).toUpperCase();
  const addressLine1 = clean(body.addressLine1, 180);
  const city = clean(body.city, 100);
  const postalCode = clean(body.postalCode, 24) || null;
  if (!courseSlug || !fullName || !/^[A-Z]{2}$/.test(countryCode) || !addressLine1 || !city)
    return Response.json({ error: 'MISSING_REQUIRED_DETAILS' }, { status: 400 });

  const db = (env as unknown as { DB: D1Database }).DB;
  const catalogCourse = findCourse(courseSlug);
  if (!catalogCourse)
    return Response.json({ error: 'COURSE_UNAVAILABLE' }, { status: 404 });
  const now = Math.floor(Date.now() / 1000);
  await db.prepare("INSERT OR IGNORE INTO courses (id,title,slug,description,level,language,price,currency,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?, 'published',?,?)")
    .bind(catalogCourse.id,catalogCourse.title,catalogCourse.slug,catalogCourse.description,catalogCourse.level,catalogCourse.language,catalogCourse.price,catalogCourse.currency,now,now).run();
  const catalogStatements = catalogCourse.sections.flatMap((section, sectionIndex) => {
    const sectionId = `${catalogCourse.id}_section_${sectionIndex + 1}`;
    return [db.prepare('INSERT OR IGNORE INTO course_sections (id,course_id,title,position,created_at,updated_at) VALUES (?,?,?,?,?,?)').bind(sectionId,catalogCourse.id,section.title,sectionIndex + 1,now,now),...section.lessons.map((lesson, lessonIndex) => db.prepare("INSERT OR IGNORE INTO lessons (id,section_id,title,slug,type,duration_seconds,is_preview,position,created_at,updated_at) VALUES (?,?,?,?, 'article',?,?,?,?,?,?)").bind(`${catalogCourse.id}_${lesson.slug}`,sectionId,lesson.title,lesson.slug,Number.parseInt(lesson.duration)*60,lesson.preview?1:0,lessonIndex + 1,now,now))];
  });
  if (catalogStatements.length) await db.batch(catalogStatements);
  const stored = await db
    .prepare("SELECT id FROM courses WHERE slug = ? AND status = 'published' LIMIT 1")
    .bind(courseSlug)
    .first<{ id: string }>();
  if (!stored)
    return Response.json({ error: 'COURSE_UNAVAILABLE' }, { status: 404 });

  const draftId = crypto.randomUUID();
  await db.batch([
    db.prepare("INSERT INTO users (id,email,first_name,last_name,role,created_at,updated_at) VALUES (?,?,?,?, 'student',?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email, updated_at=excluded.updated_at")
      .bind(user.userId, user.email, fullName.split(' ')[0] || null, fullName.split(' ').slice(1).join(' ') || null, now, now),
    db.prepare("INSERT INTO checkout_drafts (id,user_id,course_id,email,full_name,country_code,address_line_1,city,postal_code,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,'draft',?,?) ON CONFLICT(user_id,course_id) DO UPDATE SET email=excluded.email, full_name=excluded.full_name, country_code=excluded.country_code, address_line_1=excluded.address_line_1, city=excluded.city, postal_code=excluded.postal_code, status='draft', updated_at=excluded.updated_at")
      .bind(draftId, user.userId, stored.id, user.email, fullName, countryCode, addressLine1, city, postalCode, now, now),
  ]);

  return Response.json({ saved: true });
}

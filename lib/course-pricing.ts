import { courses, type Course } from '@/lib/course-data';
import { query } from '@/lib/db';

export async function coursePrices(): Promise<Record<string, number>> {
  try {
    const now = Date.now();
    for (const course of courses) {
      await query(
        `INSERT INTO courses(id,title,slug,description,level,language,price,currency,status,created_at,updated_at)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,'published',$9,$9)
         ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,slug=EXCLUDED.slug,description=EXCLUDED.description,level=EXCLUDED.level,language=EXCLUDED.language,currency=EXCLUDED.currency,status='published'`,
        [course.id, course.title, course.slug, course.description, course.level, course.language, course.price, course.currency, now],
      );
    }
    const result = await query<{ id: string; price: number }>('SELECT id,price FROM courses WHERE status=\'published\'');
    return Object.fromEntries(result.rows.map((row) => [row.id, Number(row.price)]));
  } catch {
    return {};
  }
}

export function withPrice(course: Course, prices: Record<string, number>): Course {
  return { ...course, price: prices[course.id] ?? course.price };
}

export type CourseEnrollmentCount = { platform: number; external: number; total: number };
export async function courseEnrollmentCounts(): Promise<Record<string, CourseEnrollmentCount>> {
  try {
    const result = await query<{ id: string; external: number; platform: string }>(
      `SELECT c.id,c.external_enrollments AS external,COUNT(DISTINCT e.user_id)::text AS platform
       FROM courses c LEFT JOIN entitlements e ON e.course_id=c.id AND e.status='active'
       WHERE c.status='published' GROUP BY c.id,c.external_enrollments`,
    );
    return Object.fromEntries(result.rows.map((row) => {
      const platform = Number(row.platform) || 0;
      const external = Number(row.external) || 0;
      return [row.id, { platform, external, total: platform + external }];
    }));
  } catch {
    return {};
  }
}

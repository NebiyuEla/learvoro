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

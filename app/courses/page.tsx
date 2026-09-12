import { SiteHeader } from '@/components/site-header';
import { CourseCatalog } from '@/components/course-catalog';
import { courses } from '@/lib/course-data';
import { courseEnrollmentCounts, coursePrices, withPrice } from '@/lib/course-pricing';

export const metadata = { title: 'Courses' };
export const dynamic = 'force-dynamic';

export default async function Courses() {
  const prices = await coursePrices();
  const counts = await courseEnrollmentCounts();
  const enrollmentCounts = Object.fromEntries(Object.entries(counts).map(([id, value]) => [id, value.total]));
  return <><SiteHeader/><main className="mx-auto max-w-[1180px] px-5 py-12 lg:px-8"><h1 className="font-heading text-4xl font-bold tracking-tight">Explore courses</h1><p className="mt-3 text-[#5d696c]">Focused courses that end with work you can use or share.</p><CourseCatalog courses={courses.map((course) => withPrice(course, prices))} enrollmentCounts={enrollmentCounts}/></main></>;
}

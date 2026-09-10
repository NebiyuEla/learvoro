import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { HostedCheckoutDemo } from '@/components/checkout-details-form';
import { findCourse, formatPrice } from '@/lib/course-data';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { coursePrices, withPrice } from '@/lib/course-pricing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}): Promise<Metadata> {
  const course = findCourse((await params).courseSlug);
  return {
    title: course ? `Checkout: ${course.title}` : 'Course checkout',
    robots: { index: false, follow: false },
  };
}
export default async function Checkout({
  params,
  searchParams,
}: {
  params: Promise<{ courseSlug: string }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const { courseSlug } = await params;
  const { session } = await searchParams;
  const baseCourse = findCourse(courseSlug);
  if (!baseCourse) redirect('/courses');
  const course = withPrice(baseCourse, await coursePrices());
  await requireChatGPTUser(`/checkout/${course.slug}`);
  const lessonCount = course.sections.reduce(
    (total, section) => total + section.lessons.length,
    0,
  );
  return (
    <HostedCheckoutDemo
      product={course.title}
      courseSlug={course.slug}
      initialSessionId={session}
      price={formatPrice(course)}
      category={course.category}
      level={course.level}
      duration={course.duration}
      lessons={lessonCount}
    />
  );
}

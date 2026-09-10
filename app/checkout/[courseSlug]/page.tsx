import { redirect } from 'next/navigation';
import { HostedCheckoutDemo } from '@/components/checkout-details-form';
import { findCourse, formatPrice } from '@/lib/course-data';
import { requireChatGPTUser } from '@/app/chatgpt-auth';

export const metadata = {
  title: 'Synthetic Course Checkout',
  robots: { index: false, follow: false },
};
export default async function Checkout({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = findCourse(courseSlug);
  if (!course) redirect('/courses');
  await requireChatGPTUser(`/checkout/${course.slug}`);
  const lessonCount = course.sections.reduce(
    (total, section) => total + section.lessons.length,
    0,
  );
  return (
    <HostedCheckoutDemo
      product={course.title}
      courseSlug={course.slug}
      price={formatPrice(course)}
      category={course.category}
      level={course.level}
      duration={course.duration}
      lessons={lessonCount}
    />
  );
}

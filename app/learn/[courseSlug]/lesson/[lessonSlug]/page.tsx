import Link from 'next/link';
import { redirect } from 'next/navigation';
import { env } from 'cloudflare:workers';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Play,
} from 'lucide-react';
import { allLessons, course } from '@/lib/course-data';
import { getChatGPTUser } from '@/app/chatgpt-auth';
export const metadata = {
  title: 'Course lesson',
  robots: { index: false, follow: false },
};
export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  const index = allLessons.findIndex((l) => l.slug === lessonSlug);
  if (index < 0) redirect(`/course/${course.slug}`);
  const lesson = allLessons[index];
  if (!lesson.preview) {
    const user = await getChatGPTUser();
    if (!user)
      redirect(
        `/login?returnTo=${encodeURIComponent(`/learn/${course.slug}/lesson/${lesson.slug}`)}`,
      );
    const db = (env as unknown as { DB: D1Database }).DB;
    const access = await db
      .prepare(
        "SELECT id FROM entitlements WHERE user_id=? AND course_id=? AND status='active' AND (expires_at IS NULL OR expires_at>unixepoch()) LIMIT 1",
      )
      .bind(user.userId, course.id)
      .first();
    if (!access) redirect(`/course/${course.slug}?access=required`);
  }
  return (
    <div className="min-h-screen bg-[#f5f8f8]">
      <header className="flex h-16 items-center gap-4 border-b bg-white px-4">
        <Link href={`/course/${course.slug}`} className="text-sm font-semibold">
          ← Course
        </Link>
        <span className="h-5 w-px bg-[#dfe5e5]" />
        <span className="truncate text-sm">{course.title}</span>
        <span className="ml-auto text-sm text-[#5d696c]">
          Lesson {index + 1} of 17
        </span>
      </header>
      <main className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="course-grid grid aspect-video place-items-center bg-[#073D86] text-white">
              <button
                className="grid size-16 place-items-center rounded-full bg-white text-[#0757B2]"
                aria-label="Play lesson"
              >
                <Play className="ml-1" fill="currentColor" />
              </button>
            </div>
            <div className="bg-white p-6 md:p-8">
              <p className="text-sm font-semibold text-[#0870C9]">
                {lesson.section}
              </p>
              <h1 className="mt-2 font-heading text-2xl font-bold">
                {lesson.title}
              </h1>
              <p className="mt-5 max-w-3xl leading-7 text-[#5d696c]">
                In this lesson, you’ll work through the decisions and practical
                steps needed for this part of your portfolio. Use the lesson
                resources as you follow along.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6">
                <button className="rounded-lg border px-4 py-2.5 text-sm font-semibold">
                  <CheckCircle2 className="mr-2 inline" size={17} />
                  Mark complete
                </button>
                <div className="ml-auto flex gap-2">
                  {index > 0 && (
                    <Link
                      href={`/learn/${course.slug}/lesson/${allLessons[index - 1].slug}`}
                      className="rounded-lg border p-2.5"
                      aria-label="Previous lesson"
                    >
                      <ChevronLeft />
                    </Link>
                  )}
                  {index < allLessons.length - 1 && (
                    <Link
                      href={`/learn/${course.slug}/lesson/${allLessons[index + 1].slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#0757B2] px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Next <ChevronRight size={17} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="border-l bg-white p-5">
          <h2 className="font-heading font-bold">Course content</h2>
          <div className="mt-5 space-y-1">
            {allLessons.map((l, i) => (
              <Link
                key={l.slug}
                href={
                  l.preview || i <= index
                    ? `/learn/${course.slug}/lesson/${l.slug}`
                    : '#'
                }
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${l.slug === lessonSlug ? 'bg-[#E7F8F3] text-[#0757B2]' : 'hover:bg-[#f4f7f7]'}`}
              >
                <span className="w-5 text-xs">{i + 1}</span>
                {i < index ? (
                  <CheckCircle2 size={16} className="text-[#18B394]" />
                ) : l.preview ? (
                  <Play size={15} />
                ) : (
                  <Lock size={14} />
                )}
                <span className="truncate">{l.title}</span>
              </Link>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

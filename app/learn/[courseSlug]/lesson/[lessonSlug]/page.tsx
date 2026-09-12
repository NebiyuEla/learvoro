/* oxlint-disable next/no-html-link-for-pages */
import { redirect } from "next/navigation";
import Image from "next/image";
import { env } from "@/lib/runtime";
import { ChevronLeft, ChevronRight, Lock, BookOpen } from "lucide-react";
import { courseCover, findCourse, lessonsFor } from "@/lib/course-data";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { CompleteLessonButton } from "@/components/complete-lesson-button";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Course lesson",
  robots: { index: false, follow: false },
};
export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const course = findCourse(courseSlug);
  if (!course) redirect("/courses");
  const lessons = lessonsFor(course);
  const index = lessons.findIndex((x) => x.slug === lessonSlug);
  if (index < 0) redirect(`/course/${course.slug}`);
  const lesson = lessons[index];
  const user = await getChatGPTUser();
  let enrolled = false,
    completed = false;
  if (user) {
    const db = (env as unknown as { DB: D1Database }).DB;
    enrolled = !!(await db
      .prepare(
        "SELECT id FROM entitlements WHERE user_id=? AND course_id=? AND status='active' LIMIT 1",
      )
      .bind(user.userId, course.id)
      .first());
    if (enrolled)
      completed = !!(await db
        .prepare(
          "SELECT id FROM lesson_progress WHERE user_id=? AND lesson_id=? AND completed=1 LIMIT 1",
        )
        .bind(user.userId, `${course.id}_${lesson.slug}`)
        .first());
  }
  if (!lesson.preview && !enrolled)
    redirect(`/course/${course.slug}?access=required`);
  return (
    <div className="min-h-screen bg-[#f5f8f8]">
      <header className="flex h-16 items-center gap-4 border-b bg-white px-4">
        <a href={`/course/${course.slug}`} className="text-sm font-semibold">
          ← Course
        </a>
        <span className="h-5 w-px bg-[#dfe5e5]" />
        <span className="truncate text-sm">{course.title}</span>
        <span className="ml-auto text-sm text-[#5d696c]">
          Lesson {index + 1} of {lessons.length}
        </span>
      </header>
      <main className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="p-4 md:p-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border bg-white">
            <div className="relative flex min-h-52 items-end overflow-hidden p-8 text-white">
              <Image src={courseCover(course.slug)} alt="" fill priority sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" />
              <span className="absolute inset-0 bg-[#061b3a]/35" />
              <BookOpen className="relative" size={34} />
            </div>
            <div className="p-6 md:p-10">
              <p className="text-sm font-semibold text-[#0870C9]">
                {lesson.section} · {lesson.duration}
              </p>
              <h1 className="mt-2 font-heading text-3xl font-bold">
                {lesson.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#455356]">
                {lesson.summary}
              </p>
              <h2 className="mt-9 font-heading text-xl font-bold">
                Lesson procedure
              </h2>
              <ol className="mt-5 space-y-4">
                {lesson.steps.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-4 rounded-lg bg-[#f4f8f7] p-4 leading-7"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#0757B2] text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-9 flex flex-wrap items-center gap-3 border-t pt-6">
                {enrolled ? (
                  <CompleteLessonButton
                    courseSlug={course.slug}
                    lessonSlug={lesson.slug}
                    initial={completed}
                  />
                ) : (
                  <a
                    href={`/checkout/${course.slug}`}
                    className="rounded-lg bg-[#0757B2] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Get the full course
                  </a>
                )}
                <div className="ml-auto flex gap-2">
                  {index > 0 && (
                    <a
                      href={`/learn/${course.slug}/lesson/${lessons[index - 1].slug}`}
                      className="rounded-lg border p-2.5"
                      aria-label="Previous lesson"
                    >
                      <ChevronLeft />
                    </a>
                  )}
                  {index < lessons.length - 1 &&
                    (enrolled || lessons[index + 1].preview) && (
                      <a
                        href={`/learn/${course.slug}/lesson/${lessons[index + 1].slug}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0757B2] px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        Next <ChevronRight size={17} />
                      </a>
                    )}
                </div>
              </div>
            </div>
          </div>
        </article>
        <aside className="border-l bg-white p-5">
          <h2 className="font-heading font-bold">Course content</h2>
          <div className="mt-5 space-y-1">
            {lessons.map((x, i) => {
              const open = enrolled || x.preview;
              return open ? (
                <a
                  key={x.slug}
                  href={`/learn/${course.slug}/lesson/${x.slug}`}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${x.slug === lessonSlug ? "bg-[#E7F8F3] text-[#0757B2]" : "hover:bg-[#f4f7f7]"}`}
                >
                  <span className="w-5 text-xs">{i + 1}</span>
                  <BookOpen size={15} />
                  <span className="truncate">{x.title}</span>
                </a>
              ) : (
                <div
                  key={x.slug}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#889396]"
                >
                  <span className="w-5 text-xs">{i + 1}</span>
                  <Lock size={14} />
                  <span className="truncate">{x.title}</span>
                </div>
              );
            })}
          </div>
        </aside>
      </main>
    </div>
  );
}

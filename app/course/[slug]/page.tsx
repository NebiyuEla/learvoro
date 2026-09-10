/* oxlint-disable next/no-html-link-for-pages */
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Check,
  ChevronDown,
  Clock,
  FileText,
  Globe2,
  Lock,
  PlayCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { findCourse, formatPrice } from "@/lib/course-data";
import { coursePrices, withPrice } from "@/lib/course-pricing";
export const dynamic = "force-dynamic";
export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const baseCourse = findCourse(slug);
  if (!baseCourse) redirect("/courses");
  const course = withPrice(baseCourse, await coursePrices());
  const checkoutSession = Array.from({ length: 4 }, () => crypto.randomUUID().replaceAll('-', '')).join('');
  const count = course.sections.reduce((n, s) => n + s.lessons.length, 0);
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-[#073D86] text-white">
          <div className="mx-auto max-w-[1180px] px-5 py-12 lg:px-8">
            <p className="text-sm text-white/65">Courses / {course.category}</p>
            <div className="mt-6 max-w-[760px]">
              <p className="text-sm font-semibold text-[#43D5B7]">
                {course.category} · {course.level}
              </p>
              <h1 className="mt-3 font-heading text-[clamp(2rem,5vw,3rem)] font-bold leading-tight">
                {course.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-white/80">
                {course.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/75">
                <span>
                  Created by <b className="text-white">{course.instructor}</b>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe2 size={15} />
                  {course.language}
                </span>
              </div>
            </div>
          </div>
        </section>
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div>
            <section className="rounded-xl border bg-white p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold">
                What you’ll learn
              </h2>
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {course.outcomes.map((x) => (
                  <li key={x} className="flex gap-3 text-sm">
                    <Check className="shrink-0 text-[#008d7c]" size={18} />
                    {x}
                  </li>
                ))}
              </ul>
            </section>
            <section className="mt-10">
              <h2 className="font-heading text-2xl font-bold">
                Course content
              </h2>
              <p className="mt-2 text-sm text-[#5d696c]">
                {course.sections.length} sections · {count} lessons ·{" "}
                {course.duration}
              </p>
              <div className="mt-5 overflow-hidden rounded-xl border bg-white">
                {course.sections.map((section, si) => (
                  <details
                    key={section.title}
                    open={si === 0}
                    className="group border-b last:border-0"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-3 bg-[#f7f9f9] px-5 py-4 font-heading font-bold">
                      <ChevronDown
                        className="transition group-open:rotate-180"
                        size={18}
                      />
                      {section.title}
                      <span className="ml-auto text-xs font-normal">
                        {section.lessons.length} lessons
                      </span>
                    </summary>
                    {section.lessons.map((lesson, i) => (
                      <div
                        key={lesson.slug}
                        className="flex items-center gap-3 border-t px-5 py-3.5 text-sm"
                      >
                        <span className="w-6 text-xs">{i + 1}</span>
                        {lesson.preview ? (
                          <PlayCircle size={17} className="text-[#0870C9]" />
                        ) : (
                          <Lock size={15} />
                        )}
                        <span>{lesson.title}</span>
                        {lesson.preview && (
                          <a
                            href={`/learn/${course.slug}/lesson/${lesson.slug}`}
                            className="ml-auto font-semibold text-[#0870C9]"
                          >
                            Preview
                          </a>
                        )}
                        <span
                          className={
                            lesson.preview ? "hidden sm:block" : "ml-auto"
                          }
                        >
                          {lesson.duration}
                        </span>
                      </div>
                    ))}
                  </details>
                ))}
              </div>
            </section>
            <section className="mt-10">
              <h2 className="font-heading text-2xl font-bold">Requirements</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {course.requirements.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          </div>
          <aside className="lg:-mt-48">
            <div className="sticky top-6 overflow-hidden rounded-xl border bg-white shadow-xl">
              <a
                href={`/learn/${course.slug}/lesson/${course.sections[0].lessons[0].slug}`}
                className="course-cover course-cover-1 grid aspect-video place-items-center text-white"
              >
                <span className="grid size-14 place-items-center rounded-full bg-white text-[#0757B2]">
                  <PlayCircle size={30} />
                </span>
              </a>
              <div className="p-6">
                <p className="text-3xl font-bold">{formatPrice(course)}</p>
                <Link
                  href={`/checkout/${course.slug}?session=${checkoutSession}`}
                  className="mt-5 block rounded-lg bg-[#0757B2] px-5 py-3.5 text-center font-semibold text-white"
                >
                  Buy course
                </Link>
                <a
                  href={`/learn/${course.slug}/lesson/${course.sections[0].lessons[0].slug}`}
                  className="mt-3 block rounded-lg border px-5 py-3 text-center font-semibold"
                >
                  Preview first lesson
                </a>
                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex gap-3">
                    <Clock size={17} />
                    Lifetime access
                  </li>
                  <li className="flex gap-3">
                    <FileText size={17} />
                    {count} written lessons
                  </li>
                  <li className="flex gap-3">
                    <Check size={17} />
                    Completion certificate
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

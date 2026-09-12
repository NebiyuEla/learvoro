/* oxlint-disable next/no-html-link-for-pages, jsx-a11y/prefer-tag-over-role */
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { env } from "@/lib/runtime";
import { requireChatGPTUser, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { Logo } from "@/components/site-header";
import { courseCover, courses, lessonsFor } from "@/lib/course-data";
export const dynamic = "force-dynamic";
export const metadata = { title: "My Learning", robots: { index: false } };

export default async function MyLearning({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; course?: string }>;
}) {
  const user = await requireChatGPTUser("/my-learning");
  const { payment, course: purchasedSlug } = await searchParams;
  const db = (env as unknown as { DB: D1Database }).DB;
  let owned: { results: { course_id: string }[] } = { results: [] };
  try {
    owned = await db
      .prepare(
        "SELECT course_id FROM entitlements WHERE user_id=? AND status='active'",
      )
      .bind(user.userId)
      .all<{ course_id: string }>();
  } catch {}
  const ids = new Set(owned.results.map((item) => item.course_id));
  const enrolled = courses.filter((course) => ids.has(course.id));
  const purchased =
    payment === "paid"
      ? enrolled.find((course) => course.slug === purchasedSlug)
      : undefined;
  return (
    <>
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center px-5">
          <a href="/">
            <Logo />
          </a>
          <span className="ml-8 text-sm font-semibold">My Learning</span>
          <a href={chatGPTSignOutPath("/")} className="ml-auto text-sm">
            Sign out
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-5 py-12">
        {purchased && (
          <div
            role="status"
            className="checkout-success mb-8 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800"
          >
            <CheckCircle2 className="mt-0.5 shrink-0" size={25} />
            <div>
              <h2 className="font-heading text-lg font-bold">
                Payment confirmed
              </h2>
              <p className="mt-1 text-sm">
                {purchased.title} has been added to your learning library.
              </p>
            </div>
          </div>
        )}
        <p className="text-sm text-[#5d696c]">
          Signed in as {user.displayName}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold">My Learning</h1>
        {enrolled.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {enrolled.map((course) => {
              const first = lessonsFor(course)[0];
              return (
                <article
                  key={course.id}
                  className="overflow-hidden rounded-xl border bg-white"
                >
                <div className="relative aspect-video overflow-hidden p-6 text-white">
                  <Image src={courseCover(course.slug)} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  <span className="absolute inset-0 bg-[#061b3a]/40" />
                  <h2 className="relative font-heading text-2xl font-bold">
                      {course.shortTitle}
                    </h2>
                  </div>
                  <div className="p-6">
                    <h2 className="font-heading text-xl font-bold">
                      {course.title}
                    </h2>
                    <p className="mt-2 text-sm text-[#5d696c]">
                      {lessonsFor(course).length} lessons · Lifetime access
                    </p>
                    <a
                      href={`/learn/${course.slug}/lesson/${first.slug}`}
                      className="mt-5 inline-block rounded-lg bg-[#0757B2] px-4 py-2.5 font-semibold text-white"
                    >
                      Start learning
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border bg-white p-10 text-center">
            <h2 className="font-heading text-2xl font-bold">
              Your courses will appear here
            </h2>
            <p className="mt-3 text-[#5d696c]">
              Choose a course and complete checkout to begin.
            </p>
            <a
              href="/courses"
              className="mt-6 inline-block rounded-lg bg-[#0757B2] px-5 py-3 font-semibold text-white"
            >
              Explore courses
            </a>
          </div>
        )}
      </main>
    </>
  );
}

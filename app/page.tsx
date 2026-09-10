/* oxlint-disable next/no-html-link-for-pages, jsx-a11y/control-has-associated-label */
import {
  Award,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Code2,
  BookOpenCheck,
  CircleUserRound,
  Palette,
  Play,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { Logo } from '@/components/site-header';
import { getChatGPTUser, chatGPTSignOutPath } from '@/app/chatgpt-auth';

const categories = [
  { name: 'AI & Automation', icon: Bot, copy: 'Practical workflows' },
  { name: 'Development', icon: Code2, copy: 'Web and software' },
  { name: 'Design', icon: Palette, copy: 'Visual and product' },
  { name: 'Business', icon: BriefcaseBusiness, copy: 'Build and operate' },
  { name: 'Freelancing', icon: Sparkles, copy: 'Independent work' },
  { name: 'Productivity', icon: Zap, copy: 'Work more clearly' },
];
export default async function Home() {
  const user = await getChatGPTUser();
  return (
    <div className="min-h-screen bg-[#f8fafa] text-[#162326]">
      <header className="sticky top-0 z-40 border-b border-[#e4e9e9] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center gap-8 px-5 lg:px-10">
          <a href="/" className="shrink-0">
            <Logo />
          </a>
          <nav
            className="hidden items-center gap-6 text-sm font-medium md:flex"
            aria-label="Main navigation"
          >
            <a href="/courses">Explore</a>
            <a href="#categories">Categories</a>
            <a href="#paths">Learning Paths</a>
            <a href="/pricing">Learvoro+</a>
          </nav>
          <div className="ml-auto flex items-center gap-2.5">
            {user ? (
              <>
                <span className="hidden items-center gap-2 text-sm text-[#526063] lg:flex">
                  <CircleUserRound size={20} className="text-[#0757B2]" />
                  Welcome, <b className="text-[#162326]">{user.displayName}</b>
                </span>
                <a
                  href="/my-learning"
                  className="rounded-lg bg-[#0757B2] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  My learning
                </a>
                <a
                  href={chatGPTSignOutPath('/')}
                  className="hidden px-3 py-2 text-sm font-semibold sm:block"
                >
                  Sign out
                </a>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="hidden px-3 py-2 text-sm font-semibold sm:block"
                >
                  Log in
                </a>
                <a
                  href="/signup"
                  className="rounded-lg bg-[#0757B2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#063F8F]"
                >
                  Sign up
                </a>
              </>
            )}
          </div>
        </div>
      </header>
      <main>
        <section className="border-b border-[#e4e9e9] bg-white">
          <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 py-16 md:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-24">
            <div>
              <p className="mb-5 text-sm font-semibold text-[#0870C9]">
                Courses built around useful work
              </p>
              <h1 className="max-w-[650px] font-heading text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.045em]">
                Learn skills you can actually use.
              </h1>
              <p className="mt-6 max-w-[590px] text-lg leading-8 text-[#5d696c]">
                Practical courses, guided projects and resources for technology,
                creativity and business.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0757B2] px-5 py-3 text-sm font-semibold text-white"
                >
                  Explore courses <ArrowRight size={16} />
                </a>
                <a
                  href="#paths"
                  className="rounded-lg border border-[#cfd8d8] bg-white px-5 py-3 text-sm font-semibold"
                >
                  View learning paths
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-[#d9e1e1] bg-white shadow-[0_22px_60px_rgba(0,64,80,.12)]">
              <div className="relative aspect-[16/9] bg-[#073D86] p-7 text-white">
                <div className="absolute inset-0 course-grid opacity-30" />
                <div className="relative flex h-full flex-col justify-between">
                  <span className="w-fit rounded-md bg-white/10 px-2.5 py-1 text-xs">
                    Lesson 10 of 17
                  </span>
                  <a
                    href="/learn/professional-portfolio-website/lesson/welcome"
                    className="mx-auto grid size-14 place-items-center rounded-full bg-white text-[#0757B2]"
                    aria-label="Open course preview"
                  >
                    <Play className="ml-1" fill="currentColor" />
                  </a>
                  <div>
                    <p className="text-xs text-white/70">
                      Build your portfolio
                    </p>
                    <p className="mt-1 font-heading text-xl font-semibold">
                      Creating the projects section
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between text-sm">
                  <b>Professional Portfolio Website</b>
                  <span>42%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#e8efee]">
                  <div className="h-full w-[42%] rounded-full bg-[#18B394]" />
                </div>
                <div className="mt-4 flex justify-between text-xs text-[#5d696c]">
                  <span>3h 20m · 17 lessons</span>
                  <span>Continue learning</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-b bg-[#073D86] text-white">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-white/15 px-5 sm:grid-cols-4 lg:px-10">
            {[
              ['3', 'Focused courses'],
              ['19', 'Practical lessons'],
              ['6', 'Skill categories'],
              ['Lifetime', 'Course access'],
            ].map(([value, label]) => (
              <div key={label} className="px-5 py-8 text-center">
                <b className="font-heading text-3xl">{value}</b>
                <span className="mt-1 block text-sm text-white/70">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section
          id="categories"
          className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10"
        >
          <p className="section-kicker">Browse by subject</p>
          <h2 className="section-title">Popular categories</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ name, icon: Icon, copy }) => (
              <a
                key={name}
                href={`/courses?category=${encodeURIComponent(name)}`}
                className="group flex items-center gap-4 rounded-lg border bg-white p-5 hover:border-[#83cfc4]"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-[#E7F8F3] text-[#0D8F7B]">
                  <Icon size={19} />
                </span>
                <span>
                  <b className="block font-heading text-[15px]">{name}</b>
                  <span className="text-sm text-[#687477]">{copy}</span>
                </span>
                <ArrowRight className="ml-auto text-[#9aa6a8]" size={17} />
              </a>
            ))}
          </div>
        </section>
        <section className="border-y bg-white">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
            <div className="overflow-hidden rounded-2xl border shadow-[0_18px_50px_rgba(7,61,134,.14)]">
              <Image
                src="/learvoro-learning-studio.png"
                alt="A modern digital learning workspace"
                width={1944}
                height={840}
                className="aspect-[16/9] h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="section-kicker">A complete learning workspace</p>
              <h2 className="section-title">
                Everything stays connected from lesson one to completion.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#5d696c]">
                Move from clear written guidance to practical project work,
                track progress, and return to every course from one personal
                dashboard.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Benefit
                  icon={BookOpenCheck}
                  title="Practical lessons"
                  copy="Short steps with a concrete outcome"
                />
                <Benefit
                  icon={Award}
                  title="Completion records"
                  copy="Progress saved to your account"
                />
                <Benefit
                  icon={ShieldCheck}
                  title="Private account"
                  copy="Secure sessions and protected access"
                />
                <Benefit
                  icon={Sparkles}
                  title="Useful projects"
                  copy="Build work you can share"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="border-y bg-white">
          <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
            <p className="section-kicker">Featured course</p>
            <h2 className="section-title">
              Start with a project worth sharing
            </h2>
            <a
              href="/course/professional-portfolio-website"
              className="mt-8 grid overflow-hidden rounded-xl border md:grid-cols-[.8fr_1.2fr]"
            >
              <div className="portfolio-art relative min-h-[260px] p-8 text-white">
                <div className="absolute left-8 top-8 rounded-md border border-white/25 px-2.5 py-1 text-xs">
                  Development · Beginner
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="mb-4 h-px bg-white/25" />
                  <p className="font-heading text-2xl font-semibold">
                    Portfolio<span className="text-[#43D5B7]">.</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <p className="text-sm font-medium text-[#0870C9]">Learvoro</p>
                <h3 className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                  Build Your First Professional Portfolio Website
                </h3>
                <p className="mt-4 leading-7 text-[#5d696c]">
                  Plan, build and publish a responsive portfolio that presents
                  your work clearly and connects to your own domain.
                </p>
                <div className="mt-6 flex flex-wrap gap-5 text-sm text-[#5d696c]">
                  <span>3h 20m</span>
                  <span>17 lessons</span>
                  <span>English</span>
                </div>
                <div className="mt-7 flex items-center justify-between border-t pt-6">
                  <b className="text-xl">$19.00</b>
                  <span className="inline-flex items-center gap-2 font-semibold text-[#0757B2]">
                    View course <ArrowRight size={17} />
                  </span>
                </div>
              </div>
            </a>
          </div>
        </section>
        <section
          id="paths"
          className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10"
        >
          <p className="section-kicker">Structured learning</p>
          <h2 className="section-title">Follow a clear path</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              [
                'Frontend Developer',
                'HTML & CSS',
                'Responsive design',
                'JavaScript foundations',
              ],
              [
                'Freelancer Starter',
                'Choose your service',
                'Build a portfolio',
                'Find your first clients',
              ],
            ].map(([title, ...steps]) => (
              <div key={title} className="rounded-xl border bg-white p-6">
                <h3 className="font-heading text-xl font-bold">{title}</h3>
                <ol className="mt-6 space-y-4">
                  {steps.map((step, n) => (
                    <li key={step} className="flex items-center gap-4 text-sm">
                      <span
                        className={`grid size-7 place-items-center rounded-full ${n === 0 ? 'bg-[#0757B2] text-white' : 'bg-[#edf2f2]'}`}
                      >
                        {n + 1}
                      </span>
                      <b>{step}</b>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
        <section className="border-y bg-white">
          <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="section-kicker">Verified course feedback</p>
                <h2 className="section-title">
                  Reviews tied to real course progress
                </h2>
              </div>
              <p className="max-w-xl text-[#5d696c]">
                Learvoro will show reviews only from enrolled learners. New
                ratings will appear here after students complete enough of a
                course to give useful feedback.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <ReviewMeasure
                title="Clear instruction"
                copy="Did each lesson explain the goal and the next action clearly?"
              />
              <ReviewMeasure
                title="Practical output"
                copy="Did the course finish with useful work the learner could keep?"
              />
              <ReviewMeasure
                title="Appropriate pace"
                copy="Was the course focused, well structured and easy to continue?"
              />
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 lg:grid-cols-[.7fr_1.3fr] lg:px-10">
          <div>
            <p className="section-kicker">Questions, answered</p>
            <h2 className="section-title">
              Know what to expect before you enroll.
            </h2>
            <p className="mt-4 text-[#5d696c]">
              Every course page includes the full curriculum, duration,
              requirements and access details.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border bg-white">
            {[
              [
                'Can I preview a course?',
                'Yes. Each course includes a free opening lesson so you can check the teaching style before enrolling.',
              ],
              [
                'How long do I keep access?',
                'Published courses include lifetime access through your Learvoro account.',
              ],
              [
                'Where is my progress saved?',
                'Completed lessons and course access are attached to your signed-in account.',
              ],
              [
                'Will reviews be verified?',
                'Yes. Review submission will be limited to enrolled learners and connected to course progress.',
              ],
            ].map(([q, a]) => (
              <details key={q} className="group border-b last:border-0">
                <summary className="cursor-pointer list-none px-6 py-5 font-heading font-bold">
                  {q}
                  <span className="float-right text-[#0870C9]">+</span>
                </summary>
                <p className="px-6 pb-5 leading-7 text-[#5d696c]">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t bg-[#f1f6f5]">
        <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
          <Logo />
          <div className="mt-6 flex flex-wrap gap-5 text-sm text-[#526063]">
            <a href="/courses">Courses</a>
            <a href="/help">Help</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/refund-policy">Refund Policy</a>
          </div>
          <p className="mt-8 text-xs text-[#758183]">
            © 2026 Learvoro. Practical learning, clearly taught.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Benefit({
  icon: Icon,
  title,
  copy,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border bg-white p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E7F8F3] text-[#0D8F7B]">
        <Icon size={20} />
      </span>
      <div>
        <b className="font-heading">{title}</b>
        <p className="mt-1 text-sm leading-5 text-[#687477]">{copy}</p>
      </div>
    </div>
  );
}
function ReviewMeasure({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="rounded-xl border bg-[#f8fafa] p-6">
      <div
        className="flex items-center gap-1 text-[#f2a900]"
        aria-label="Five review criteria"
      >
        <Award size={18} />
        <b className="ml-2 text-[#162326]">Review criterion</b>
      </div>
      <h3 className="mt-5 font-heading text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-7 text-[#5d696c]">{copy}</p>
    </article>
  );
}

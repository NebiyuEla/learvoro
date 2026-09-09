/* oxlint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { env } from 'cloudflare:workers';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { Logo } from '@/components/site-header';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin', robots: { index: false } };
export default async function Admin() {
  const user = await requireChatGPTUser('/admin');
  const db = (env as unknown as { DB: D1Database }).DB;
  const account = await db.prepare("SELECT role FROM users WHERE id=? LIMIT 1").bind(user.userId).first<{ role: string }>();
  if (account?.role !== 'admin') redirect('/my-learning');
  return (
    <div className="min-h-screen bg-[#f6f8f8]">
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <Link href="/">
            <Logo />
          </Link>
          <span className="ml-4 rounded bg-[#E7F8F3] px-2 py-1 text-xs font-semibold text-[#0757B2]">
            Admin
          </span>
        </div>
      </header>
      <div className="grid md:grid-cols-[220px_1fr]">
        <aside className="border-r bg-white p-5">
          <nav className="space-y-1 text-sm">
            {[
              'Overview',
              'Courses',
              'Sections & lessons',
              'Users',
              'Enrollments',
              'Orders',
              'Payments',
              'Refunds',
              'Reviews',
              'Certificates',
              'Coupons',
              'Site settings',
            ].map((x, i) => (
              <a
                key={x}
                href="#"
                className={`block rounded-lg px-3 py-2.5 ${i === 0 ? 'bg-[#E7F8F3] font-semibold text-[#0757B2]' : 'text-[#526063]'}`}
              >
                {x}
              </a>
            ))}
          </nav>
        </aside>
        <main className="p-6 md:p-10">
          <h1 className="font-heading text-3xl font-bold">
            Operations overview
          </h1>
          <p className="mt-2 text-[#5d696c]">
            Live figures appear here as orders and enrollments are recorded.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['Revenue', 'Orders', 'Students', 'Courses'].map((x, i) => (
              <section key={x} className="rounded-xl border bg-white p-5">
                <p className="text-sm text-[#5d696c]">{x}</p>
                <p className="mt-3 font-heading text-3xl font-bold">
                  {i === 3 ? '1' : '—'}
                </p>
              </section>
            ))}
          </div>
          <section className="mt-8 rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">Courses</h2>
              <button className="rounded-lg bg-[#0757B2] px-4 py-2 text-sm font-semibold text-white">
                Create course
              </button>
            </div>
            <div className="mt-5 border-t py-5">
              <p className="font-semibold">
                Build Your First Professional Portfolio Website
              </p>
              <p className="mt-1 text-sm text-[#5d696c]">
                Published · $19.00 · 17 lessons
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

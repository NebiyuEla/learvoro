import { redirect } from 'next/navigation';
import {
  BookOpenCheck,
  LockKeyhole,
  MonitorCheck,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '@/components/site-header';
import { CheckoutDetailsForm } from '@/components/checkout-details-form';
import { findCourse, formatPrice } from '@/lib/course-data';

export const metadata = {
  title: 'Cybersecurity Checkout Demonstration',
  robots: { index: false, follow: false },
};
export default async function CheckoutDemo({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = findCourse(courseSlug);
  if (!course) redirect('/courses');
  const price = formatPrice(course);
  return (
    <div className="min-h-screen bg-[#f4f7fa] text-[#12213d]">
      <div className="bg-[#082b5d] px-4 py-2 text-center text-xs font-bold tracking-[.12em] text-white">
        UNIVERSITY CYBERSECURITY DEMO — SYNTHETIC DATA ONLY
      </div>
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1380px] items-center px-5 py-3 lg:px-10">
          <Logo />
          <div className="ml-auto flex items-center gap-3">
            <LockKeyhole className="text-[#0757B2]" size={28} />
            <div className="hidden sm:block">
              <b className="block">Secure checkout</b>
              <span className="text-sm text-[#657794]">
                Training environment
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-[1380px] gap-7 px-4 py-4 md:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)] lg:px-10">
        <CheckoutDetailsForm product={course.title} price={price} />
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-2xl font-bold">Order summary</h2>
            <div className="mt-6 flex gap-4 border-b pb-6">
              <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-[#082b5d] text-white">
                <BookOpenCheck size={30} />
              </span>
              <div>
                <b className="block leading-5">{course.title}</b>
                <span className="mt-1 block text-sm text-[#657794]">
                  Cybersecurity classroom demonstration
                </span>
              </div>
            </div>
            <dl className="mt-5 space-y-3">
              <Summary label="Course" value={price} />
              <Summary label="Processing fee" value="$0.00" />
              <div className="flex justify-between border-t pt-5 text-xl font-bold">
                <dt>Total</dt>
                <dd>{price}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-2xl border bg-white p-6">
            <div className="flex gap-4">
              <ShieldCheck className="shrink-0 text-[#0b9b78]" size={36} />
              <div>
                <h3 className="font-heading text-lg font-bold">
                  Safe by design
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#657794]">
                  Only the displayed synthetic credentials are accepted.
                  Training submissions are held temporarily in server memory for
                  the instructor monitor.
                </p>
              </div>
            </div>
          </section>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Feature
              icon={<MonitorCheck />}
              title="Local simulation"
              copy="Authenticated instructor feed"
            />
            <Feature
              icon={<LockKeyhole />}
              title="Temporary data"
              copy="Refresh to erase"
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#657794]">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
function Feature({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <span className="text-[#0757B2]">{icon}</span>
      <b className="mt-3 block">{title}</b>
      <p className="mt-1 text-sm text-[#657794]">{copy}</p>
    </div>
  );
}

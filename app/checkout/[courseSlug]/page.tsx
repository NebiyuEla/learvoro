/* oxlint-disable next/no-html-link-for-pages */
import { redirect } from 'next/navigation';
import {
  BookOpenCheck,
  CreditCard,
  Globe2,
  HelpCircle,
  LockKeyhole,
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
        <div className="mx-auto flex max-w-[1180px] items-center px-5 py-4 lg:px-6">
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
      <div className="mx-auto max-w-[1180px] px-5 py-5 lg:px-6">
        <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-start gap-3 text-center text-sm text-[#566983]">
          <Step number="1" label="Payment" active />
          <span className="mt-5 h-px bg-[#cfd7e2]" />
          <Step number="2" label="Review" />
          <span className="mt-5 h-px bg-[#cfd7e2]" />
          <Step number="3" label="Complete" />
        </div>
      </div>
      <main className="mx-auto grid max-w-[1180px] gap-7 px-5 pb-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,.95fr)] lg:px-6">
        <CheckoutDetailsForm product={course.title} price={price} />
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Order Summary</h2>
              <a
                href="/courses"
                className="text-sm font-semibold text-[#087af0]"
              >
                Edit
              </a>
            </div>
            <div className="mt-6 flex gap-4 border-b pb-6">
              <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-[#082b5d] text-white">
                <BookOpenCheck size={30} />
              </span>
              <div className="min-w-0">
                <b className="block leading-5">{course.title}</b>
                <span className="mt-1 block text-sm text-[#657794]">
                  Cybersecurity classroom demonstration
                </span>
              </div>
              <b className="ml-auto whitespace-nowrap">{price}</b>
            </div>
            <dl className="mt-5 space-y-3">
              <Summary label="Subtotal" value={price} />
              <Summary label="Processing fee" value="$0.00" />
              <div className="flex justify-between border-t pt-5 text-xl font-bold">
                <dt>Total</dt>
                <dd>{price}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-xl bg-[#eafaf2] p-6 text-[#08784f]">
            <div className="flex gap-4">
              <ShieldCheck className="shrink-0 text-[#0b9b78]" size={36} />
              <div>
                <h3 className="font-heading text-lg font-bold">
                  Your training session is secure
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#28715e]">
                  Generated synthetic credentials are isolated from real payment
                  systems and shown only in the instructor monitor.
                </p>
              </div>
            </div>
          </section>
          <div className="grid grid-cols-2 gap-3">
            <Feature
              icon={<LockKeyhole />}
              title="Isolated Demo"
              copy="Synthetic data only"
            />
            <Feature
              icon={<ShieldCheck />}
              title="Instructor View"
              copy="Authenticated monitor"
            />
            <Feature
              icon={<CreditCard />}
              title="Training Cards"
              copy="Always begin with 0000"
            />
            <Feature
              icon={<Globe2 />}
              title="Classroom Ready"
              copy="Desktop and mobile"
            />
          </div>
          <div className="flex items-center gap-4 px-3 py-2">
            <span className="grid size-10 place-items-center rounded-full bg-[#e9eef4]">
              <HelpCircle size={20} />
            </span>
            <p className="text-sm">
              Need help?
              <br />
              <a
                href="/help"
                className="font-semibold text-[#087af0] underline"
              >
                Contact support
              </a>
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
function Step({
  number,
  label,
  active = false,
}: {
  number: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div>
      <span
        className={`mx-auto grid size-10 place-items-center rounded-full font-bold ${active ? 'bg-[#087af0] text-white' : 'bg-[#e9eef4]'}`}
      >
        {number}
      </span>
      <b className={`mt-2 block ${active ? 'text-[#087af0]' : ''}`}>{label}</b>
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

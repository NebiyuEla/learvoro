/* oxlint-disable next/no-html-link-for-pages */
import { redirect } from 'next/navigation';
import {
  BookOpen,
  CreditCard,
  Globe2,
  HelpCircle,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import { getChatGPTUser, chatGPTSignInPath } from '@/app/chatgpt-auth';
import { Logo } from '@/components/site-header';
import { CheckoutDetailsForm } from '@/components/checkout-details-form';
import { findCourse, formatPrice } from '@/lib/course-data';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Secure checkout', robots: { index: false } };

export default async function Checkout({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = findCourse(courseSlug);
  if (!course) redirect('/courses');
  const user = await getChatGPTUser();
  if (!user)
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <div className="max-w-md rounded-xl border bg-white p-8">
          <Logo />
          <h1 className="mt-8 font-heading text-2xl font-bold">
            Sign in to continue
          </h1>
          <p className="mt-3 text-[#5d696c]">
            We’ll bring you straight back to secure checkout.
          </p>
          <a
            href={chatGPTSignInPath(`/checkout/${course.slug}`)}
            className="mt-6 block rounded-lg bg-[#087af0] p-3 text-center font-semibold text-white"
          >
            Sign in
          </a>
        </div>
      </main>
    );
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#12213d]">
      <header className="bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center px-5 py-5 lg:px-10">
          <Logo />
          <div className="ml-auto flex items-center gap-3">
            <LockKeyhole size={30} />
            <div>
              <b className="block">Secure Checkout</b>
              <span className="text-sm text-[#657794]">
                Your information is protected
              </span>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1440px] px-5 pt-5 lg:px-10">
        <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-start gap-3 text-center text-sm text-[#566983]">
          <Step n="1" label="Details" active />
          <span className="mt-5 h-px bg-[#d5dce5]" />
          <Step n="2" label="Payment" />
          <span className="mt-5 h-px bg-[#d5dce5]" />
          <Step n="3" label="Complete" />
        </div>
      </div>
      <main className="mx-auto grid max-w-[1440px] gap-7 px-5 py-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,.75fr)] lg:px-10">
        <CheckoutDetailsForm
          courseSlug={course.slug}
          email={user.email}
          fullName={user.fullName ?? ''}
          category={course.category}
          price={formatPrice(course)}
        />
        <aside className="space-y-5">
          <section className="rounded-xl border bg-white p-7">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Order Summary</h2>
              <a href="/courses" className="text-[#087af0]">
                Edit
              </a>
            </div>
            <div className="mt-6 flex gap-4 border-b pb-5">
              <div className="grid size-20 shrink-0 place-items-center rounded-lg bg-[#082b5d] text-white">
                <BookOpen size={34} />
              </div>
              <div className="min-w-0">
                <b className="block text-lg">{course.title}</b>
                <span className="text-[#657794]">
                  {course.level} · {course.duration}
                </span>
              </div>
              <b className="ml-auto whitespace-nowrap">{formatPrice(course)}</b>
            </div>
            <dl className="mt-5 space-y-3">
              <Summary label="Subtotal" value={formatPrice(course)} />
              <Summary label="Processing fee" value="$0.00" />
              <div className="mt-4 flex justify-between border-t pt-5 text-xl font-bold">
                <dt>Total</dt>
                <dd>{formatPrice(course)}</dd>
              </div>
            </dl>
          </section>
          <section className="flex gap-5 rounded-xl bg-[#eafaf2] p-6 text-[#08784f]">
            <ShieldCheck className="shrink-0" size={48} />
            <div>
              <h3 className="text-lg font-bold">Your payment is secure</h3>
              <p className="mt-1 leading-6">
                Stripe provides encrypted payment processing and 3D Secure
                authentication when required.
              </p>
            </div>
          </section>
          <div className="grid grid-cols-2 gap-3">
            <Feature
              icon={<LockKeyhole />}
              title="Encrypted Checkout"
              copy="Card details go to Stripe"
            />
            <Feature
              icon={<ShieldCheck />}
              title="3D Secure"
              copy="When required"
            />
            <Feature
              icon={<CreditCard />}
              title="Major Cards"
              copy="Visa, Mastercard & more"
            />
            <Feature
              icon={<Globe2 />}
              title="Global Access"
              copy="Learn from anywhere"
            />
          </div>
          <div className="flex items-center gap-4 p-4">
            <span className="grid size-11 place-items-center rounded-full bg-[#edf1f6]">
              <HelpCircle />
            </span>
            <p>
              Need help?
              <br />
              <a href="/help" className="text-[#087af0] underline">
                Contact our support team
              </a>
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Step({
  n,
  label,
  active = false,
}: {
  n: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div>
      <span
        className={`mx-auto grid size-10 place-items-center rounded-full text-base font-semibold ${active ? 'bg-[#087af0] text-white' : 'bg-[#edf1f6]'}`}
      >
        {n}
      </span>
      <b className={active ? 'mt-2 block text-[#087af0]' : 'mt-2 block'}>
        {label}
      </b>
    </div>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#526986]">{label}</dt>
      <dd>{value}</dd>
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
    <div className="rounded-xl bg-white p-5 text-center shadow-sm">
      <span className="mx-auto grid size-10 place-items-center text-[#29425f]">
        {icon}
      </span>
      <b className="mt-2 block">{title}</b>
      <p className="mt-1 text-sm leading-5 text-[#657794]">{copy}</p>
    </div>
  );
}

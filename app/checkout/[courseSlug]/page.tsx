import { LockKeyhole } from 'lucide-react';
import { getChatGPTUser, chatGPTSignInPath } from '@/app/chatgpt-auth';
import { Logo } from '@/components/site-header';
import { CheckoutDetailsForm } from '@/components/checkout-details-form';
import { course } from '@/lib/course-data';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Secure checkout', robots: { index: false } };
export default async function Checkout() {
  const user = await getChatGPTUser();
  const priceLabel = new Intl.NumberFormat('en-US', { style: 'currency', currency: course.currency }).format(course.price / 100);
  if (!user)
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <div className="max-w-md rounded-xl border bg-white p-8">
          <Logo />
          <h1 className="mt-8 font-heading text-2xl font-bold">
            Sign in to continue
          </h1>
          <p className="mt-3 text-[#5d696c]">
            We’ll bring you straight back to checkout after you sign in.
          </p>
          <a
            href={chatGPTSignInPath(`/checkout/${course.slug}`)}
            target="_top"
            className="mt-6 block rounded-lg bg-[#0757B2] p-3 text-center font-semibold text-white"
          >
            Sign in
          </a>
        </div>
      </main>
    );
  return (
    <>
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-[1050px] items-center px-5">
          <Logo />
          <span className="ml-auto inline-flex items-center gap-2 text-sm text-[#5d696c]">
            <LockKeyhole size={15} /> Secure checkout
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-[1080px] px-5 py-10">
        <div className="mb-10 grid grid-cols-3 text-center text-sm"><div className="border-b-2 border-[#0757B2] pb-3 font-semibold text-[#0757B2]">1&nbsp; Payment</div><div className="border-b pb-3 text-[#6a777a]">2&nbsp; Review</div><div className="border-b pb-3 text-[#6a777a]">3&nbsp; Complete</div></div>
        <div className="grid gap-10 md:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-heading text-3xl font-bold">
            Complete your purchase
          </h1>
          <CheckoutDetailsForm courseSlug={course.slug} email={user.email} fullName={user.fullName ?? ''} priceLabel={priceLabel} />
        </div>
        <aside>
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-heading text-lg font-bold">Order summary</h2>
            <div className="mt-5 flex gap-4">
              <div className="portfolio-art h-20 w-28 shrink-0 rounded-lg" />
              <p className="text-sm font-semibold leading-5">{course.title}</p>
            </div>
            <dl className="mt-6 space-y-3 border-t pt-5 text-sm">
              <div className="flex justify-between">
                <dt>Course</dt>
                <dd>{priceLabel}</dd>
              </div>
              <div className="flex justify-between border-t pt-4 text-base font-bold">
                <dt>Total</dt>
                <dd>{course.currency} {priceLabel}</dd>
              </div>
            </dl>
          </div>
        </aside>
        </div>
      </main>
    </>
  );
}

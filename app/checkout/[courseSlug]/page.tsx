import { LockKeyhole } from 'lucide-react';
import { getChatGPTUser, chatGPTSignInPath } from '@/app/chatgpt-auth';
import { Logo } from '@/components/site-header';
import { course } from '@/lib/course-data';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Secure checkout', robots: { index: false } };
export default async function Checkout() {
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
      <main className="mx-auto grid max-w-[1050px] gap-10 px-5 py-10 md:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-heading text-3xl font-bold">
            Complete your purchase
          </h1>
          <section className="mt-8 rounded-xl border bg-white p-6">
            <h2 className="font-heading text-lg font-bold">
              Contact information
            </h2>
            <p className="mt-3 rounded-lg bg-[#f3f7f6] p-4 text-sm">
              {user.email}
            </p>
            <h2 className="mt-8 font-heading text-lg font-bold">
              Payment information
            </h2>
            <div className="mt-3 rounded-lg border border-dashed p-6 text-center">
              <LockKeyhole className="mx-auto text-[#0870C9]" />
              <p className="mt-3 font-semibold">Stripe secure payment</p>
              <p className="mt-2 text-sm leading-6 text-[#5d696c]">
                Connect your Stripe test keys to load the PCI-compliant Payment
                Element. Learvoro never receives or stores your full card
                number or security code.
              </p>
            </div>
            <button
              disabled
              className="mt-6 w-full rounded-lg bg-[#0757B2] p-3.5 font-semibold text-white disabled:opacity-50"
            >
              Pay $19.00
            </button>
          </section>
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
                <dd>$19.00</dd>
              </div>
              <div className="flex justify-between border-t pt-4 text-base font-bold">
                <dt>Total</dt>
                <dd>USD $19.00</dd>
              </div>
            </dl>
          </div>
        </aside>
      </main>
    </>
  );
}

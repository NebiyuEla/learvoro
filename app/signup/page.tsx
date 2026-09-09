/* oxlint-disable next/no-html-link-for-pages */
import { Logo } from '@/components/site-header';
import { AuthForm } from '@/components/auth-form';
export const metadata = { title: 'Create account', robots: { index: false } };
export default async function Signup({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f8f7] px-5">
      <div className="w-full max-w-md rounded-xl border bg-white p-8">
        <Logo />
        <h1 className="mt-10 font-heading text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-[#5d696c]">Keep your courses and progress in one place.</p>
        <AuthForm mode="signup" returnTo={returnTo} />
        <p className="mt-5 text-sm text-[#697679]">By continuing, you agree to the <a className="underline" href="/terms">Terms</a> and <a className="underline" href="/privacy">Privacy Policy</a>.</p>
      </div>
    </main>
  );
}

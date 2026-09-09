/* oxlint-disable next/no-html-link-for-pages */
import { Logo } from '@/components/site-header';
import { AuthForm } from '@/components/auth-form';
export const metadata = { title: 'Log in', robots: { index: false } };
export default async function Login({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  return <main className="grid min-h-screen place-items-center bg-[#f4f8f7] px-5"><div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm"><Logo/><h1 className="mt-10 font-heading text-3xl font-bold">Welcome back</h1><p className="mt-2 text-[#5d696c]">Log in to continue your courses.</p><AuthForm mode="login" returnTo={returnTo}/><p className="mt-5 text-center text-sm">New to Learvoro? <a href="/signup" className="font-semibold text-[#0757B2]">Create an account</a></p></div></main>;
}

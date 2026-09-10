/* oxlint-disable next/no-html-link-for-pages */
import Image from 'next/image';
import { getChatGPTUser, chatGPTSignOutPath } from '@/app/chatgpt-auth';

export function Logo() {
  return (
    <span className="learvoro-logo">
      <Image
        src="/learvoro-logo-transparent.png"
        width={2172}
        height={724}
        priority
        alt="Learvoro.com"
      />
    </span>
  );
}

export async function SiteHeader() {
  const user = await getChatGPTUser();
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center gap-8 px-5 lg:px-10">
        <a href="/">
          <Logo />
        </a>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          <a href="/courses">Explore</a>
          <a href="/#categories">Categories</a>
          <a href="/#paths">Learning Paths</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-[#526063] lg:inline">
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
                className="px-3 py-2 text-sm font-semibold"
              >
                Sign out
              </a>
            </>
          ) : (
            <>
              <a href="/login" className="px-3 py-2 text-sm font-semibold">
                Log in
              </a>
              <a
                href="/signup"
                className="rounded-lg bg-[#0757B2] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

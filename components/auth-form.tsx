'use client';

import { useState } from 'react';

export function AuthForm({ mode, returnTo = '/my-learning' }: { mode: 'login' | 'signup'; returnTo?: string }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...data, returnTo }) });
      const body = await response.json().catch(() => ({})) as { redirect?: string; error?: string };
      if (response.ok) { location.assign(body.redirect || returnTo); return; }
      setError(body.error || 'We could not complete this request. Please try again.');
    } catch {
      setError('Unable to reach the server. Please check your connection and try again.');
    }
    setBusy(false);
  }
  return <form method="post" onSubmit={submit} className="mt-7 space-y-4">
    {mode === 'signup' && <label className="block font-semibold">Full name<input name="fullName" required autoComplete="name" className="enroll-input mt-2" /></label>}
    <label className="block font-semibold">Email address<input name="email" type="email" required autoComplete="email" className="enroll-input mt-2" /></label>
    <label className="block font-semibold">Password<input name="password" type="password" required minLength={10} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="enroll-input mt-2" /></label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button type="submit" disabled={busy} className="w-full rounded-lg bg-[#0757B2] px-4 py-3 font-semibold text-white disabled:opacity-60">{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
    <div className="flex items-center gap-3 text-xs text-[#697679]"><span className="h-px flex-1 bg-[#dfe5e5]"/>OR<span className="h-px flex-1 bg-[#dfe5e5]"/></div>
    <a href={`/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`} className="block w-full rounded-lg border px-4 py-3 text-center font-semibold">Continue with Google</a>
  </form>;
}

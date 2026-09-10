'use client';
/* oxlint-disable next/no-html-link-for-pages */
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  LockKeyhole,
} from 'lucide-react';
import { SiApplepay, SiDiscover, SiGooglepay, SiMastercard, SiVisa } from 'react-icons/si';

type Data = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  address: string;
  postalCode: string;
  trainingNumber: string;
  expiry: string;
  demoCode: string;
};
type AuthorizationStep = 'idle' | 'encrypting' | 'authorizing' | 'confirming';
function generate(includePayment = true): Data {
  const id = String(Math.floor(1000 + Math.random() * 9000)),
    street = String(Math.floor(100 + Math.random() * 900)),
    group = () => String(Math.floor(1000 + Math.random() * 9000));
  return {
    fullName: `Student ${id}`,
    email: `student${id}@example.edu`,
    phone: `+1 555 010 ${id}`,
    country: 'United States',
    region: 'California',
    city: 'San Francisco',
    address: `${street} Training Avenue`,
    postalCode: `9${id}`,
    trainingNumber: includePayment ? `0000 ${group()} ${group()} ${group()}` : '',
    expiry: includePayment ? '12/30' : '',
    demoCode: includePayment ? String(Math.floor(100 + Math.random() * 900)) : '',
  };
}

export function HostedCheckoutDemo({
  product,
  courseSlug,
  initialSessionId,
  price,
  category,
  level,
  duration,
  lessons,
}: {
  product: string;
  courseSlug: string;
  initialSessionId?: string;
  price: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
}) {
  const [data, setData] = useState<Data>(() => generate(false)),
    [liveId] = useState(() => initialSessionId || crypto.randomUUID()),
    [error, setError] = useState(''),
    [captureId, setCaptureId] = useState(initialSessionId || ''),
    [decision, setDecision] = useState<'editing' | 'pending' | 'approved' | 'declined'>(initialSessionId ? 'pending' : 'editing'),
    [authorizationStep, setAuthorizationStep] = useState<AuthorizationStep>('idle'),
    [busy, setBusy] = useState(false);
  const set = <K extends keyof Data>(key: K, value: Data[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setError('');
    setDecision('editing');
  };
  const card = (value: string) =>
    (value.match(/\d/g) ?? [])
      .slice(0, 16)
      .join('')
      .match(/.{1,4}/g)
      ?.join(' ') ?? '';
  const expiry = (value: string) => {
    const digits = (value.match(/\d/g) ?? []).slice(0, 4).join('');
    return digits.length > 2
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits;
  };
  const complete =
    /^Student \d{4}$/.test(data.fullName) &&
    /^student\d{4}@example\.edu$/.test(data.email) &&
    /^\+1 555 010 \d{4}$/.test(data.phone) &&
    /^\d{3} Training Avenue$/.test(data.address) &&
    /^9\d{4}$/.test(data.postalCode) &&
    /^0000 \d{4} \d{4} \d{4}$/.test(data.trainingNumber) &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry) &&
    /^\d{3}$/.test(data.demoCode);
  async function submit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!complete) {
      setError(
        'Training mode: generate a synthetic classroom profile before continuing.',
      );
      return;
    }
    setBusy(true);
    try {
      setAuthorizationStep('encrypting');
      await new Promise((resolve) => setTimeout(resolve, 1600));
      setAuthorizationStep('authorizing');
      await new Promise((resolve) => setTimeout(resolve, 1700));
      setAuthorizationStep('confirming');
      await new Promise((resolve) => setTimeout(resolve, 1700));
      const response = await fetch('/api/training/capture', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, product, courseSlug, captureId: liveId }),
      });
      if (!response.ok) throw new Error();
      const result = (await response.json()) as { id: string };
      setCaptureId(result.id);
      setDecision('pending');
    } catch {
      setError('The instructor training monitor is unavailable.');
    }
    setAuthorizationStep('idle');
    setBusy(false);
  }
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('session', liveId);
    window.history.replaceState({}, '', url);
  }, [liveId]);
  useEffect(() => {
    if (decision !== 'editing') return;
    void fetch('/api/training/capture', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...data, product, courseSlug, captureId: liveId }),
    });
  }, [courseSlug, data, decision, liveId, product]);
  useEffect(() => {
    if (!captureId || decision !== 'pending') return;
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`/api/training/capture?id=${encodeURIComponent(captureId)}`, { cache: 'no-store' });
        if (!response.ok) return;
        const result = (await response.json()) as { status: 'pending' | 'approved' | 'declined' };
        if (result.status !== 'pending') setDecision(result.status);
      } catch {}
    }, 1200);
    return () => clearInterval(timer);
  }, [captureId, decision]);
  useEffect(() => {
    if (decision !== 'approved') return;
    const timer = setTimeout(() => window.location.assign('/my-learning'), 2600);
    return () => clearTimeout(timer);
  }, [decision]);
  return (
    <main className="min-h-screen bg-white text-[#1a1f36]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="bg-[#f7f8fa] px-6 py-8 lg:flex lg:justify-end lg:px-12 lg:py-14">
          <div className="w-full max-w-[520px]">
            <a
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#596780]"
            >
              <ArrowLeft size={16} />
              Back to courses
            </a>
            <div className="mt-9 flex items-center gap-3">
              <Image
                src="/learvoro-logo-transparent.png"
                alt="Learvoro"
                width={2172}
                height={724}
                className="h-auto w-40"
              />
            </div>
            <p className="mt-10 text-sm font-medium text-[#596780]">
              Enroll in
            </p>
            <h1 className="mt-2 max-w-lg font-heading text-3xl font-bold leading-tight">
              {product}
            </h1>
            <div className="mt-5 flex items-end gap-3">
              <b className="text-4xl tracking-tight">{price}</b>
              <span className="pb-1 text-sm text-[#697386]">
                USD · one-time payment
              </span>
            </div>
            <article className="mt-9 rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#0a3a78] text-white">
                  <BookOpenCheck size={28} />
                </span>
                <div>
                  <h2 className="font-semibold">{product}</h2>
                  <p className="mt-1 text-sm text-[#697386]">
                    Lifetime course access
                  </p>
                </div>
                <b className="ml-auto">{price}</b>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-5 text-sm text-[#596780]">
                <span className="flex items-center gap-2">
                  <GraduationCap size={17} />
                  {category} · {level}
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 size={17} />
                  {duration} · {lessons} lessons
                </span>
              </div>
            </article>
            <div className="mt-8 flex gap-5 text-xs text-[#87909d]">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <span>© Learvoro 2026</span>
            </div>
          </div>
        </section>
        <section className="px-6 py-8 lg:px-12 lg:py-14">
          <form
            onSubmit={submit}
            autoComplete="off"
            className="mx-auto w-full max-w-[500px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  Complete your enrollment
                </h2>
                <p className="mt-2 text-sm text-[#697386]">
                  All values below are synthetic training data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setData(generate());
                  setDecision('editing');
                  setError('');
                }}
                className="rounded-lg border px-3 py-2 text-xs font-semibold text-[#0a65c7]"
              >
                Autofill demo
              </button>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3" aria-label="Unavailable express checkout methods">
              <button type="button" disabled className="flex h-12 cursor-not-allowed items-center justify-center rounded-lg bg-black text-white" title="Unavailable in training mode"><SiApplepay size={48} aria-label="Apple Pay" /></button>
              <button type="button" disabled className="flex h-12 cursor-not-allowed items-center justify-center rounded-lg bg-[#4285f4] text-white" title="Unavailable in training mode"><SiGooglepay size={52} aria-label="Google Pay" /></button>
            </div>
            <div className="my-6 flex items-center gap-3 text-xs text-[#87909d]"><span className="h-px flex-1 bg-[#dfe3e8]" />Or pay with synthetic card<span className="h-px flex-1 bg-[#dfe3e8]" /></div>
            <div>
              <h3 className="text-sm font-semibold">Contact information</h3>
              <Field label="Email">
                <input
                  required
                  value={data.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </Field>
              <Field label="Phone">
                <input
                  required
                  value={data.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-7">
              <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Payment method</h3><span className="text-[10px] font-bold uppercase tracking-wider text-[#697386]">University demo · synthetic only</span></div>
              <div className="mt-3 rounded-xl border p-4 shadow-sm">
                <div className="overflow-hidden rounded-lg border">
                  <div className="relative">
                    <input
                      aria-label="Training card number"
                      placeholder="0000 1234 5678 9012"
                      value={data.trainingNumber}
                      onChange={(e) =>
                        set('trainingNumber', card(e.target.value))
                      }
                      className="hosted-field rounded-none border-0 pr-40"
                    />
                    <div className="absolute right-3 top-1/2 flex -translate-y-1/2 gap-2">
                      <SiVisa className="text-[#173f82]" size={31} />
                      <SiMastercard className="text-[#e24b3b]" size={27} />
                      <SiDiscover className="text-[#ed7d22]" size={28} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-t">
                    <input
                      aria-label="Expiry"
                      placeholder="MM / YY"
                      value={data.expiry}
                      onChange={(e) => set('expiry', expiry(e.target.value))}
                      className="hosted-field rounded-none border-0 border-r"
                    />
                    <input
                      aria-label="Demo security code"
                      placeholder="123"
                      value={data.demoCode}
                      onChange={(e) =>
                        set(
                          'demoCode',
                          (e.target.value.match(/\d/g) ?? [])
                            .slice(0, 3)
                            .join(''),
                        )
                      }
                      className="hosted-field rounded-none border-0"
                    />
                  </div>
                </div>
                <Field label="Name on training card">
                  <input
                    value={data.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                  />
                </Field>
                <Field label="Country or region">
                  <div className="relative">
                    <select
                      value={data.country}
                      onChange={(e) => set('country', e.target.value)}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Ethiopia">Ethiopia</option>
                    </select>
                  </div>
                </Field>
                <Field label="State or region">
                  <input
                    value={data.region}
                    onChange={(e) => set('region', e.target.value)}
                    autoComplete="off"
                  />
                </Field>
                <Field label="Address">
                  <input
                    value={data.address}
                    onChange={(e) => set('address', e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City">
                    <input
                      value={data.city}
                      onChange={(e) => set('city', e.target.value)}
                    />
                  </Field>
                  <Field label="Postal code">
                    <input
                      value={data.postalCode}
                      onChange={(e) => set('postalCode', e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </div>
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            {decision === 'approved' && (
              <div className="checkout-success mt-4 flex gap-3 rounded-xl bg-[#eafaf2] p-5 text-sm text-[#08784f]">
                <CheckCircle2 className="shrink-0" size={30} />
                <p><b className="text-base">Payment approved — you’re enrolled!</b><br />Opening your course library now…</p>
              </div>
            )}
            {decision === 'declined' && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                <b>Enrollment was declined.</b> No course access was added. You can update the training details and try again.
              </div>
            )}
            <button
              disabled={!complete || busy || decision === 'pending' || decision === 'approved'}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0874d4] px-5 py-4 font-semibold text-white shadow-sm hover:bg-[#0566bd] disabled:cursor-not-allowed disabled:bg-[#a9b6c6] disabled:opacity-55"
            >
              {busy || decision === 'pending' ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LockKeyhole size={18} />
              )}
              {decision === 'approved' ? 'Enrollment approved' : decision === 'pending' ? 'Awaiting approval' : 'Enroll for ' + price}
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-[#87909d]">
              One-time course enrollment · Lifetime access
            </p>
          </form>
        </section>
      </div>
      {(busy || decision === 'pending') && (
        <dialog open className="fixed inset-0 z-50 m-0 grid h-full max-h-none w-full max-w-none place-items-center border-0 bg-[#0b1728]/45 p-5 backdrop-blur-[2px]" aria-live="polite">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#eef6ff] text-[#0874d4]"><Loader2 className="animate-spin" size={30} /></span>
            <h2 className="mt-5 font-heading text-xl font-bold">Checkout processing</h2>
            <p className="mt-2 text-sm text-[#697386]">Please keep this page open while we confirm your enrollment.</p>
            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#e4eaf0]"><span className={`checkout-processing-bar block h-full rounded-full bg-[#0874d4] ${decision === 'pending' ? 'w-full' : authorizationStep === 'encrypting' ? 'w-1/3' : authorizationStep === 'authorizing' ? 'w-2/3' : 'w-full'}`} /></div>
            <p className="mt-3 text-xs font-medium text-[#87909d]">Synthetic training transaction · No payment network contacted</p>
          </div>
        </dialog>
      )}
    </main>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="hosted-control mt-3 block text-xs font-medium text-[#596780]">
      {label}
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

'use client';
/* oxlint-disable next/no-html-link-for-pages */
import Image from 'next/image';
import { useState } from 'react';
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import { SiDiscover, SiMastercard, SiVisa } from 'react-icons/si';

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
const initial: Data = {
  fullName: 'Student 4821',
  email: 'student4821@example.edu',
  phone: '+1 555 010 4821',
  country: 'United States',
  region: 'California',
  city: 'San Francisco',
  address: '482 Training Avenue',
  postalCode: '94821',
  trainingNumber: '0000 4821 7395 2064',
  expiry: '12/30',
  demoCode: '482',
};
function generate(): Data {
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
    trainingNumber: `0000 ${group()} ${group()} ${group()}`,
    expiry: '12/30',
    demoCode: String(Math.floor(100 + Math.random() * 900)),
  };
}

export function HostedCheckoutDemo({
  product,
  price,
  category,
  level,
  duration,
  lessons,
}: {
  product: string;
  price: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
}) {
  const [data, setData] = useState(initial),
    [error, setError] = useState(''),
    [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false);
  const set = <K extends keyof Data>(key: K, value: Data[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setError('');
    setSent(false);
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
  async function submit(e: { preventDefault(): void }) {
    e.preventDefault();
    const valid =
      /^Student \d{4}$/.test(data.fullName) &&
      /^student\d{4}@example\.edu$/.test(data.email) &&
      /^\+1 555 010 \d{4}$/.test(data.phone) &&
      /^\d{3} Training Avenue$/.test(data.address) &&
      /^9\d{4}$/.test(data.postalCode) &&
      /^0000 \d{4} \d{4} \d{4}$/.test(data.trainingNumber) &&
      data.expiry === '12/30' &&
      /^\d{3}$/.test(data.demoCode);
    if (!valid) {
      setError(
        'Training mode: generate a synthetic classroom profile before continuing.',
      );
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/training/capture', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, product }),
      });
      if (!response.ok) throw new Error();
      setSent(true);
    } catch {
      setError('The instructor training monitor is unavailable.');
    }
    setBusy(false);
  }
  return (
    <main className="min-h-screen bg-white text-[#1a1f36]">
      <div className="fixed inset-x-0 top-0 z-50 bg-[#0a2f66] px-3 py-2 text-center text-[11px] font-bold tracking-[.14em] text-white">
        UNIVERSITY CYBERSECURITY DEMO — SYNTHETIC DATA ONLY
      </div>
      <div className="grid min-h-screen pt-8 lg:grid-cols-2">
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
            <div className="mt-8 flex gap-3 rounded-xl bg-[#ecf8f3] p-4 text-sm leading-6 text-[#13765e]">
              <ShieldCheck className="shrink-0" />
              <p>
                <b>Synthetic classroom checkout.</b>
                <br />
                Generated credentials cannot be used with any payment network.
              </p>
            </div>
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
                  setSent(false);
                  setError('');
                }}
                className="rounded-lg border px-3 py-2 text-xs font-semibold text-[#0a65c7]"
              >
                Generate data
              </button>
            </div>
            <div className="mt-8">
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
              <h3 className="text-sm font-semibold">Payment method</h3>
              <div className="mt-3 flex items-center gap-2 rounded-t-lg border border-b-0 bg-[#f8fbff] px-4 py-3 text-sm font-semibold text-[#0a65c7]">
                <span className="size-3 rounded-full border-[4px] border-[#0a65c7]" />
                Training card
              </div>
              <div className="rounded-b-lg border p-4">
                <div className="overflow-hidden rounded-lg border">
                  <div className="relative">
                    <input
                      aria-label="Training card number"
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
                      value={data.expiry}
                      onChange={(e) => set('expiry', expiry(e.target.value))}
                      className="hosted-field rounded-none border-0 border-r"
                    />
                    <input
                      aria-label="Demo security code"
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
                      <option>United States</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                      size={17}
                    />
                  </div>
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
            {sent && (
              <div className="mt-4 flex gap-3 rounded-lg bg-[#eafaf2] p-4 text-sm text-[#08784f]">
                <CheckCircle2 />
                <p>
                  <b>Training submission captured.</b>
                  <br />
                  The authenticated instructor monitor has updated.
                </p>
              </div>
            )}
            <button
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0874d4] px-5 py-4 font-semibold text-white shadow-sm hover:bg-[#0566bd] disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LockKeyhole size={18} />
              )}
              Enroll for {price}
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-[#87909d]">
              One-time course enrollment · Lifetime access
            </p>
          </form>
        </section>
      </div>
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

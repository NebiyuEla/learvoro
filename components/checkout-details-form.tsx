'use client';
import { useState } from 'react';
import {
  CheckCircle2,
  CircleHelp,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import { SiDiscover, SiMastercard, SiVisa } from 'react-icons/si';

type TrainingData = {
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
const starter: TrainingData = {
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
function generatedData(): TrainingData {
  const id = String(Math.floor(1000 + Math.random() * 9000));
  const street = String(Math.floor(100 + Math.random() * 900));
  const group = () => String(Math.floor(1000 + Math.random() * 9000));
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

export function CheckoutDetailsForm({
  product,
  price,
}: {
  product: string;
  price: string;
}) {
  const [data, setData] = useState(starter);
  const [captured, setCaptured] = useState<TrainingData | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  function update<K extends keyof TrainingData>(
    key: K,
    value: TrainingData[K],
  ) {
    setData((current) => ({ ...current, [key]: value }));
    setCaptured(null);
    setError('');
  }
  function formatNumber(value: string) {
    return (
      (value.match(/\d/g) ?? [])
        .slice(0, 16)
        .join('')
        .match(/.{1,4}/g)
        ?.join(' ') ?? ''
    );
  }
  function formatExpiry(value: string) {
    const digits = (value.match(/\d/g) ?? []).slice(0, 4).join('');
    return digits.length > 2
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits;
  }
  async function submit(event: { preventDefault(): void }) {
    event.preventDefault();
    const synthetic =
      /^Student \d{4}$/.test(data.fullName) &&
      /^student\d{4}@example\.edu$/.test(data.email) &&
      /^\+1 555 010 \d{4}$/.test(data.phone) &&
      data.country === 'United States' &&
      data.region === 'California' &&
      data.city === 'San Francisco' &&
      /^\d{3} Training Avenue$/.test(data.address) &&
      /^9\d{4}$/.test(data.postalCode) &&
      /^0000 \d{4} \d{4} \d{4}$/.test(data.trainingNumber) &&
      data.expiry === '12/30' &&
      /^\d{3}$/.test(data.demoCode);
    if (!synthetic) {
      setError(
        'Training mode: use Generate synthetic data to create valid classroom credentials.',
      );
      return;
    }
    setSending(true);
    setError('');
    try {
      const response = await fetch('/api/training/capture', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, product }),
      });
      if (!response.ok) throw new Error('rejected');
      setCaptured({ ...data });
    } catch {
      setError(
        'The training monitor could not receive this simulation. Please try again.',
      );
    }
    setSending(false);
  }
  return (
    <div className="space-y-5">
      <form
        onSubmit={submit}
        autoComplete="off"
        className="rounded-xl border bg-white p-6 shadow-sm md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-[2rem] font-bold leading-tight">
              Payment Details
            </h1>
            <p className="mt-3 flex items-center gap-2 text-[#657794]">
              <LockKeyhole size={18} />
              Synthetic classroom checkout
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setData(generatedData());
              setCaptured(null);
              setError('');
            }}
            className="rounded-md border border-[#8db6df] bg-[#f4f9ff] px-3 py-2 text-xs font-semibold text-[#0757B2]"
          >
            Generate synthetic data
          </button>
        </div>
        <div className="mt-7">
        <p className="text-sm font-bold">Training card information</p>
          <div className="mt-2 overflow-hidden rounded-lg border border-[#cbd5e1]">
            <div className="relative">
              <input
                aria-label="16-digit Training Number"
                required
                inputMode="numeric"
                value={data.trainingNumber}
                onChange={(e) =>
                  update('trainingNumber', formatNumber(e.target.value))
                }
                className="block w-full border-0 px-5 py-4 pr-44 text-lg outline-none"
              />
              <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <SiVisa className="text-[#173f82]" size={31} />
                <SiMastercard className="text-[#e24b3b]" size={27} />
                <SiDiscover className="text-[#ed7d22]" size={29} />
              </div>
            </div>
            <div className="grid grid-cols-2 border-t">
              <div className="relative border-r">
                <input
                  aria-label="Expiry date"
                  required
                  inputMode="numeric"
                  value={data.expiry}
                  onChange={(e) =>
                    update('expiry', formatExpiry(e.target.value))
                  }
                  className="block w-full border-0 px-5 py-4 text-lg outline-none"
                />
              </div>
              <div className="relative">
                <input
                  aria-label="Demo Security Code"
                  required
                  inputMode="numeric"
                  value={data.demoCode}
                  onChange={(e) =>
                    update(
                      'demoCode',
                      (e.target.value.match(/\d/g) ?? []).slice(0, 3).join(''),
                    )
                  }
                  className="block w-full border-0 px-5 py-4 pr-12 text-lg outline-none"
                />
                <CircleHelp
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#526986]"
                  size={20}
                />
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-[#657794]">
            Synthetic training numbers always start with 0000 and cannot be used
            for payment.
          </p>
        </div>
        <div className="mt-5">
          <Field label="Name on training card">
            <input
              required
              value={data.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className="checkout-field"
            />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Billing address">
            <select
              value={data.country}
              onChange={(e) => update('country', e.target.value)}
              className="checkout-field bg-white"
            >
              <option>United States</option>
            </select>
          </Field>
          <input
            aria-label="Street address"
            required
            value={data.address}
            onChange={(e) => update('address', e.target.value)}
            className="checkout-field mt-3"
          />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input
              aria-label="City"
              required
              value={data.city}
              onChange={(e) => update('city', e.target.value)}
              className="checkout-field"
            />
            <input
              aria-label="Postal code"
              required
              value={data.postalCode}
              onChange={(e) => update('postalCode', e.target.value)}
              className="checkout-field"
            />
          </div>
        </div>
        <label className="mt-5 flex items-center gap-3 text-sm text-[#314966]">
          <input
            type="checkbox"
            defaultChecked
            className="size-5 accent-[#087af0]"
          />
          Keep this synthetic example for the current page session
        </label>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-lg bg-[#087af0] px-5 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-[#066bd1] disabled:opacity-60"
        >
          {sending ? <Loader2 className="animate-spin" /> : <LockKeyhole />}
          {sending ? 'Sending training simulation…' : `Pay ${price}`}
        </button>
        <p className="mt-4 text-center text-xs text-[#657794]">
          UNIVERSITY CYBERSECURITY DEMO — SYNTHETIC DATA ONLY
        </p>
      </form>
      {captured && <CapturedPanel data={captured} product={product} />}
    </div>
  );
}

function CapturedPanel({
  data,
  product,
}: {
  data: TrainingData;
  product: string;
}) {
  const rows: [string, string][] = [
    ['Full Name', data.fullName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Country', data.country],
    ['State', data.region],
    ['City', data.city],
    ['Address', data.address],
    ['Postal Code', data.postalCode],
    ['Training Number', data.trainingNumber],
    ['Expiry', data.expiry],
    ['Demo Security Code', data.demoCode],
  ];
  return (
    <section
      aria-live="polite"
      className="rounded-xl border-2 border-[#0b9b78] bg-white p-6 shadow-sm"
    >
      <div className="flex gap-3">
        <CheckCircle2 className="shrink-0 text-[#0b9b78]" />
        <div>
          <h2 className="font-heading text-xl font-bold">
            Captured Form Data — Training Simulation
          </h2>
          <p className="mt-1 text-sm text-[#657794]">
            Live instructor monitor updated · {product}
          </p>
        </div>
      </div>
      <dl className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="border-b py-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[#657794]">
              {label}
            </dt>
            <dd className="mt-1 break-words font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex gap-3 rounded-lg bg-[#eafaf2] p-4 text-sm leading-6 text-[#08784f]">
        <ShieldCheck className="shrink-0" />
        <p>
          Only generated synthetic classroom data is accepted. Records remain
          temporary and are never written to the database.
        </p>
      </div>
    </section>
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
    <label className="block text-sm font-bold text-[#12213d]">
      {label}
      {children}
    </label>
  );
}

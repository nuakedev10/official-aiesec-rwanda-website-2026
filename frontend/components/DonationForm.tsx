'use client';

import { useState } from 'react';
import { submitDonation } from '@/lib/api';
import { donationSchema, flattenZodErrors } from '@/lib/validation';
import FormStatusMessage from './FormStatusMessage';

const PRESET_AMOUNTS = [25, 50, 100];

export default function DonationForm() {
  const [amount, setAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const finalAmount = customAmount ? Number(customAmount) : amount;

    const values = {
      fullName: String(formData.get('fullName') || ''),
      email: String(formData.get('email') || ''),
      amount: finalAmount,
      frequency,
      dedicateGift: formData.get('dedicateGift') === 'on',
      dedicationNote: String(formData.get('dedicationNote') || ''),
    };

    const parsed = donationSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(flattenZodErrors(parsed.error));
      setStatus('error');
      return;
    }

    setErrors({});
    setStatus('submitting');
    try {
      // Card details are never collected here — this creates a pending
      // record, and in production the response would redirect to a hosted
      // Stripe Checkout session rather than complete inline.
      await submitDonation(parsed.data);
      setStatus('success');
      e.currentTarget.reset();
      setCustomAmount('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <span className="field-label">Choose an amount (USD)</span>
        <div className="flex flex-wrap gap-3">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setAmount(preset);
                setCustomAmount('');
              }}
              aria-pressed={amount === preset && !customAmount}
              className={`btn ${
                amount === preset && !customAmount
                  ? 'bg-accent-yellow text-ink-heading'
                  : 'border border-border bg-white text-ink-heading'
              }`}
            >
              ${preset}
            </button>
          ))}
          <input
            type="number"
            min={1}
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            aria-label="Custom donation amount"
            className="field-input max-w-[10rem]"
          />
        </div>
        {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
      </div>

      <div>
        <span className="field-label">Frequency</span>
        <div className="flex gap-3" role="radiogroup" aria-label="Donation frequency">
          {(['one-time', 'monthly'] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={frequency === f}
              onClick={() => setFrequency(f)}
              className={`btn ${
                frequency === f ? 'bg-primary text-white' : 'border border-border bg-white text-ink-heading'
              }`}
            >
              {f === 'one-time' ? 'One-time' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="donor-name" className="field-label">
            Full Name
          </label>
          <input id="donor-name" name="fullName" type="text" required className="field-input" />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="donor-email" className="field-label">
            Email
          </label>
          <input id="donor-email" name="email" type="email" required className="field-input" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-heading">
        <input type="checkbox" name="dedicateGift" className="h-4 w-4 rounded border-border" />
        Dedicate this gift in someone&apos;s honor
      </label>

      <div>
        <label htmlFor="donor-note" className="field-label">
          Dedication note (optional)
        </label>
        <input id="donor-note" name="dedicationNote" type="text" className="field-input" />
      </div>

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full sm:w-auto">
        {status === 'submitting' ? 'Processing...' : 'Donate Now'}
      </button>
      <p className="text-xs text-ink-body">
        You&apos;ll be securely redirected to complete payment — we never store card details on our
        servers.
      </p>

      <FormStatusMessage
        status={status}
        successText="Thank you! Your donation has been recorded — check your email for a receipt."
        errorText="Something went wrong processing your donation. Please check the form and try again."
      />
    </form>
  );
}

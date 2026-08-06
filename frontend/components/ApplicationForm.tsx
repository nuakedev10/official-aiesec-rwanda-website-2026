'use client';

import { useState } from 'react';
import { submitApplication } from '@/lib/api';
import { applicationSchema, flattenZodErrors } from '@/lib/validation';
import FormStatusMessage from './FormStatusMessage';

const PROGRAMS = [
  'Global Volunteer (Incoming)',
  'Global Volunteer (Outgoing)',
  'Global Talent',
  'Global Teacher',
  'Membership',
];

export default function ApplicationForm() {
  const [applicationType, setApplicationType] = useState<'exchange' | 'membership'>('exchange');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      applicationType,
      fullName: String(formData.get('fullName') || ''),
      email: String(formData.get('email') || ''),
      countryOfOrigin: String(formData.get('countryOfOrigin') || ''),
      programOfInterest: String(formData.get('programOfInterest') || ''),
      preferredStartDate: String(formData.get('preferredStartDate') || ''),
      motivation: String(formData.get('motivation') || ''),
    };

    const parsed = applicationSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(flattenZodErrors(parsed.error));
      setStatus('error');
      return;
    }

    setErrors({});
    setStatus('submitting');
    try {
      await submitApplication(parsed.data);
      setStatus('success');
      e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <span className="field-label">Application Type</span>
        <div className="flex gap-3" role="radiogroup" aria-label="Application type">
          {(['exchange', 'membership'] as const).map((type) => (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={applicationType === type}
              onClick={() => setApplicationType(type)}
              className={`btn ${
                applicationType === type
                  ? 'bg-primary text-white'
                  : 'border border-border bg-white text-ink-heading'
              }`}
            >
              {type === 'exchange' ? 'Exchange Program' : 'Membership Program'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="app-fullName" className="field-label">
            Full Name
          </label>
          <input id="app-fullName" name="fullName" type="text" required className="field-input" />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="app-email" className="field-label">
            Email
          </label>
          <input id="app-email" name="email" type="email" required className="field-input" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="app-phone" className="field-label">
            Phone
          </label>
          <input id="app-phone" name="phone" type="tel" className="field-input" />
        </div>
        <div>
          <label htmlFor="app-country" className="field-label">
            Country of Origin
          </label>
          <input id="app-country" name="countryOfOrigin" type="text" required className="field-input" />
          {errors.countryOfOrigin && (
            <p className="mt-1 text-xs text-red-500">{errors.countryOfOrigin}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="app-program" className="field-label">
            Program of Interest
          </label>
          <select
            id="app-program"
            name="programOfInterest"
            required
            defaultValue=""
            className="field-input"
          >
            <option value="" disabled>
              Select a program
            </option>
            {PROGRAMS.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
          {errors.programOfInterest && (
            <p className="mt-1 text-xs text-red-500">{errors.programOfInterest}</p>
          )}
        </div>
        <div>
          <label htmlFor="app-startDate" className="field-label">
            Preferred Start Date
          </label>
          <input
            id="app-startDate"
            name="preferredStartDate"
            type="date"
            required
            className="field-input"
          />
          {errors.preferredStartDate && (
            <p className="mt-1 text-xs text-red-500">{errors.preferredStartDate}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="app-motivation" className="field-label">
          Message / Motivation
        </label>
        <textarea
          id="app-motivation"
          name="motivation"
          rows={5}
          required
          className="field-input"
          placeholder="Tell us why you want to join and what you hope to get out of the program"
        />
        {errors.motivation && <p className="mt-1 text-xs text-red-500">{errors.motivation}</p>}
      </div>

      <button type="submit" disabled={status === 'submitting'} className="btn-blue w-full sm:w-auto">
        {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
      </button>

      <FormStatusMessage
        status={status}
        successText="Application received! Check your email for a confirmation and next steps."
        errorText="Something went wrong submitting your application. Please check the form and try again."
      />
    </form>
  );
}

'use client';

import { useState } from 'react';
import { submitPartnerLead } from '@/lib/api';
import { flattenZodErrors, partnerLeadSchema } from '@/lib/validation';
import FormStatusMessage from './FormStatusMessage';

const PARTNERSHIP_TYPES = [
  'Technology Partner',
  'Reseller / Talent Partner',
  'Corporate Sponsorship',
  'Event Partnership',
  'Other',
];

export default function PartnerLeadForm({
  source,
  dark = false,
}: {
  source: 'for_partners_page' | 'contact_page';
  dark?: boolean;
}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      organizationName: String(formData.get('organizationName') || ''),
      contactPerson: String(formData.get('contactPerson') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      partnershipType: String(formData.get('partnershipType') || ''),
      message: String(formData.get('message') || ''),
    };

    const parsed = partnerLeadSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(flattenZodErrors(parsed.error));
      setStatus('error');
      return;
    }

    setErrors({});
    setStatus('submitting');
    try {
      await submitPartnerLead({ ...parsed.data, source });
      setStatus('success');
      e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  }

  const labelClass = dark ? 'mb-1.5 block text-sm font-medium text-gray-200' : 'field-label';
  const inputClass = dark
    ? 'w-full rounded-card border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-white'
    : 'field-input';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor={`organizationName-${source}`} className={labelClass}>
          Organization Name
        </label>
        <input
          id={`organizationName-${source}`}
          name="organizationName"
          type="text"
          required
          className={inputClass}
          aria-invalid={!!errors.organizationName}
          aria-describedby={errors.organizationName ? `organizationName-${source}-error` : undefined}
        />
        {errors.organizationName && (
          <p id={`organizationName-${source}-error`} className="mt-1 text-xs text-red-500">
            {errors.organizationName}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`contactPerson-${source}`} className={labelClass}>
            Contact Name
          </label>
          <input
            id={`contactPerson-${source}`}
            name="contactPerson"
            type="text"
            required
            className={inputClass}
          />
          {errors.contactPerson && <p className="mt-1 text-xs text-red-500">{errors.contactPerson}</p>}
        </div>
        <div>
          <label htmlFor={`email-${source}`} className={labelClass}>
            Email
          </label>
          <input id={`email-${source}`} name="email" type="email" required className={inputClass} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`phone-${source}`} className={labelClass}>
            Phone (optional)
          </label>
          <input id={`phone-${source}`} name="phone" type="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor={`partnershipType-${source}`} className={labelClass}>
            Partnership Type
          </label>
          <select
            id={`partnershipType-${source}`}
            name="partnershipType"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Select a type
            </option>
            {PARTNERSHIP_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.partnershipType && <p className="mt-1 text-xs text-red-500">{errors.partnershipType}</p>}
        </div>
      </div>

      <div>
        <label htmlFor={`message-${source}`} className={labelClass}>
          Message
        </label>
        <textarea
          id={`message-${source}`}
          name="message"
          rows={4}
          required
          className={inputClass}
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full sm:w-auto">
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>

      <FormStatusMessage
        status={status}
        successText="Thanks — your message has been sent. Our partnerships team will be in touch soon."
        errorText="Something went wrong sending your message. Please check the form and try again."
      />
    </form>
  );
}

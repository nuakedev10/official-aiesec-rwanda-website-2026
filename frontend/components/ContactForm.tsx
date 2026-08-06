'use client';

import { useState } from 'react';
import { submitContactMessage } from '@/lib/api';
import { contactSchema, flattenZodErrors } from '@/lib/validation';
import FormStatusMessage from './FormStatusMessage';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      subject: String(formData.get('subject') || ''),
      message: String(formData.get('message') || ''),
    };

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(flattenZodErrors(parsed.error));
      setStatus('error');
      return;
    }

    setErrors({});
    setStatus('submitting');
    try {
      await submitContactMessage(parsed.data);
      setStatus('success');
      e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">
            Name
          </label>
          <input id="contact-name" name="name" type="text" required className="field-input" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">
            Email
          </label>
          <input id="contact-email" name="email" type="email" required className="field-input" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="contact-subject" className="field-label">
          Subject
        </label>
        <input id="contact-subject" name="subject" type="text" required className="field-input" />
        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
      </div>
      <div>
        <label htmlFor="contact-message" className="field-label">
          Message
        </label>
        <textarea id="contact-message" name="message" rows={5} required className="field-input" />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>
      <button type="submit" disabled={status === 'submitting'} className="btn-blue w-full sm:w-auto">
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
      <FormStatusMessage
        status={status}
        successText="Message sent — we'll get back to you as soon as possible."
        errorText="Something went wrong sending your message. Please check the form and try again."
      />
    </form>
  );
}

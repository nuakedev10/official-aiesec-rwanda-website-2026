'use client';

import { useState } from 'react';
import { submitAlumniRegistration } from '@/lib/api';
import { alumniRegistrationSchema, flattenZodErrors } from '@/lib/validation';
import FormStatusMessage from './FormStatusMessage';

export default function AlumniRegisterForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      fullName: String(formData.get('fullName') || ''),
      email: String(formData.get('email') || ''),
      graduationYear: formData.get('graduationYear'),
    };

    const parsed = alumniRegistrationSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(flattenZodErrors(parsed.error));
      setStatus('error');
      return;
    }

    setErrors({});
    setStatus('submitting');
    try {
      await submitAlumniRegistration(parsed.data);
      setStatus('success');
      e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="alumni-name" className="field-label">
          Full Name
        </label>
        <input id="alumni-name" name="fullName" type="text" required className="field-input" />
        {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
      </div>
      <div>
        <label htmlFor="alumni-email" className="field-label">
          Email
        </label>
        <input id="alumni-email" name="email" type="email" required className="field-input" />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="alumni-year" className="field-label">
          Graduation Year
        </label>
        <input
          id="alumni-year"
          name="graduationYear"
          type="number"
          min={1990}
          max={new Date().getFullYear()}
          required
          className="field-input"
        />
        {errors.graduationYear && <p className="mt-1 text-xs text-red-500">{errors.graduationYear}</p>}
      </div>
      <button type="submit" disabled={status === 'submitting'} className="btn-blue w-full">
        {status === 'submitting' ? 'Registering...' : 'Register Now'}
      </button>
      <FormStatusMessage
        status={status}
        successText="You're registered! We'll review your details and follow up by email."
        errorText="Something went wrong registering. Please check the form and try again."
      />
    </form>
  );
}

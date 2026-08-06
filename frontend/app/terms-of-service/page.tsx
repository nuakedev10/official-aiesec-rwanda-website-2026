import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing use of the AIESEC in Rwanda website.',
};

export default function TermsOfServicePage() {
  return (
    <article className="container-page max-w-3xl py-16">
      <h1 className="text-h2">Terms of Service</h1>
      <p className="mt-6 text-sm leading-relaxed text-ink-body">
        By using this website and submitting any form, you agree to provide accurate information
        and to be contacted by AIESEC in Rwanda regarding your submission. Content on this site
        is provided for informational purposes and may be updated at any time without notice. For
        questions, contact us at hello@aiesecrwanda.org.
      </p>
    </article>
  );
}

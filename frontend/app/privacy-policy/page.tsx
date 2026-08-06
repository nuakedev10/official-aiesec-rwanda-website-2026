import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How AIESEC in Rwanda collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="container-page max-w-3xl py-16">
      <h1 className="text-h2">Privacy Policy</h1>
      <p className="mt-6 text-sm leading-relaxed text-ink-body">
        AIESEC in Rwanda collects only the information you submit through our forms — such as
        applications, partnership inquiries, alumni registrations, and donations — to respond to
        your request, process your submission, and send related confirmation emails. We do not
        sell your personal information to third parties. For questions about your data, contact us
        at hello@aiesecrwanda.org.
      </p>
    </article>
  );
}

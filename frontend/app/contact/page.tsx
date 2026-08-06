import type { Metadata } from 'next';
import SectionHeading from '@/components/SectionHeading';
import SiteImage from '@/components/SiteImage';
import ContactForm from '@/components/ContactForm';
import { IconClock, IconLocation, IconMail, IconPhone } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with AIESEC in Rwanda — send us a message, find our office, or connect on social media.',
};

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com/aiesecrwanda' },
  { label: 'Instagram', href: 'https://instagram.com/aiesecrwanda' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/aiesecrwanda' },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative bg-surface-dark py-20 text-white">
        <div className="absolute inset-0 opacity-40">
          <SiteImage alt="" className="h-full w-full" fill />
        </div>
        <div className="container-page relative max-w-2xl text-center sm:mx-auto">
          <h1 className="text-h1-mobile sm:text-h1">Contact Us</h1>
          <p className="mt-4 text-base text-gray-300 sm:text-lg">
            Have a question about programs, partnerships, or membership? Send us a message and
            we&apos;ll get back to you.
          </p>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading title="Send Us a Message" align="left" />
            <div className="card p-8 sm:p-10">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-8">
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-bold text-ink-heading">Office</h3>
              <ul className="space-y-3 text-sm text-ink-body">
                <li className="flex items-center gap-2">
                  <IconLocation size={16} className="text-primary" /> KG 7 Ave, Kigali, Rwanda
                </li>
                <li className="flex items-center gap-2">
                  <IconMail size={16} className="text-primary" /> hello@aiesecrwanda.org
                </li>
                <li className="flex items-center gap-2">
                  <IconPhone size={16} className="text-primary" /> +250 788 000 000
                </li>
                <li className="flex items-center gap-2">
                  <IconClock size={16} className="text-primary" /> Mon-Fri, 9am-5pm CAT
                </li>
              </ul>
              <SiteImage
                alt="Map showing the AIESEC in Rwanda office location in Kigali"
                label="Map placeholder"
                className="mt-5 h-40 w-full rounded-card"
              />
            </div>

            <div className="card p-6">
              <h3 className="mb-4 text-lg font-bold text-ink-heading">Follow Us</h3>
              <ul className="space-y-2 text-sm">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

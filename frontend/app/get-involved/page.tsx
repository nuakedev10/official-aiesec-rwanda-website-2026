import type { Metadata } from 'next';
import SiteImage from '@/components/SiteImage';
import SectionHeading from '@/components/SectionHeading';
import IconBadge from '@/components/IconBadge';
import ApplicationForm from '@/components/ApplicationForm';
import PartnerLeadForm from '@/components/PartnerLeadForm';
import DonationForm from '@/components/DonationForm';
import { IconBriefcase, IconHandshake, IconHeart } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Get Involved',
  description:
    'Apply to an exchange program, partner with AIESEC in Rwanda, or support our mission with a donation.',
};

const QUICK_LINKS = [
  { href: '#apply', icon: <IconBriefcase size={24} />, color: 'blue' as const, title: 'Apply Now' },
  { href: '#partner', icon: <IconHandshake size={24} />, color: 'green' as const, title: 'Partner With Us' },
  { href: '#donate', icon: <IconHeart size={24} />, color: 'purple' as const, title: 'Support & Donate' },
];

export default function GetInvolvedPage() {
  return (
    <div className="bg-surface-cream">
      {/* Hero */}
      <section className="relative py-20">
        <SiteImage alt="" className="absolute inset-0 h-full w-full opacity-20" fill />
        <div className="container-page relative text-center">
          <h1 className="text-h1-mobile sm:text-h1">Get Involved</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-body sm:text-lg">
            Whichever way you want to get involved — as a volunteer, a partner, or a
            supporter — it starts here.
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="container-page pb-4">
        <div className="grid gap-6 sm:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="card flex items-center gap-4 p-6">
              <IconBadge color={link.color} size={48}>
                {link.icon}
              </IconBadge>
              <span className="text-base font-bold text-ink-heading">{link.title}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="container-page py-20">
        <div className="card mx-auto max-w-3xl p-8 sm:p-12">
          <SectionHeading eyebrow="Exchange & Membership" title="Apply Now" align="left" />
          <ApplicationForm />
        </div>
      </section>

      {/* Partner */}
      <section id="partner" className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-card">
            <div className="bg-gradient-partner px-8 py-10 text-white sm:px-12">
              <h2 className="text-h3">Partner With Us</h2>
              <p className="mt-2 text-purple-50">
                Tell us about your organization and how you&apos;d like to work with AIESEC in
                Rwanda.
              </p>
            </div>
            <div className="card rounded-t-none border-t-0 p-8 sm:p-12">
              <PartnerLeadForm source="for_partners_page" />
            </div>
          </div>
        </div>
      </section>

      {/* Donate */}
      <section id="donate" className="container-page py-20">
        <div className="card mx-auto max-w-3xl p-8 sm:p-12">
          <SectionHeading eyebrow="Give Back" title="Support Our Mission" align="left" />
          <DonationForm />
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import { getPartnershipOpportunities, getPartnerSuccessStories } from '@/lib/api';
import SectionHeading from '@/components/SectionHeading';
import SiteImage from '@/components/SiteImage';
import IconBadge from '@/components/IconBadge';
import PartnerLeadForm from '@/components/PartnerLeadForm';
import { IconCheck, IconGlobe, IconHandshake, IconMail, IconPhone, IconLocation, IconTrendUp } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'For Partners',
  description:
    'Partner with AIESEC in Rwanda to access driven youth talent, sponsor leadership programs, and expand your organization\'s impact.',
};

export default async function ForPartnersPage() {
  const [opportunities, stories] = await Promise.all([
    getPartnershipOpportunities(),
    getPartnerSuccessStories(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-partner text-white">
        <div className="absolute inset-0 opacity-20">
          <SiteImage alt="" className="h-full w-full" fill />
        </div>
        <div className="container-page relative grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-h1-mobile sm:text-h1">Partner with Industry Leaders</h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-purple-50 sm:text-lg">
              Access Rwanda&apos;s most driven young talent, co-host leadership programs, and grow
              your organization&apos;s impact alongside AIESEC in Rwanda.
            </p>
            <Link href="#get-in-touch" className="btn-primary mt-8 inline-flex">
              Get in Touch
            </Link>
          </div>
          <SiteImage
            src="/images/partners/partners-hero.jpg"
            alt="AIESEC in Rwanda partnership team collaborating with a corporate partner"
            className="h-72 w-full rounded-card sm:h-96"
            priority
          />
        </div>
      </section>

      {/* Why partner */}
      <section className="bg-surface-light py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Why Partner" title="Why Partner with Us" />
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="card p-8">
              <IconBadge color="green" size={56}>
                <IconTrendUp size={26} />
              </IconBadge>
              <h3 className="mt-5 text-xl font-bold text-ink-heading">Revenue Growth</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Reduce hiring costs and time-to-fill with a ready pipeline of vetted global talent.
              </p>
            </div>
            <div className="card p-8">
              <IconBadge color="blue" size={56}>
                <IconHandshake size={26} />
              </IconBadge>
              <h3 className="mt-5 text-xl font-bold text-ink-heading">Strategic Collaboration</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Co-create leadership programs and CSR initiatives with Rwanda&apos;s largest
                youth-led network.
              </p>
            </div>
            <div className="card p-8">
              <IconBadge color="purple" size={56}>
                <IconGlobe size={26} />
              </IconBadge>
              <h3 className="mt-5 text-xl font-bold text-ink-heading">Market Expansion</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Reach new markets through our network of 120+ countries and thousands of alumni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership opportunities */}
      <section className="container-page py-20">
        <SectionHeading eyebrow="Opportunities" title="Partnership Opportunities" />
        <div className="grid gap-8 lg:grid-cols-2">
          {opportunities.map((opportunity, index) => (
            <div key={opportunity.id} className="card flex flex-col p-8">
              <h3 className="text-xl font-bold text-ink-heading">{opportunity.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                {opportunity.description}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {opportunity.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink-heading">
                    <IconCheck size={16} className="mt-0.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#get-in-touch"
                className={`btn mt-8 text-white hover:opacity-90 ${
                  index % 2 === 0 ? 'bg-primary' : 'bg-accent-purple'
                }`}
              >
                {opportunity.ctaLabel}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Success stories */}
      <section className="bg-surface-light py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Proven Results" title="Success Stories" />
          <div className="grid gap-6 sm:grid-cols-3">
            {stories.map((story) => (
              <div key={story.id} className="card p-8 text-center">
                <p className="text-4xl font-bold text-primary">{story.metricValue}</p>
                <p className="mt-2 text-sm font-medium text-ink-body">{story.metricLabel}</p>
                <p className="mt-5 text-sm italic leading-relaxed text-ink-heading">
                  &ldquo;{story.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-ink-heading">{story.companyName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get in touch */}
      <section id="get-in-touch" className="bg-surface-dark py-20 text-white">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              light
              eyebrow="Let's Talk"
              title="Ready to Partner with Us?"
              align="left"
              subtitle="Tell us about your organization and what you're looking for — our partnerships team will follow up within two business days."
            />
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <IconPhone size={18} className="text-accent-yellow" /> +250 788 000 000
              </li>
              <li className="flex items-center gap-3">
                <IconMail size={18} className="text-accent-yellow" /> partnerships@aiesecrwanda.org
              </li>
              <li className="flex items-center gap-3">
                <IconLocation size={18} className="text-accent-yellow" /> Kigali, Rwanda
              </li>
            </ul>
          </div>
          <div className="rounded-card bg-white/5 p-8">
            <h3 className="mb-6 text-lg font-bold text-white">Get in Touch</h3>
            <PartnerLeadForm source="for_partners_page" dark />
          </div>
        </div>
      </section>
    </>
  );
}

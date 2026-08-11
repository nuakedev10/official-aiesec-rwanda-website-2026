import Image from 'next/image';
import type { Metadata } from 'next';
import { getAbout } from '@/lib/api';
import SectionHeading from '@/components/SectionHeading';
import SiteImage from '@/components/SiteImage';
import IconBadge from '@/components/IconBadge';
import { IconEye, IconGlobe, IconHeart, IconTarget } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about AIESEC in Rwanda’s mission, vision, values, Member Committee, local committees, and history since 2007.',
};

export default async function AboutPage() {
  const { committeeMembers, localCommittees, history, stats } = await getAbout();

  const mcMembers = committeeMembers.filter((m) => m.committeeLevel === 'MC');

  return (
    <>
      {/* Hero */}
      <section className="relative bg-surface-dark py-28 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/about-hero.jpg"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="container-page relative max-w-3xl text-center sm:mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About AIESEC in Rwanda</h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            We are a national chapter of the world&apos;s largest youth-led non-profit, developing
            leadership in young people through international exchanges and youth leadership
            programs across Rwanda.
          </p>
        </div>
      </section>

      {/* Who we are */}
      <section className="container-page py-20">
        <SectionHeading
          eyebrow="Who We Are"
          title="Mission, Vision & Values"
          subtitle="AIESEC in Rwanda is entirely run by young people, for young people — a platform for leadership development through practical experience."
        />
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="card p-8">
            <IconBadge color="blue" size={56}>
              <IconTarget size={26} />
            </IconBadge>
            <h3 className="mt-5 text-xl font-bold text-ink-heading">Our Mission</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-body">
              To develop leadership in every young person in Rwanda through international
              internships, volunteer exchanges, and youth leadership programs.
            </p>
          </div>
          <div className="card p-8">
            <IconBadge color="orange" size={56}>
              <IconEye size={26} />
            </IconBadge>
            <h3 className="mt-5 text-xl font-bold text-ink-heading">Our Vision</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-body">
              Peace and fulfillment of humankind&apos;s potential, achieved by empowering young
              Rwandans to lead positive change.
            </p>
          </div>
          <div className="card p-8">
            <IconBadge color="green" size={56}>
              <IconHeart size={26} />
            </IconBadge>
            <h3 className="mt-5 text-xl font-bold text-ink-heading">Our Values</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-body">
              Activating leadership, striving for excellence, demonstrating integrity, living
              diversity, enjoying participation, and acting sustainably.
            </p>
          </div>
        </div>
      </section>

      {/* Member Committee */}
      <section className="bg-surface-light py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Our Team" title="Member Committee" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {mcMembers.map((member) => (
              <div key={member.id} className="card overflow-hidden">
                <SiteImage
                  alt={`Portrait of ${member.fullName}`}
                  label="Team photo"
                  className="h-40 w-full"
                />
                <div className="p-4 text-center">
                  <p className="text-sm font-bold text-ink-heading">{member.fullName}</p>
                  <p className="mt-1 text-xs text-ink-body">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local committees */}
      <section className="container-page py-20">
        <SectionHeading eyebrow="Where We Operate" title="Local Committees" />
        <div className="grid gap-6 sm:grid-cols-3">
          {localCommittees.map((lc) => (
            <div key={lc.id} className="card p-8">
              <IconBadge color={(lc.iconKey as 'blue' | 'green' | 'purple') || 'blue'} size={48}>
                <IconGlobe size={22} />
              </IconBadge>
              <h3 className="mt-5 text-lg font-bold text-ink-heading">{lc.name}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-body">
                {lc.region}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-body">{lc.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Global network */}
      <section className="bg-surface-dark py-20 text-white">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              light
              eyebrow="One Global Network"
              title="Our Global Network"
              align="left"
              subtitle="AIESEC in Rwanda is part of a network present in over 120 countries and territories, connecting our members and partners to a truly global community."
            />
            <div className="flex flex-wrap gap-8">
              {stats.map((stat) => (
                <div key={stat.id}>
                  <p className="text-3xl font-bold text-accent-yellow">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <SiteImage
            src="/images/about/global-network-map.webp"
            alt="World map showing AIESEC's global network of over 120 countries"
            className="h-72 w-full rounded-card bg-white p-4 sm:h-96"
            fit="contain"
          />
        </div>
      </section>

      {/* History timeline */}
      <section className="container-page py-20">
        <SectionHeading eyebrow="Since 2007" title="History of AIESEC in Rwanda" />
        <div className="mx-auto max-w-3xl space-y-8">
          {history.map((milestone, index) => (
            <div key={milestone.id} className="flex gap-6">
              <div className="flex flex-col items-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {milestone.year.slice(0, 4)}
                </span>
                {index < history.length - 1 && <span className="mt-2 h-full w-px bg-border" />}
              </div>
              <div className="card flex-1 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {milestone.year}
                </p>
                <h3 className="mt-1 text-lg font-bold text-ink-heading">{milestone.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-body">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

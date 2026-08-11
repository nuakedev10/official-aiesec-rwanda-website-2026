import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getHome } from '@/lib/api';
import SectionHeading from '@/components/SectionHeading';
import IconFeatureCard from '@/components/IconFeatureCard';
import StatCounter from '@/components/StatCounter';
import TestimonialCard from '@/components/TestimonialCard';
import {
  IconArrowDown,
  IconCheck,
  IconGlobe,
  IconGraduationCap,
  IconHandshake,
  IconSparkles,
  IconUsers,
} from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'AIESEC in Rwanda develops leadership in young people through international internships, volunteer exchanges, and youth leadership programs.',
  openGraph: {
    title: 'AIESEC in Rwanda — Developing Leaders for a Better Rwanda',
    description:
      'Join our network, partner with us, or connect with our alumni community driving youth leadership across Rwanda.',
  },
};

const BADGE_COLORS: Record<string, 'blue' | 'green' | 'purple' | 'orange'> = {
  youth_developed: 'blue',
  exchanges: 'green',
  partners: 'purple',
  universities: 'orange',
};

const STAT_ICONS: Record<string, React.ReactNode> = {
  youth_developed: <IconUsers size={22} />,
  exchanges: <IconGlobe size={22} />,
  partners: <IconHandshake size={22} />,
  universities: <IconGraduationCap size={22} />,
};

export default async function HomePage() {
  const { stats, testimonials } = await getHome();

  return (
    <>
      {/* Hero — full-width video background */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-surface-dark">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/home-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="AIESEC in Rwanda youth volunteers and members in action"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />

        <div className="container-page relative z-10 py-24 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-yellow ring-1 ring-inset ring-white/20 backdrop-blur-sm">
              <IconSparkles size={14} />
              Youth-Led Since 2007
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Develop Leaders for a{' '}
              <span className="text-accent-yellow">Better Rwanda</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
              AIESEC in Rwanda builds the next generation of leaders through international
              internships, volunteer exchanges, and hands-on leadership development — for youth,
              partners, and communities across the country.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/get-involved" className="btn-primary text-base">
                Start Your Journey
              </Link>
              <Link href="/for-partners" className="btn-outline-white text-base">
                Partner With Us
              </Link>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-8 border-t border-white/20 pt-8">
              {stats.slice(0, 3).map((stat) => (
                <div key={stat.id}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</dd>
                  <dd className="mt-1 text-xs font-medium text-white/70 sm:text-sm">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <a
          href="#pillars"
          aria-label="Scroll to explore"
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce text-white/70 transition-colors hover:text-white lg:block"
        >
          <IconArrowDown size={24} />
        </a>
      </section>

      {/* Pillar cards */}
      <section id="pillars" className="container-page -mt-14 relative z-20 pb-4">
        <div className="grid gap-6 sm:grid-cols-3">
          <IconFeatureCard
            icon={<IconUsers size={26} />}
            color="blue"
            title="Join Our Network"
            description="Become a member or take part in a global exchange as a Global Volunteer, Global Talent, or Global Teacher."
            linkHref="/for-youth"
            linkLabel="Explore programs"
          />
          <IconFeatureCard
            icon={<IconHandshake size={26} />}
            color="green"
            title="Partner With Us"
            description="Host international talent, sponsor youth leadership programs, and reach Rwanda's most driven young professionals."
            linkHref="/for-partners"
            linkLabel="Become a partner"
          />
          <IconFeatureCard
            icon={<IconGlobe size={26} />}
            color="purple"
            title="Alumni Network"
            description="Reconnect with fellow AIESECers, mentor the next generation, and stay part of a 120+ country community."
            linkHref="/alumni"
            linkLabel="Visit the directory"
          />
        </div>
      </section>

      {/* Impact stats */}
      <section className="container-page py-24">
        <SectionHeading
          eyebrow="Our Impact"
          title="Our Impact in Numbers"
          subtitle="For over a decade, AIESEC in Rwanda has connected young people to opportunities that shape their leadership and their communities."
        />
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCounter
              key={stat.id}
              value={stat.value}
              label={stat.label}
              color={BADGE_COLORS[stat.key] ?? 'blue'}
              icon={STAT_ICONS[stat.key]}
            />
          ))}
        </div>
      </section>

      {/* Transforming Rwanda */}
      <section className="bg-surface-light py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              title="Transforming Rwanda Through Youth Leadership"
              align="left"
            />
            <ul className="space-y-5">
              {[
                'Hands-on leadership experience through real, high-stakes responsibility.',
                'International exposure through exchanges in over 120 countries.',
                'A national community of alumni, partners, and youth working together.',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-green/15 text-accent-green">
                    <IconCheck size={14} />
                  </span>
                  <span className="text-sm leading-relaxed text-ink-heading sm:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn-blue mt-8">
              Learn Our Story
            </Link>
          </div>
          <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-xl sm:h-[420px]">
            <Image
              src="/images/hero/home-hero.png"
              alt="AIESEC in Rwanda members in a leadership training session"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-24">
        <SectionHeading eyebrow="Testimonials" title="What Our Community Says" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative overflow-hidden bg-gradient-primary py-24 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="container-page relative text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Ready to Start Your Leadership Journey?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-blue-100">
            Whether you want to volunteer abroad, partner with us, or give back as an alumnus —
            there is a place for you at AIESEC in Rwanda.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved" className="btn-primary text-base">
              Apply Now
            </Link>
            <Link href="/about" className="btn-outline-white text-base">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

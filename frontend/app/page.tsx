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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-primary text-white">
        {/* Decorative glow shapes */}
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-16 top-1/3 h-96 w-96 rounded-full bg-accent-yellow/20 blur-3xl" />

        <div className="container-page relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-yellow ring-1 ring-inset ring-white/20">
              <IconSparkles size={14} />
              Youth-Led Since 2007
            </span>
            <h1 className="mt-5 text-h1-mobile sm:text-h1">
              Develop Leaders for a <span className="text-accent-yellow">Better Rwanda</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-blue-50 sm:text-lg">
              AIESEC in Rwanda builds the next generation of leaders through international
              internships, volunteer exchanges, and hands-on leadership development — for youth,
              partners, and communities across the country.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/get-involved" className="btn-primary">
                Start Your Journey
              </Link>
              <Link href="/for-partners" className="btn-outline-white">
                Partner With Us
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/15 pt-8">
              {stats.slice(0, 3).map((stat) => (
                <div key={stat.id}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</dd>
                  <dd className="mt-1 text-xs text-blue-100 sm:text-sm">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card shadow-2xl ring-1 ring-white/20 sm:aspect-video lg:aspect-[4/5]">
              <video
                className="h-full w-full object-cover"
                src="/videos/home-hero.mp4"
                poster="/images/hero/home-hero.png"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="AIESEC in Rwanda youth volunteers and members in action"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-4 hidden max-w-[220px] items-center gap-3 rounded-card bg-white p-4 shadow-xl sm:flex sm:-left-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconGlobe size={22} />
              </span>
              <div>
                <p className="text-lg font-bold text-ink-heading">120+</p>
                <p className="text-xs leading-tight text-ink-body">Countries in our global network</p>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#pillars"
          aria-label="Scroll to explore"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-white/70 transition-colors hover:text-white lg:block"
        >
          <IconArrowDown size={22} />
        </a>
      </section>

      {/* Pillar cards */}
      <section id="pillars" className="container-page -mt-12 pb-4 sm:-mt-16">
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
      <section className="container-page py-20">
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
      <section className="bg-surface-light py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              title="Transforming Rwanda Through Youth Leadership"
              align="left"
            />
            <ul className="space-y-4">
              {[
                'Hands-on leadership experience through real, high-stakes responsibility.',
                'International exposure through exchanges in over 120 countries.',
                'A national community of alumni, partners, and youth working together.',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-green/15 text-accent-green">
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
          <div className="relative h-72 w-full overflow-hidden rounded-card shadow-lg sm:h-96">
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
      <section className="container-page py-20">
        <SectionHeading eyebrow="Testimonials" title="What Our Community Says" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative overflow-hidden bg-surface-dark py-20 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
        <div className="container-page relative text-center">
          <h2 className="mx-auto max-w-2xl text-h3 sm:text-h2">
            Ready to Start Your Leadership Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Whether you want to volunteer abroad, partner with us, or give back as an alumnus —
            there is a place for you at AIESEC in Rwanda.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved" className="btn-primary">
              Apply Now
            </Link>
            <Link href="/about" className="btn-outline-white">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

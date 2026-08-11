import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getFaqs, getPrograms } from '@/lib/api';
import SectionHeading from '@/components/SectionHeading';
import SiteImage from '@/components/SiteImage';
import FAQAccordion from '@/components/FAQAccordion';
import { IconBriefcase, IconCheck, IconGlobe, IconUsers } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'For Youth',
  description:
    'Shape your future through global experiences. Explore Incoming and Outgoing Global Volunteer programs and become an AIESECer in Rwanda.',
};

export default async function ForYouthPage() {
  const [programs, faqs] = await Promise.all([getPrograms(), getFaqs()]);
  const incoming = programs.find((p) => p.type === 'incoming');
  const outgoing = programs.find((p) => p.type === 'outgoing');
  const youthFaqs = faqs.filter((f) => f.category === 'youth' || f.category === 'general');

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-primary text-white">
        <div className="absolute inset-0 opacity-25">
          <SiteImage
            src="/images/youth/financial-literacy-workshop-2.jpg"
            alt=""
            className="h-full w-full"
            fill
            priority
          />
        </div>
        <div className="container-page relative max-w-2xl py-24">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Shape Your Future Through <span className="text-accent-yellow">Global Experiences</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-blue-50">
            Join thousands of young Rwandans who have grown their leadership through
            international volunteer, talent, and teaching exchanges.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/get-involved" className="btn-blue bg-white text-primary hover:bg-blue-50">
              Start Your Journey
            </Link>
            <Link href="#choose-your-path" className="btn-outline-white">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Choose your path */}
      <section id="choose-your-path" className="container-page py-24">
        <div className="mb-14 flex flex-col items-center text-center">
          <Image
            src="/images/youth/youth-for-good-logo.png"
            alt="Youth for Good"
            width={200}
            height={60}
            className="mb-6 h-14 w-auto object-contain"
          />
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
            Global Volunteer
          </p>
          <h2 className="text-h3 sm:text-h2 text-ink-heading">Choose Your Path</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {incoming && (
            <div className="card flex flex-col p-8">
              <Image
                src="/images/youth/global-volunteer-logo.png"
                alt="Global Volunteer"
                width={180}
                height={48}
                className="mb-6 h-10 w-auto object-contain self-start"
              />
              <h3 className="text-2xl font-bold text-ink-heading">{incoming.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">{incoming.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {incoming.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink-heading">
                    <IconCheck size={16} className="mt-0.5 shrink-0 text-accent-green" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/get-involved" className="btn mt-8 bg-accent-green text-white hover:opacity-90">
                {incoming.ctaLabel}
              </Link>
            </div>
          )}
          {outgoing && (
            <div className="card flex flex-col p-8">
              <Image
                src="/images/youth/global-volunteer-logo.png"
                alt="Global Volunteer"
                width={180}
                height={48}
                className="mb-6 h-10 w-auto object-contain self-start"
              />
              <h3 className="text-2xl font-bold text-ink-heading">{outgoing.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">{outgoing.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {outgoing.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink-heading">
                    <IconCheck size={16} className="mt-0.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/get-involved" className="btn-blue mt-8">
                {outgoing.ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Become an AIESECer */}
      <section className="bg-surface-light py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Image
              src="/images/youth/aiesec-member-logo.png"
              alt="AIESEC Member"
              width={180}
              height={48}
              className="mb-6 h-10 w-auto object-contain"
            />
            <h2 className="text-h3 sm:text-h2 text-ink-heading">Become an AIESECer</h2>
            <ul className="mt-8 space-y-5">
              {[
                { icon: <IconGlobe size={20} />, color: 'blue' as const, title: 'Global Network', desc: 'Connect with a community of young leaders across 120+ countries.' },
                { icon: <IconUsers size={20} />, color: 'green' as const, title: 'Leadership Development', desc: 'Take on real responsibility in a national team from day one.' },
                { icon: <IconBriefcase size={20} />, color: 'purple' as const, title: 'Career Opportunities', desc: 'Build practical, transferable skills valued by employers worldwide.' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      item.color === 'blue'
                        ? 'bg-primary/10 text-primary'
                        : item.color === 'green'
                          ? 'bg-accent-green/10 text-accent-green'
                          : 'bg-accent-purple/10 text-accent-purple'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-base font-bold text-ink-heading">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-body">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/get-involved" className="btn-blue mt-8">
              Join AIESEC
            </Link>
          </div>
          <div className="relative h-80 w-full overflow-hidden rounded-2xl sm:h-[420px]">
            <Image
              src="/images/youth/financial-literacy-workshop-1.jpg"
              alt="AIESEC in Rwanda members leading a Global Money Week financial literacy workshop at a university"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-24">
        <SectionHeading eyebrow="Got Questions?" title="Frequently Asked Questions" />
        <FAQAccordion faqs={youthFaqs} />
      </section>

      {/* CTA */}
      <section className="bg-gradient-youth-cta py-24 text-white">
        <div className="container-page text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl">
            Ready to Start Your Global Journey?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-blue-50">
            Applications for the next exchange cohort are open now — start yours today.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved" className="btn-primary">
              Apply Now
            </Link>
            <Link href="/contact" className="btn-outline-white">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getImpactReports, getImpactStats, getStories } from '@/lib/api';
import SectionHeading from '@/components/SectionHeading';
import SiteImage from '@/components/SiteImage';
import StatCounter from '@/components/StatCounter';
import { IconDownload, IconPlay } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Stories & Impact',
  description:
    'Read exchange diaries and leadership stories from AIESEC in Rwanda members, and explore our impact reports and statistics.',
};

const BADGE_COLORS: Record<string, 'blue' | 'green' | 'purple' | 'orange'> = {
  students_reached: 'blue',
  career_growth: 'green',
  partner_countries: 'purple',
  satisfaction: 'orange',
};

export default async function StoriesPage() {
  const [stories, reports, impactStats] = await Promise.all([
    getStories(),
    getImpactReports(),
    getImpactStats(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-surface-dark py-28 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/stories-hero.jpg"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="container-page relative max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Stories That Inspire Change</h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            Read first-hand accounts of exchanges, leadership, and impact from the AIESEC in
            Rwanda community.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="#stories" className="btn-primary">
              Read Stories
            </Link>
            <Link href="/contact" className="btn-outline-white">
              Share Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured exchange photo */}
      <section className="container-page py-16">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="/images/stories/Exchange_Photo.jpeg"
            alt="Japanese exchange students being received at Kigali Airport by AIESEC Rwanda exchange buddies"
            width={1920}
            height={1080}
            className="h-auto w-full object-contain"
            sizes="100vw"
          />
        </div>
        <p className="mt-4 text-center text-sm text-ink-body">
          Japanese exchange students arriving at Kigali International Airport, welcomed by their AIESEC in Rwanda exchange buddies.
        </p>
      </section>

      {/* Stories grid — images are portrait (1170×1463), show them fully */}
      <section id="stories" className="container-page py-24">
        <SectionHeading eyebrow="From Our Community" title="Exchange Diaries & Leadership Stories" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <article key={story.id} className="card group overflow-hidden">
              <div className="relative w-full overflow-hidden">
                {story.coverImageUrl ? (
                  <Image
                    src={story.coverImageUrl}
                    alt={story.title}
                    width={1170}
                    height={1463}
                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <SiteImage
                    alt={story.title}
                    label={story.category}
                    className="aspect-[4/5] w-full"
                  />
                )}
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {story.category}
                </p>
                <p className="mt-1 text-xs text-ink-body">
                  {new Date(story.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <h3 className="mt-3 text-lg font-bold text-ink-heading">{story.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-body">{story.excerpt}</p>
                <Link
                  href={`/stories/${story.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  Read More
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Impact reports & stats */}
      <section className="bg-surface-light py-24">
        <div className="container-page">
          <SectionHeading eyebrow="The Numbers" title="Impact Reports & Statistics" />
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {impactStats.map((stat) => (
              <StatCounter
                key={stat.id}
                value={stat.value}
                label={stat.label}
                color={BADGE_COLORS[stat.key] ?? 'blue'}
              />
            ))}
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="card p-8">
              <h3 className="mb-5 text-lg font-bold text-ink-heading">Downloadable Reports</h3>
              <ul className="space-y-4">
                {reports.map((report) => (
                  <li key={report.id} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-ink-heading">{report.title}</p>
                      <p className="mt-1 text-xs text-ink-body">{report.description}</p>
                    </div>
                    <a
                      href={report.fileUrl}
                      className="btn-outline shrink-0 gap-2 px-4 py-2 text-xs"
                      download
                    >
                      <IconDownload size={14} /> PDF
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card flex flex-col items-center justify-center gap-4 bg-surface-dark p-8 text-center">
              <p className="text-sm font-semibold text-white">
                An Exchange Participant&apos;s Reflection
              </p>
              <div className="relative aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-2xl bg-black">
                <video
                  className="h-full w-full object-cover"
                  src="/videos/exchange-story-portrait.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  aria-label="Video reflection from an exchange participant"
                />
              </div>
              <p className="flex items-center gap-1.5 text-xs text-gray-400">
                <IconPlay size={14} /> Tap play to watch
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

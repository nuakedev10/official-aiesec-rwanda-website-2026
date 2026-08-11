import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAlumni, getAlumniSuccessStories } from '@/lib/api';
import SectionHeading from '@/components/SectionHeading';
import SiteImage from '@/components/SiteImage';
import AlumniRegisterForm from '@/components/AlumniRegisterForm';
import AlumniDirectory from './AlumniDirectory';
import { IconMail, IconPhone, IconClock } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Alumni',
  description:
    'Connect with AIESEC in Rwanda alumni worldwide. Search the directory, read success stories, and register as a new alumnus.',
};

export default async function AlumniPage() {
  const [initial, successStories] = await Promise.all([
    getAlumni({ page: 1, limit: 9 }),
    getAlumniSuccessStories(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-primary text-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-h1-mobile sm:text-h1">Connect with Alumni Worldwide</h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-blue-50 sm:text-lg">
              Search a growing directory of AIESEC in Rwanda alumni, reconnect with former
              members, and find mentors across every industry.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="#directory" className="btn-primary">
                Explore Directory
              </Link>
              <Link href="#register" className="btn-outline-white">
                Register Now
              </Link>
            </div>
          </div>
          <div className="relative h-72 w-full overflow-hidden rounded-2xl sm:h-96">
            <Image
              src="/images/alumni/alumni-1.jpg"
              alt="AIESEC in Rwanda alumni reconnecting at a networking event"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section id="directory" className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Find Alumni" title="Alumni Directory" align="left" />
            <AlumniDirectory initial={initial} />
          </div>

          <aside className="space-y-8">
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-bold text-ink-heading">Featured Success Stories</h3>
              <div className="space-y-5">
                {successStories.map((story) => (
                  <div key={story.id} className="border-b border-border pb-5 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-ink-heading">{story.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-body">{story.excerpt}</p>
                    <Link href="/stories" className="mt-2 inline-block text-xs font-semibold text-primary">
                      Read Story →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="mb-4 text-lg font-bold text-ink-heading">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/alumni" className="text-primary hover:underline">
                    Mentorship Program
                  </Link>
                </li>
                <li>
                  <Link href="/alumni" className="text-primary hover:underline">
                    Networking Events
                  </Link>
                </li>
                <li>
                  <Link href="/get-involved" className="text-primary hover:underline">
                    Give Back
                  </Link>
                </li>
              </ul>
            </div>

            <div id="register" className="card p-6">
              <h3 className="mb-4 text-lg font-bold text-ink-heading">New Alumni Registration</h3>
              <AlumniRegisterForm />
            </div>

            <div className="card p-6">
              <h3 className="mb-4 text-lg font-bold text-ink-heading">Contact Alumni Relations</h3>
              <ul className="space-y-3 text-sm text-ink-body">
                <li className="flex items-center gap-2">
                  <IconMail size={16} className="text-primary" /> alumni@aiesecrwanda.org
                </li>
                <li className="flex items-center gap-2">
                  <IconPhone size={16} className="text-primary" /> +250 788 000 000
                </li>
                <li className="flex items-center gap-2">
                  <IconClock size={16} className="text-primary" /> Mon-Fri, 9am-5pm CAT
                </li>
              </ul>
              <Link href="/contact" className="btn-outline mt-4 w-full justify-center">
                Get in Touch
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

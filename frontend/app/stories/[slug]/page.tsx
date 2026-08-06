import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getStoryBySlug } from '@/lib/api';
import SiteImage from '@/components/SiteImage';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const story = await getStoryBySlug(params.slug);
  if (!story) return { title: 'Story Not Found' };
  return {
    title: story.title,
    description: story.excerpt,
    openGraph: { title: story.title, description: story.excerpt },
  };
}

export default async function StoryDetailPage({ params }: { params: { slug: string } }) {
  const story = await getStoryBySlug(params.slug);
  if (!story) notFound();

  return (
    <article className="container-page max-w-3xl py-16">
      <Link href="/stories" className="text-sm font-semibold text-primary hover:underline">
        ← Back to Stories
      </Link>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-primary">
        {story.category}
      </p>
      <h1 className="mt-2 text-h3 sm:text-h2">{story.title}</h1>
      <p className="mt-3 text-sm text-ink-body">
        By {story.authorName} &middot;{' '}
        {new Date(story.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <SiteImage
        src={story.coverImageUrl ?? undefined}
        alt={story.title}
        label={story.category}
        className="mt-8 h-64 w-full rounded-card sm:h-96"
      />
      <div className="mt-8 text-base leading-relaxed text-ink-heading">
        <p>{story.content || story.excerpt}</p>
      </div>
    </article>
  );
}

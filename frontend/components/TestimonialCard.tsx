import { IconStar } from './Icons';
import type { Testimonial } from '@/lib/types';

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="card relative flex h-full flex-col overflow-hidden p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-4 select-none font-serif text-7xl leading-none text-primary/5"
      >
        &ldquo;
      </span>
      <div className="relative mb-4 flex" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar
            key={i}
            size={18}
            className={i < testimonial.rating ? 'text-accent-yellow' : 'text-border'}
          />
        ))}
      </div>
      <blockquote className="mb-6 flex-1 text-sm leading-relaxed text-ink-heading">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          {testimonial.name.charAt(0)}
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink-heading">{testimonial.name}</span>
          <span className="block text-xs text-ink-body">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

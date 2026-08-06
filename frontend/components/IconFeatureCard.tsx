import Link from 'next/link';
import IconBadge, { type BadgeColor } from './IconBadge';
import { IconArrowRight } from './Icons';

export default function IconFeatureCard({
  icon,
  color,
  title,
  description,
  linkHref,
  linkLabel,
}: {
  icon: React.ReactNode;
  color: BadgeColor;
  title: string;
  description: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  const linkColor =
    color === 'blue'
      ? 'text-primary'
      : color === 'green'
        ? 'text-accent-green'
        : color === 'purple'
          ? 'text-accent-purple'
          : 'text-accent-orange';

  return (
    <div className="card group flex h-full flex-col p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <IconBadge color={color} size={56} className="transition-transform duration-200 group-hover:scale-110">
        {icon}
      </IconBadge>
      <h3 className="mt-5 text-xl font-bold text-ink-heading">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-body">{description}</p>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${linkColor}`}
        >
          {linkLabel}
          <IconArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

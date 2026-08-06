import Image from 'next/image';

/**
 * Renders a photo from /public/images when `src` is provided (drop real
 * photography in there later, matching the descriptive filename in
 * `src`, with zero code changes). Falls back to a labeled gradient
 * placeholder so every section still has believable visual weight before
 * real photography exists.
 */
export default function SiteImage({
  src,
  alt,
  label,
  className = '',
  fill = true,
  priority = false,
  fit = 'cover',
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  fit?: 'cover' | 'contain';
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          className={fit === 'contain' ? 'object-contain' : 'object-cover'}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-accent-purple/10 to-accent-orange/20 ${className}`}
      role="img"
      aria-label={alt}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_60%)]" />
      {label && (
        <span className="relative rounded-card bg-white/70 px-4 py-2 text-xs font-medium text-ink-body">
          {label}
        </span>
      )}
    </div>
  );
}

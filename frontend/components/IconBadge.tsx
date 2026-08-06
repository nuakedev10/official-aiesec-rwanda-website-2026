export type BadgeColor = 'blue' | 'green' | 'purple' | 'orange';

const COLOR_CLASSES: Record<BadgeColor, string> = {
  blue: 'bg-primary/15 text-primary',
  green: 'bg-accent-green/15 text-accent-green',
  purple: 'bg-accent-purple/15 text-accent-purple',
  orange: 'bg-accent-orange/15 text-accent-orange',
};

export default function IconBadge({
  color,
  children,
  size = 48,
  className = '',
}: {
  color: BadgeColor;
  children: React.ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full ${COLOR_CLASSES[color]} ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

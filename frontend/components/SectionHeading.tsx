export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  light?: boolean;
}) {
  return (
    <div className={`mb-12 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
      {eyebrow && (
        <p
          className={`mb-2 text-sm font-semibold uppercase tracking-wide ${
            light ? 'text-blue-300' : 'text-primary'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`text-h3 sm:text-h2 ${light ? 'text-white' : 'text-ink-heading'}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? 'text-gray-300' : 'text-ink-body'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

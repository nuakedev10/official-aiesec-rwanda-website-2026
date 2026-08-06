'use client';

import { useEffect, useRef, useState } from 'react';
import IconBadge, { type BadgeColor } from './IconBadge';

const TEXT_COLOR: Record<BadgeColor, string> = {
  blue: 'text-primary',
  green: 'text-accent-green',
  purple: 'text-accent-purple',
  orange: 'text-accent-orange',
};

function parseValue(value: string) {
  const match = value.match(/[\d,.]+/);
  const numeric = match ? parseFloat(match[0].replace(/,/g, '')) : null;
  const prefix = match ? value.slice(0, match.index) : '';
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : value;
  return { numeric, prefix, suffix };
}

export default function StatCounter({
  value,
  label,
  color,
  icon,
}: {
  value: string;
  label: string;
  color: BadgeColor;
  icon?: React.ReactNode;
}) {
  const { numeric, prefix, suffix } = parseValue(value);
  const [display, setDisplay] = useState(numeric === null ? value : '0');
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (numeric === null) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(numeric * eased);
            setDisplay(current.toLocaleString());
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [numeric]);

  return (
    <div ref={ref} className="group text-center">
      {icon && (
        <IconBadge color={color} size={48} className="mx-auto mb-3 transition-transform duration-200 group-hover:scale-110">
          {icon}
        </IconBadge>
      )}
      <p className={`text-4xl font-bold sm:text-5xl ${TEXT_COLOR[color]}`}>
        {prefix}
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-ink-body sm:text-base">{label}</p>
    </div>
  );
}

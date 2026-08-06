type IconProps = { size?: number; className?: string };

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': true as const,
});

export const IconUsers = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M8 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M2.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M15 7.5A3 3 0 1 1 15 13.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14.5 14.3c2.4.3 4.2 2.1 4.8 4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconHandshake = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M2 11l4-3 4 3-3 4-5-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10 8l4-3 4 3-3.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M6 12l3.5 3.5a2 2 0 0 0 3 0l.5-.5 1 1a1.6 1.6 0 0 0 2.3-2.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconGlobe = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 12h18M12 3c2.5 2.6 4 5.7 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.7-4-9s1.5-6.4 4-9Z" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconTarget = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>
);

export const IconEye = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconHeart = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path
      d="M12 20s-7.5-4.6-9.8-9.2C.8 7.4 2.4 4 6 4c2 0 3.4 1.1 4.2 2.2A5 5 0 0 1 12 6.2 5 5 0 0 1 13.8 6.2C14.6 5.1 16 4 18 4c3.6 0 5.2 3.4 3.8 6.8C19.5 15.4 12 20 12 20Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconCheck = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconArrowRight = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12h16M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconStar = ({ size, className, filled = true }: IconProps & { filled?: boolean }) => (
  <svg {...base(size)} className={className} fill={filled ? 'currentColor' : 'none'}>
    <path
      d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconMail = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 6.5 12 13l9-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPhone = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path
      d="M6.6 3.5 9 5.9c.5.5.6 1.3.2 1.9L8 9.7a12.4 12.4 0 0 0 6.3 6.3l1.9-1.2c.6-.4 1.4-.3 1.9.2l2.4 2.4c.6.6.6 1.6-.1 2.1l-1.8 1.4c-.7.5-1.6.7-2.4.4-4-1.3-8.6-5.9-9.9-9.9-.3-.8-.1-1.7.4-2.4l1.4-1.8c.5-.7 1.5-.7 2.1-.1Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconLocation = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path
      d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconClock = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPlay = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className} fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
    <path d="M10 8.5v7l6-3.5-6-3.5Z" />
  </svg>
);

export const IconDownload = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconSearch = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconBriefcase = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconChevronDown = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconTrendUp = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 17l6-6 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconGraduationCap = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M2 9l10-4.5L22 9l-10 4.5L2 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M6 11.5V17c0 1.4 2.7 3 6 3s6-1.6 6-3v-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 9v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconSparkles = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className} fill="currentColor">
    <path d="M11 2.5c.3 2.7 1 4.4 2.1 5.4 1.1 1 2.8 1.7 5.4 2.1-2.7.3-4.4 1-5.4 2.1-1 1.1-1.7 2.8-2.1 5.4-.3-2.7-1-4.4-2.1-5.4-1.1-1-2.8-1.7-5.4-2.1 2.7-.3 4.4-1 5.4-2.1 1-1.1 1.7-2.8 2.1-5.4Z" />
    <path d="M19 15.5c.2 1.3.5 2.2 1.1 2.8.6.6 1.5.9 2.8 1.1-1.3.2-2.2.5-2.8 1.1-.6.6-.9 1.5-1.1 2.8-.2-1.3-.5-2.2-1.1-2.8-.6-.6-1.5-.9-2.8-1.1 1.3-.2 2.2-.5 2.8-1.1.6-.6.9-1.5 1.1-2.8Z" opacity="0.7" />
  </svg>
);

export const IconArrowDown = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 4v16m0 0 6-6m-6 6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

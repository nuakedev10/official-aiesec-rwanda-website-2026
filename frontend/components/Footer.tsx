import Image from 'next/image';
import Link from 'next/link';

const FOR_YOUTH = [
  { label: 'Global Volunteer', href: '/for-youth' },
  { label: 'Global Talent', href: '/for-youth' },
  { label: 'Global Teacher', href: '/for-youth' },
  { label: 'Membership', href: '/get-involved' },
];

const FOR_PARTNERS = [
  { label: 'Partnership Opportunities', href: '/for-partners' },
  { label: 'Case Studies', href: '/for-partners' },
  { label: 'Talent Access', href: '/for-partners' },
  { label: 'Contact Us', href: '/contact' },
];

const ALUMNI = [
  { label: 'Alumni Directory', href: '/alumni' },
  { label: 'Success Stories', href: '/stories' },
  { label: 'Mentorship', href: '/alumni' },
  { label: 'Networking Events', href: '/alumni' },
];

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com/aiesecrwanda' },
  { label: 'Twitter / X', href: 'https://x.com/aiesecrwanda' },
  { label: 'Instagram', href: 'https://instagram.com/aiesecrwanda' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/aiesecrwanda' },
];

function SocialIcon({ label }: { label: string }) {
  const paths: Record<string, JSX.Element> = {
    Facebook: <path d="M13 22v-8h2.6l.4-3H13V9.1c0-.87.24-1.46 1.5-1.46H16V5.14C15.6 5.1 14.9 5 14 5c-2 0-3.4 1.22-3.4 3.46V11H8v3h2.6v8H13z" />,
    'Twitter / X': <path d="M4 4l8 10.2L4.4 20H6.9l6.1-6.6L17.4 20H20l-8.4-10.7L19.6 4H17l-5.6 6L7.6 4H4z" />,
    Instagram: <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8zm4 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm4.5-3.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />,
    LinkedIn: <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3 8.48h3.88V21H3zM10.34 8.48H14v1.7h.05c.5-.95 1.75-1.95 3.6-1.95 3.85 0 4.56 2.53 4.56 5.83V21h-3.88v-6.13c0-1.46-.03-3.34-2.04-3.34-2.04 0-2.35 1.6-2.35 3.24V21h-3.88z" />,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {paths[label]}
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-dark text-gray-300">
      <div className="container-page grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-card">
              <Image src="/images/logo.jpg" alt="" fill sizes="36px" className="object-cover" />
            </span>
            <span className="text-lg font-bold text-white">AIESEC Rwanda</span>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-gray-400">
            Developing leadership in young people through international internships, volunteer
            exchanges, and leadership programs across Rwanda.
          </p>
          <ul className="flex gap-3">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors hover:bg-primary hover:text-white"
                >
                  <SocialIcon label={social.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="For Youth" links={FOR_YOUTH} />
        <FooterColumn title="For Partners" links={FOR_PARTNERS} />
        <FooterColumn title="Alumni" links={ALUMNI} />
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-gray-400 sm:flex-row">
          <p>&copy; {year} AIESEC in Rwanda. All rights reserved.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
            <li>
              <a
                href="https://aiesec.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                AIESEC International
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-gray-400 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

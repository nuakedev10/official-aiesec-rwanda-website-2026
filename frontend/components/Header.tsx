'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string; description: string }[];
}

const NAV_LINKS: NavItem[] = [
  { href: '/', label: 'Home' },
  {
    href: '/about',
    label: 'About',
    children: [
      { href: '/about', label: 'Our Story', description: 'Learn about AIESEC in Rwanda\'s mission and history' },
      { href: '/about#team', label: 'Our Team', description: 'Meet the people behind AIESEC in Rwanda' },
      { href: '/contact', label: 'Contact Us', description: 'Get in touch with our team' },
    ],
  },
  {
    href: '/for-youth',
    label: 'For Youth',
    children: [
      { href: '/for-youth', label: 'Programs Overview', description: 'Explore all youth exchange programs' },
      { href: '/for-youth#choose-your-path', label: 'Global Volunteer', description: 'Incoming and outgoing volunteer exchanges' },
      { href: '/get-involved', label: 'Become a Member', description: 'Join AIESEC in Rwanda as a member' },
    ],
  },
  {
    href: '/for-partners',
    label: 'For Partners',
    children: [
      { href: '/for-partners', label: 'Partnership Opportunities', description: 'Explore how to partner with us' },
      { href: '/for-partners#get-in-touch', label: 'Get in Touch', description: 'Contact our partnerships team' },
    ],
  },
  {
    href: '/alumni',
    label: 'Alumni',
    children: [
      { href: '/alumni', label: 'Alumni Directory', description: 'Connect with fellow AIESEC alumni' },
      { href: '/stories', label: 'Success Stories', description: 'Read stories from our community' },
    ],
  },
  { href: '/stories', label: 'Stories' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setExpandedMobile(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white transition-shadow duration-200 ${
        scrolled ? 'border-border shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="AIESEC in Rwanda home">
          <Image
            src="/images/aiesec-blue-logo.png"
            alt="AIESEC"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary/8 text-primary'
                        : 'text-ink-heading hover:bg-surface-light hover:text-primary'
                    }`}
                  >
                    {link.label}
                    {link.children && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-0.5 transition-transform group-hover:rotate-180" aria-hidden>
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </Link>

                  {link.children && (
                    <div className="pointer-events-none invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                      <div className="w-72 rounded-xl border border-border bg-white p-2 shadow-lg">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-light"
                          >
                            <span className="block text-sm font-medium text-ink-heading">{child.label}</span>
                            <span className="mt-0.5 block text-xs text-ink-body">{child.description}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/get-involved" className="btn-blue hidden sm:inline-flex">
            Join Us
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-heading transition-colors hover:bg-surface-light lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-b bg-white transition-[max-height] duration-300 lg:hidden ${
          open ? 'max-h-[36rem] border-border' : 'max-h-0 border-transparent'
        }`}
      >
        <nav aria-label="Mobile navigation" className="container-page flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <div key={link.href}>
              {link.children ? (
                <>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-primary/8 text-primary'
                        : 'text-ink-heading hover:bg-surface-light'
                    }`}
                    onClick={() => setExpandedMobile(expandedMobile === link.href ? null : link.href)}
                  >
                    {link.label}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      className={`transition-transform ${expandedMobile === link.href ? 'rotate-180' : ''}`}
                      aria-hidden
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-200 ${
                      expandedMobile === link.href ? 'max-h-60' : 'max-h-0'
                    }`}
                  >
                    <div className="ml-3 border-l border-border pl-3">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm text-ink-body transition-colors hover:bg-surface-light hover:text-ink-heading"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-primary/8 text-primary'
                      : 'text-ink-heading hover:bg-surface-light'
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          <Link href="/get-involved" className="btn-blue mt-2 justify-center">
            Join Us
          </Link>
        </nav>
      </div>
    </header>
  );
}

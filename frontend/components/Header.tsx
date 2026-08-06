'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/for-youth', label: 'For Youth' },
  { href: '/for-partners', label: 'For Partners' },
  { href: '/alumni', label: 'Alumni' },
  { href: '/stories', label: 'Stories' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[#F3F4F6] bg-white">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="AIESEC in Rwanda home">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-card">
            <Image src="/images/logo.jpg" alt="" fill sizes="36px" className="object-cover" priority />
          </span>
          <span className="text-lg font-bold tracking-tight text-primary">AIESEC RWANDA</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      active ? 'text-primary' : 'text-ink-heading'
                    }`}
                  >
                    {link.label}
                  </Link>
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
            className="flex h-10 w-10 items-center justify-center rounded-card lg:hidden"
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

      <div
        id="mobile-nav"
        className={`overflow-hidden border-b border-[#F3F4F6] bg-white transition-[max-height] duration-300 lg:hidden ${
          open ? 'max-h-[28rem]' : 'max-h-0'
        }`}
      >
        <nav aria-label="Mobile navigation" className="container-page flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-card px-3 py-2.5 text-sm font-medium ${
                pathname === link.href ? 'bg-surface-light text-primary' : 'text-ink-heading'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/get-involved" className="btn-blue mt-2 justify-center">
            Join Us
          </Link>
        </nav>
      </div>
    </header>
  );
}

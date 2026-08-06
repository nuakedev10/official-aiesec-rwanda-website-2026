'use client';

import { useState } from 'react';
import { IconChevronDown } from './Icons';
import type { FAQ } from '@/lib/types';

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-card border border-border bg-white">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${faq.id}`}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
              >
                <span className="text-base font-semibold text-ink-heading">{faq.question}</span>
                <IconChevronDown
                  size={20}
                  className={`shrink-0 text-ink-body transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${faq.id}`}
              role="region"
              className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-ink-body">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

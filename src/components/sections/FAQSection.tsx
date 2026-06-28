import { useState } from 'react';
import type { FAQ } from '../../types';
import { getContactUrl } from '../../lib/utils';

interface Props {
  items: FAQ[];
  limit?: number;
}

export default function FAQSection({ items, limit }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const displayItems = limit ? items.slice(0, limit) : items;

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="mx-auto max-w-4xl">
        <div className="mobile-swipe-cards grid grid-cols-1 items-start gap-3 md:grid-cols-2">
          {displayItems.map((item) => {
            const id = item.question;
            const isOpen = openId === id;
            return (
              <div
                key={id}
                className={`self-start rounded-xl border bg-white transition-shadow ${
                  isOpen ? 'border-zinc-300 shadow-md' : 'border-zinc-200 shadow-sm hover:border-zinc-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left sm:p-5"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium leading-snug text-zinc-900">{item.question}</span>
                  <svg
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-zinc-700' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen ? (
                  <p className="border-t border-zinc-100 px-4 pb-4 text-sm leading-relaxed text-zinc-600 sm:px-5 sm:pb-5">
                    {item.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <a
            href={getContactUrl({ message: 'I have a question:\n\n', intent: 'general' })}
            className="group flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-violet-300/80 bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-4 py-4 text-left shadow-sm transition hover:border-violet-400 hover:shadow-md sm:px-5 sm:py-5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-lg text-white shadow-sm transition group-hover:bg-violet-700">
              ?
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-base font-bold text-zinc-900 sm:text-lg">Ask your own question</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500 sm:text-sm">
                Opens the contact form below — we usually reply within one business day.
              </span>
            </span>
            <span className="hidden shrink-0 text-sm font-semibold text-violet-700 sm:inline-flex sm:items-center sm:gap-1">
              Go to form
              <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
            </span>
          </a>
        </div>
    </div>
  );
}

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
    <section id="faq" className="bg-zinc-50 section-padding">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">FAQ</p>
          <h2 className="section-title mt-2">Good to know</h2>
          <p className="section-subtitle mx-auto mt-2">Plain answers — tap a card to read one at a time.</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 items-start gap-2.5 sm:grid-cols-2 sm:gap-3">
          {displayItems.map((item) => {
            const id = item.question;
            const isOpen = openId === id;
            return (
              <div
                key={id}
                className={`self-start rounded-xl border bg-white transition-shadow ${
                  isOpen ? 'border-violet-200 shadow-md ring-1 ring-violet-100' : 'border-zinc-200 shadow-sm hover:border-zinc-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="flex w-full items-start justify-between gap-2 p-3.5 text-left sm:p-4"
                  aria-expanded={isOpen}
                >
                  <span className="text-[13px] font-semibold leading-snug text-zinc-900 sm:text-sm">{item.question}</span>
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
                      isOpen ? 'rotate-45 bg-violet-600 text-white' : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen ? (
                  <p className="border-t border-violet-50 px-3.5 pb-3.5 text-[13px] leading-relaxed text-zinc-600 sm:px-4 sm:pb-4">
                    {item.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
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
    </section>
  );
}

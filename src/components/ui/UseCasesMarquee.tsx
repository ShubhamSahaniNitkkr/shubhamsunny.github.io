import { useState } from 'react';
import type { UseCase } from '../../types';
import UseCaseModal from './UseCaseModal';

const CATEGORY_COLOR: Record<string, string> = {
  'Data Scraping': 'bg-emerald-100 text-emerald-700',
  'Web Modernization': 'bg-violet-100 text-violet-700',
  'Custom Software': 'bg-orange-100 text-orange-700',
};

interface Props {
  items: UseCase[];
}

function CardImage({ src, alt, fallback, category }: { src: string; alt: string; fallback?: string; category: string }) {
  const [errCount, setErrCount] = useState(0);
  const categoryBg: Record<string, string> = {
    'Data Scraping': 'bg-gradient-to-br from-emerald-500 to-emerald-800',
    'Web Modernization': 'bg-gradient-to-br from-violet-500 to-violet-800',
    'Custom Software': 'bg-gradient-to-br from-orange-500 to-orange-800',
  };
  const urls = [src, fallback].filter(Boolean) as string[];
  const url = urls[errCount] || '';

  if (!url) {
    return (
      <div className={`flex h-full items-center justify-center ${categoryBg[category] || 'bg-zinc-600'}`}>
        <span className="px-4 text-center text-xs font-semibold text-white/90">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      className="h-full w-full object-cover"
      loading="lazy"
      width="360"
      height="175"
      decoding="async"
      onError={() => setErrCount((c) => c + 1)}
    />
  );
}

export default function UseCasesMarquee({ items }: Props) {
  const [active, setActive] = useState<UseCase | null>(null);

  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <>
      <div className="usecases-marquee w-full overflow-hidden pb-2">
        <div className="usecases-marquee-track flex w-max flex-nowrap items-stretch gap-4 px-4 sm:gap-5 sm:px-6">
          {doubled.map((item, i) => {
            const catColor = CATEGORY_COLOR[item.category] || 'bg-zinc-100 text-zinc-700';
            return (
              <button
                key={`${item.id}-${i}`}
                type="button"
                onClick={() => setActive(item)}
                className="flex w-[min(88vw,320px)] shrink-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:border-violet-300 hover:shadow-lg sm:w-[340px]"
              >
                <div className="relative h-[150px] w-full shrink-0 overflow-hidden bg-zinc-100 sm:h-[165px]">
                  <CardImage
                    src={item.image ? `${item.image.split('?')[0]}?auto=format&fit=crop&w=720&h=400&q=80` : item.thumbnail}
                    alt={item.title}
                    fallback={item.thumbnail !== item.image ? item.thumbnail : undefined}
                    category={item.category}
                  />
                  {item.metric && (
                    <span className="absolute bottom-3 left-3 rounded-lg bg-zinc-900/80 px-2.5 py-1 text-[10px] font-bold text-white shadow-md backdrop-blur-sm">
                      {item.metric}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                  <span className={`w-fit rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${catColor}`}>
                    {item.category}
                  </span>
                  <p className="font-display text-base font-bold leading-snug text-zinc-900 sm:text-[17px]">{item.title}</p>
                  {item.client && (
                    <p className="text-[11px] font-medium text-zinc-400">{item.client}</p>
                  )}
                  {item.cardTeaser && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600">{item.cardTeaser}</p>
                  )}
                  <span className="mt-auto text-xs font-semibold text-violet-600">Read full case study →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {active && <UseCaseModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}

import { useState } from 'react';
import type { UseCase } from '../../types';
import UseCaseModal from './UseCaseModal';
import { expandMarqueeItems } from '../../lib/marquee';

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

function UseCaseCard({
  item,
  onSelect,
  onActivate,
}: {
  item: UseCase;
  onSelect: (item: UseCase) => void;
  onActivate?: () => void;
}) {
  const catColor = CATEGORY_COLOR[item.category] || 'bg-zinc-100 text-zinc-700';
  return (
    <button
      type="button"
      data-use-case-id={item.id}
      onPointerDown={() => onActivate?.()}
      onClick={() => onSelect(item)}
      className="usecase-card flex w-[min(88vw,320px)] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:border-violet-300 hover:shadow-lg sm:w-[340px]"
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
}

export default function UseCasesMarquee({ items }: Props) {
  const [active, setActive] = useState<UseCase | null>(null);
  const [marqueePaused, setMarqueePaused] = useState(false);

  if (!items.length) return null;
  const groupItems = expandMarqueeItems(items);
  const pauseMarquee = () => setMarqueePaused(true);
  const resumeMarquee = () => setMarqueePaused(false);

  return (
    <>
      <div className="usecases-swipe pb-2 sm:hidden">
        <div className="usecases-swipe-track flex w-max flex-nowrap items-stretch gap-4">
          {items.map((item) => (
            <UseCaseCard key={item.id} item={item} onSelect={setActive} />
          ))}
        </div>
      </div>
      <div
        className={`usecases-marquee hidden w-full overflow-hidden pb-2 sm:block${marqueePaused || active ? ' is-paused' : ''}`}
        onPointerEnter={pauseMarquee}
        onPointerLeave={resumeMarquee}
        onFocusCapture={pauseMarquee}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resumeMarquee();
        }}
      >
        <div className="usecases-marquee-track flex w-max flex-nowrap items-stretch px-4 sm:px-6">
          <div className="marquee-group">
            {groupItems.map((item, i) => (
              <UseCaseCard key={`a-${item.id}-${i}`} item={item} onSelect={setActive} onActivate={pauseMarquee} />
            ))}
          </div>
          <div className="marquee-group pointer-events-none" aria-hidden="true">
            {groupItems.map((item, i) => (
              <UseCaseCard key={`b-${item.id}-${i}`} item={item} onSelect={setActive} onActivate={pauseMarquee} />
            ))}
          </div>
        </div>
      </div>
      {active && <UseCaseModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}

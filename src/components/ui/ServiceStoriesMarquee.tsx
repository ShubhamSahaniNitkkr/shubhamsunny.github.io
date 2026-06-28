import type { UseCase } from '../../types';
import { expandMarqueeItems } from '../../lib/marquee';

const CARD_GRADIENTS = [
  'from-violet-600 via-violet-700 to-violet-900',
  'from-blue-600 via-blue-700 to-blue-900',
  'from-emerald-600 via-emerald-700 to-emerald-900',
  'from-orange-600 via-orange-700 to-orange-900',
  'from-slate-600 via-slate-700 to-slate-900',
];

interface Props {
  stories: UseCase[];
}

function StoryCard({ item, index }: { item: UseCase; index: number }) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const img = item.image || item.thumbnail;
  return (
    <article
      className={`relative flex w-[min(88vw,340px)] shrink-0 flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} shadow-lg sm:w-[340px]`}
    >
      {img && (
        <div className="relative h-28 w-full shrink-0">
          <img src={img} alt="" className="h-full w-full object-cover opacity-40" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        {item.metric && (
          <span className="mb-2 w-fit rounded-lg bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            {item.metric}
          </span>
        )}
        <h3 className="font-display text-base font-bold leading-snug text-white sm:text-lg">{item.title}</h3>
        {item.client && <p className="mt-1 text-[11px] text-white/70">{item.client}</p>}
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-white/90">
          {item.cardTeaser || item.summary}
        </p>
      </div>
    </article>
  );
}

function StoryGroup({
  stories,
  groupKey,
  sourceLength,
  ariaHidden = false,
}: {
  stories: UseCase[];
  groupKey: string;
  sourceLength: number;
  ariaHidden?: boolean;
}) {
  return (
    <div className="marquee-group" aria-hidden={ariaHidden || undefined}>
      {stories.map((item, i) => (
        <StoryCard key={`${groupKey}-${item.id}-${i}`} item={item} index={i % sourceLength} />
      ))}
    </div>
  );
}

export default function ServiceStoriesMarquee({ stories }: Props) {
  if (!stories.length) return null;
  const groupItems = expandMarqueeItems(stories);

  return (
    <div className="service-stories-marquee overflow-hidden pb-2">
      <div className="service-stories-marquee-track flex w-max px-1">
        <StoryGroup stories={groupItems} groupKey="a" sourceLength={stories.length} />
        <StoryGroup stories={groupItems} groupKey="b" sourceLength={stories.length} ariaHidden />
      </div>
    </div>
  );
}

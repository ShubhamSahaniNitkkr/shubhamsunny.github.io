import type { Transformation } from '../../types';
import { getCloudinaryUrl } from '../../lib/utils';

interface Props {
  items: Transformation[];
}

export default function BeforeAfterMarquee({ items }: Props) {
  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <div className="ba-marquee overflow-hidden">
      <div className="ba-marquee-track flex w-max gap-4">
        {doubled.map((item, i) => (
          <article key={`${item.id}-${i}`} className="w-[300px] shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm sm:w-[340px]">
            <div className="grid grid-cols-2">
              <div className="relative aspect-[4/3]">
                <img src={getCloudinaryUrl(item.before, 340, 255)} alt={`${item.clientName} before`} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute bottom-1.5 left-1.5 rounded bg-zinc-800/80 px-2 py-0.5 text-[9px] font-bold uppercase text-white">Before</span>
              </div>
              <div className="relative aspect-[4/3]">
                <img src={getCloudinaryUrl(item.after, 340, 255)} alt={`${item.clientName} after`} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute bottom-1.5 left-1.5 rounded bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase text-white">After</span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-zinc-900">{item.clientName}</p>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{item.story}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

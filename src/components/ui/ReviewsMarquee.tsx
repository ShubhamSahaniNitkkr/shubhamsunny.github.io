import testimonials from '../../data/testimonials.json';
import type { Testimonial } from '../../types';

const items = (testimonials as Testimonial[]).filter(
  (t) => t.type !== 'video' && t.featured && t.rating >= 5,
);
const doubled = [...items, ...items];

const COUNTRY_FLAG: Record<string, string> = {
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  Japan: '🇯🇵',
  Bangladesh: '🇧🇩',
  Canada: '🇨🇦',
  India: '🇮🇳',
  Jordan: '🇯🇴',
  Luxembourg: '🇱🇺',
  Australia: '🇦🇺',
  Germany: '🇩🇪',
  France: '🇫🇷',
  UAE: '🇦🇪',
};

const CARD_GRADIENTS = [
  'from-violet-600 via-violet-700 to-violet-900',
  'from-blue-600 via-blue-700 to-blue-900',
  'from-orange-600 via-orange-700 to-orange-900',
  'from-emerald-600 via-emerald-700 to-emerald-900',
  'from-rose-600 via-rose-700 to-rose-900',
  'from-indigo-600 via-indigo-700 to-indigo-900',
  'from-teal-600 via-teal-700 to-teal-900',
  'from-amber-600 via-amber-700 to-amber-900',
];

function initials(name: string) {
  const parts = name.replace(/\./g, '').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className={`h-3 w-3 ${i < rating ? 'text-amber-300' : 'text-white/25'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[10px] font-semibold text-white/70">{rating}.0</span>
    </div>
  );
}

export default function ReviewsMarquee() {
  if (!items.length) return null;

  return (
    <div className="reviews-marquee overflow-hidden pb-2">
      <div className="reviews-marquee-track flex w-max gap-4 px-4 sm:gap-5 sm:px-6">
        {doubled.map((item, i) => {
          const origIndex = i % items.length;
          const flag = item.country ? COUNTRY_FLAG[item.country] || '🌍' : '';
          const gradient = CARD_GRADIENTS[origIndex % CARD_GRADIENTS.length];

          return (
            <article
              key={`${item.id}-${i}`}
              className={`relative flex w-[min(88vw,340px)] shrink-0 flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 shadow-lg sm:w-[340px]`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" aria-hidden="true" />

              <div className="relative flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white ring-2 ring-white/30 backdrop-blur-sm">
                  {initials(item.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <p className="text-[11px] text-white/70">
                    {flag} {item.country}
                    {item.date && <span className="text-white/40"> · </span>}
                    {item.date}
                  </p>
                  <Stars rating={item.rating} />
                </div>
              </div>

              {item.projectType && (
                <span className="relative mt-3 inline-flex w-fit rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
                  {item.projectType}
                </span>
              )}

              <p className="relative mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-white/90">&ldquo;{item.text}&rdquo;</p>

              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/90 transition hover:text-white"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-emerald-600">f</span>
                  Verified on Fiverr
                </a>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

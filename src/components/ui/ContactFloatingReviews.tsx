import { useMemo } from 'react';
import testimonials from '../../data/testimonials.json';
import type { Testimonial } from '../../types';

const featured = (testimonials as Testimonial[]).filter((t) => t.featured && t.rating >= 5).slice(0, 6);

const POSITIONS = [
  { top: '8%', left: '4%', rotate: '-4deg', delay: '0s' },
  { top: '18%', right: '6%', rotate: '3deg', delay: '1.2s' },
  { top: '42%', left: '2%', rotate: '2deg', delay: '2.4s' },
  { top: '55%', right: '4%', rotate: '-3deg', delay: '0.8s' },
  { top: '72%', left: '8%', rotate: '-2deg', delay: '1.8s' },
  { top: '78%', right: '10%', rotate: '4deg', delay: '2.8s' },
];

export default function ContactFloatingReviews() {
  const cards = useMemo(() => {
    if (!featured.length) return [];
    return POSITIONS.map((pos, i) => ({
      ...pos,
      review: featured[i % featured.length],
    }));
  }, []);

  if (!cards.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden md:block" aria-hidden="true">
      {cards.map(({ review, top, left, right, rotate, delay }, i) => (
        <div
          key={`${review.id}-${i}`}
          className="contact-float-review absolute max-w-[200px] rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 shadow-lg backdrop-blur-md lg:max-w-[220px]"
          style={{
            top,
            left,
            right,
            transform: `rotate(${rotate})`,
            animationDelay: delay,
          }}
        >
          <p className="text-[10px] font-bold text-white/90">{review.name}</p>
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-white/75">&ldquo;{review.text}&rdquo;</p>
          <p className="mt-1 text-[9px] text-amber-300/90">★ {review.rating}.0 · Fiverr</p>
        </div>
      ))}
    </div>
  );
}

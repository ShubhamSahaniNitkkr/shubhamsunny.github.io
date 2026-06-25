import testimonials from '../../data/testimonials.json';
import type { Testimonial } from '../../types';

const items = testimonials as Testimonial[];
const doubled = [...items, ...items];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-rose-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'opacity-100' : 'opacity-25'}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsMarquee() {
  if (!items.length) return null;

  return (
    <div className="reviews-marquee overflow-hidden">
      <div className="reviews-marquee-track flex w-max gap-4 sm:gap-5">
        {doubled.map((item, i) => (
          <article
            key={`${item.id}-${i}`}
            className="reviews-marquee-card salon-card flex w-[280px] shrink-0 gap-4 p-4 sm:w-[320px] sm:p-5"
          >
            <div className="min-w-0 flex-1">
              <Stars rating={item.rating} />
              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-charcoal">{item.text}</p>
              <p className="mt-3 text-[10px] font-semibold tracking-widest text-muted uppercase">
                {item.name}
                {item.country ? ` · ${item.country}` : ''}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

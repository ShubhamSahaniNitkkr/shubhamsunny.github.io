import type { ServiceHubItem } from '../../types';

const CARD_DETAIL: Record<string, string> = {
  'web-modernization': 'Mobile-first rebuild with hosting, forms, and launch handled — you approve, we ship.',
  'data-scraping': 'Prices, listings, and catalogs scraped on schedule into CSV, JSON, or your database.',
  'custom-software': 'Web apps, mobile apps, and bots built for your workflow — deployed with full handoff.',
};

const CARD_THEME: Record<string, { accent: string; image: string }> = {
  'web-modernization': {
    accent: 'from-violet-600/90 to-violet-900/90',
    image: '/media/transformations/transform-1/after.jpg',
  },
  'data-scraping': {
    accent: 'from-emerald-600/90 to-emerald-900/90',
    image: '/media/portfolio/massive-data-explorer/cover.jpg',
  },
  'custom-software': {
    accent: 'from-orange-600/90 to-orange-900/90',
    image: '/media/portfolio/sdui/cover.jpg',
  },
};

interface Props {
  services: ServiceHubItem[];
}

export default function ServicesPreview({ services }: Props) {
  if (!services.length) return null;

  return (
    <section id="services" className="bg-white section-padding">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-10">
          <p className="section-eyebrow">What we do</p>
          <h2 className="section-title mt-2">Services</h2>
          <p className="section-subtitle mx-auto mt-2">Tap a service to see process, packages, and proof.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {services.map((svc) => {
            const theme = CARD_THEME[svc.id] || CARD_THEME['web-modernization'];
            const img = svc.cardImage || theme.image;
            return (
              <a
                key={svc.id}
                href={`/services/${svc.id}`}
                className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border border-zinc-200 shadow-md transition hover:-translate-y-1 hover:shadow-xl sm:min-h-[280px]"
              >
                <img
                  src={img}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  width="800"
                  height="480"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${theme.accent} via-black/60 to-black/30`} />
                <div className="relative z-10 p-5 sm:p-6">
                  <p className="font-display text-xl font-bold !text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.8)] sm:text-2xl">{svc.name}</p>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/95 [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
                    {CARD_DETAIL[svc.id] || svc.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)] transition group-hover:gap-2">
                    See how we do it <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

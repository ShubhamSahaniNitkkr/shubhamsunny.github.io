import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  ServiceHubItem,
  ServiceBlock,
  ServicePackage,
  UseCase,
  ClientProject,
} from '../../types';
import ServiceStoriesMarquee from '../ui/ServiceStoriesMarquee';
import { getPackageEmailUrl, formatPrice, getContactUrl } from '../../lib/utils';

interface Props {
  service: ServiceHubItem;
  blocks: ServiceBlock[];
  packages: ServicePackage[];
  stories: UseCase[];
  projects: ClientProject[];
}

const THEME: Record<string, { accent: string; light: string; overlay: string; fallbackProcess: string[] }> = {
  'web-modernization': {
    accent: '#7856FF',
    light: '#F4F0FF',
    overlay: 'from-violet-600/90 via-violet-800/80 to-violet-950/95',
    fallbackProcess: [
      '/media/transformations/transform-1/before.jpg',
      '/media/transformations/transform-1/after.jpg',
      '/media/transformations/transform-2/after.jpg',
    ],
  },
  'data-scraping': {
    accent: '#059669',
    light: '#ECFDF5',
    overlay: 'from-emerald-600/90 via-emerald-800/80 to-emerald-950/95',
    fallbackProcess: [
      '/media/portfolio/massive-data-explorer/cover.jpg',
      '/media/portfolio/massive-data-explorer/cover.jpg',
      '/media/portfolio/massive-data-explorer/cover.jpg',
    ],
  },
  'custom-software': {
    accent: '#EA580C',
    light: '#FFF7ED',
    overlay: 'from-orange-600/90 via-orange-800/80 to-orange-950/95',
    fallbackProcess: [
      '/media/portfolio/sdui/cover.jpg',
      '/media/portfolio/offline-first/cover.jpg',
      '/media/portfolio/fpp/cover.jpg',
    ],
  },
};

function parseVisualItems(body: string) {
  const parts = body.split('|').map((s) => s.trim()).filter(Boolean);
  const items: { emoji: string; title: string; description: string }[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    items.push({
      emoji: parts[i] || '•',
      title: parts[i + 1] || '',
      description: parts[i + 2] || '',
    });
  }
  return items;
}

const PROJECT_FALLBACK: Record<string, string> = {
  'web-modernization': '/media/transformations/transform-1/after.jpg',
  'data-scraping': '/media/portfolio/massive-data-explorer/cover.jpg',
  'custom-software': '/media/portfolio/sdui/cover.jpg',
};

function ProjectCover({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      loading="lazy"
      onError={() => setImgSrc(fallback)}
    />
  );
}

const ROTATE_MS = 5000;

export default function ServiceDetailPage({
  service,
  blocks,
  packages,
  stories,
  projects,
}: Props) {
  const theme = THEME[service.id] || THEME['web-modernization'];
  const processSlides = service.processImages?.length ? service.processImages : theme.fallbackProcess;
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const svcBlocks = blocks.filter((b) => b.serviceId === service.id);
  const introBlock = svcBlocks.find((b) => b.blockType === 'intro');
  const differenceBlock = svcBlocks.find((b) => b.blockType === 'difference');
  const supportBlock = svcBlocks.find((b) => b.blockType === 'support');
  const stepBlocks = svcBlocks.filter((b) => b.blockType === 'step').sort((a, b) => a.order - b.order);
  const svcPackages = packages.filter((p) => p.serviceId === service.id);

  const differences = differenceBlock ? parseVisualItems(differenceBlock.body) : [];
  const supportItems = supportBlock ? parseVisualItems(supportBlock.body) : [];

  const prev = useCallback(() => {
    setSlideIndex((i) => (i - 1 + processSlides.length) % processSlides.length);
  }, [processSlides.length]);

  const next = useCallback(() => {
    setSlideIndex((i) => (i + 1) % processSlides.length);
  }, [processSlides.length]);

  useEffect(() => {
    if (paused || processSlides.length <= 1) return;
    const timer = setInterval(() => setSlideIndex((i) => (i + 1) % processSlides.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, processSlides.length]);

  return (
    <>
      {/* Hero — add images in Excel process_images */}
      <section className="relative overflow-hidden bg-zinc-900">
        <div
          className="relative min-h-[360px] w-full sm:min-h-[420px] lg:min-h-[480px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={processSlides[slideIndex]}
              src={processSlides[slideIndex]}
              alt={`${service.name} — how we work`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className={`absolute inset-0 bg-gradient-to-t ${theme.overlay} via-black/30 to-black/10`} />

          {processSlides.length > 1 && (
            <>
              <button type="button" onClick={prev} aria-label="Previous" className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xl text-white backdrop-blur-sm hover:bg-black/60 sm:left-5 sm:h-12 sm:w-12">‹</button>
              <button type="button" onClick={next} aria-label="Next" className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xl text-white backdrop-blur-sm hover:bg-black/60 sm:right-5 sm:h-12 sm:w-12">›</button>
            </>
          )}

          <div className="relative z-10 flex min-h-[360px] flex-col justify-end px-4 pb-8 pt-24 sm:min-h-[420px] sm:px-6 sm:pb-10 lg:min-h-[480px] lg:px-10">
            <div className="mx-auto w-full max-w-7xl">
              <p className="section-eyebrow !text-white/80">{introBlock?.icon || '💼'} What we do</p>
              <h1 className="section-title mt-2 !text-white">{service.name}</h1>
              <p className="mt-2 max-w-2xl text-base text-white/90 sm:text-lg">{service.tagline}</p>
              {processSlides.length > 1 && (
                <div className="mt-4 flex items-center gap-2">
                  {processSlides.map((_, i) => (
                    <button key={i} type="button" onClick={() => setSlideIndex(i)} aria-label={`Slide ${i + 1}`} className={`h-2 rounded-full transition-all ${i === slideIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
                  ))}
                  {paused && <span className="ml-2 text-xs text-white/60">Paused</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What it is */}
      {introBlock && (
        <section className="bg-white section-padding !py-12 sm:!py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-eyebrow">What it is</p>
              <h2 className="section-title mt-2">{introBlock.title}</h2>
              <p className="section-subtitle mx-auto mt-3">{introBlock.body}</p>
            </div>
          </div>
        </section>
      )}

      {/* How it makes a difference */}
      {differences.length > 0 && (
        <section className="bg-zinc-50 section-padding !py-12 sm:!py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="section-eyebrow">The difference</p>
              <h2 className="section-title mt-2">{differenceBlock?.title || 'Why it matters'}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {differences.map((d) => (
                <div key={d.title} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <span className="text-3xl">{d.emoji}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-zinc-900">{d.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Real client stories — moving cards */}
      {stories.length > 0 && (
        <section className="bg-white section-padding !py-12 sm:!py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="section-eyebrow">Real stories</p>
              <h2 className="section-title mt-2">Results from real clients</h2>
              <p className="section-subtitle mx-auto mt-2">Hover to pause — tap a card on the homepage for full case studies.</p>
            </div>
          </div>
          <ServiceStoriesMarquee stories={stories} />
        </section>
      )}

      {/* How we do it — Step 1, 2, 3… */}
      {stepBlocks.length > 0 && (
        <section className="bg-zinc-50 section-padding !py-12 sm:!py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="section-eyebrow">Process</p>
              <h2 className="section-title mt-2">How we do it</h2>
              <p className="section-subtitle mx-auto mt-2">Clear steps — you always know what happens next.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stepBlocks.map((step, i) => (
                <div key={step.order} className="relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: theme.accent }}>
                      {step.icon || i + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Step {i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-zinc-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      {svcPackages.length > 0 && (
        <section className="bg-white section-padding !py-12 sm:!py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="section-eyebrow">Packages</p>
              <h2 className="section-title mt-2">Pick what fits</h2>
              <p className="section-subtitle mx-auto mt-2">Clear USD pricing — no hidden fees. Edit packages in Excel ServicePackages sheet.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {svcPackages.map((pkg) => (
                <article
                  key={pkg.id}
                  className={`flex flex-col rounded-2xl border p-6 shadow-sm sm:p-8 ${pkg.mostPopular ? 'border-violet-300 bg-violet-50/50 ring-2 ring-violet-200' : 'border-zinc-200 bg-white'}`}
                >
                  {pkg.mostPopular && (
                    <span className="mb-3 w-fit rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold uppercase text-white">Most popular</span>
                  )}
                  <span className="text-2xl">{pkg.emoji || '📦'}</span>
                  <h3 className="mt-3 font-display text-xl font-bold text-zinc-900">{pkg.name}</h3>
                  {pkg.description && <p className="mt-2 text-sm text-zinc-600">{pkg.description}</p>}
                  <p className="mt-4 font-display text-4xl font-bold text-zinc-900">{formatPrice(pkg.price, pkg.startingFrom)}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-zinc-700">
                        <span style={{ color: theme.accent }}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={getPackageEmailUrl(pkg.name, pkg.price)}
                    className={`mt-8 block w-full text-center ${pkg.mostPopular ? 'btn-accent' : 'btn-ghost'}`}
                  >
                    Get started →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Support — client does nothing / hosting / code handoff */}
      {supportItems.length > 0 && (
        <section className="bg-zinc-50 section-padding !py-12 sm:!py-16" style={{ background: theme.light }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="section-eyebrow">Support & handoff</p>
              <h2 className="section-title mt-2">{supportBlock?.title}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {supportItems.map((item) => (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-white/80 bg-white p-5 shadow-sm">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-50 text-2xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-display font-bold text-zinc-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Delivered projects — locked previews (client confidentiality) */}
      {projects.length > 0 && (
        <section className="bg-white section-padding !py-12 sm:!py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="section-eyebrow">Portfolio</p>
              <h2 className="section-title mt-2">Delivered projects</h2>
              <p className="section-subtitle mx-auto mt-2">
                Shipped work for real clients — previews only. Live demos and names are locked per client agreement.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((proj) => {
                const locked = proj.isLocked !== false;
                const fallback = PROJECT_FALLBACK[service.id] || PROJECT_FALLBACK['custom-software'];
                const coverSrc = proj.cover || fallback;
                const description =
                  proj.publicDescription ||
                  [proj.outcome, ...(proj.highlights || [])].filter(Boolean).join(' — ');
                return (
                  <article key={proj.id} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                      <ProjectCover src={coverSrc} alt={proj.title} fallback={fallback} />
                      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[2px]" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl backdrop-blur-sm">🔒</span>
                        <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-700">
                          Client confidential
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{proj.clientIndustry}</p>
                      <h3 className="mt-1 font-display text-lg font-bold text-zinc-900">{proj.title}</h3>
                      <p className="mt-2 text-sm font-medium" style={{ color: theme.accent }}>{proj.outcome}</p>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{description}</p>
                      {proj.highlights?.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {proj.highlights.map((h) => (
                            <li key={h} className="flex gap-2 text-xs text-zinc-600">
                              <span style={{ color: theme.accent }}>→</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {locked && (
                        <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                          🔒 Not permitted to show live demo or client branding publicly — description only.
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-zinc-50 section-padding !py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-zinc-900 sm:text-3xl">Ready to start?</h2>
          <p className="mt-3 text-zinc-600">Tell me about your project — I reply within one business day.</p>
          <a href={getContactUrl({ service: service.name, intent: 'general' })} className="btn-accent mt-6 inline-flex">Get a free quote →</a>
        </div>
      </section>
    </>
  );
}

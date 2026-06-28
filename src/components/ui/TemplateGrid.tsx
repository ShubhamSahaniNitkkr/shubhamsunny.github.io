import type { Template } from '../../types';

interface Props {
  templates: Template[];
  locked?: boolean;
}

const categories = ['All', 'Business', 'Portfolio', 'E-commerce', 'Restaurant', 'Healthcare'];

export default function TemplateGrid({ templates, locked = true }: Props) {
  return (
    <div>
      {locked && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-2xl" aria-hidden="true">🔒</span>
            <div>
              <p className="font-display text-lg font-bold text-zinc-900">Templates temporarily locked</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                We are currently reviewing our old template library and replacing it with <strong>20+ new designs (2020–2026 style)</strong> — faster, mobile-first, and built for real small businesses.
              </p>
              <p className="mt-2 text-sm text-zinc-600">Downloads will reopen soon. Need a site now? Check our <a href="/#services" className="font-semibold text-violet-600 hover:text-violet-700">website modernization service</a>.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 opacity-60 pointer-events-none select-none" aria-hidden={locked}>
        {categories.map((cat) => (
          <span
            key={cat}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${cat === 'All' ? 'bg-blue-600 text-white' : 'border border-zinc-200 bg-white text-zinc-600'}`}
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="relative mt-8">
        {locked && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-[2px]" aria-hidden="true">
            <div className="rounded-xl border border-zinc-200 bg-white/95 px-6 py-4 text-center shadow-lg">
              <p className="text-2xl">🔒</p>
              <p className="mt-1 text-sm font-bold text-zinc-900">Coming soon</p>
              <p className="text-xs text-zinc-500">New 2020–2026 templates</p>
            </div>
          </div>
        )}
        <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${locked ? 'opacity-50 blur-[1px]' : ''}`}>
          {templates.slice(0, 9).map((tpl) => (
            <article key={tpl.id} className="glass-card overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
                {tpl.thumbnail ? (
                  <img src={tpl.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <img src={`https://picsum.photos/seed/${tpl.id}/400/250`} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{tpl.category}</span>
                <h3 className="mt-1 font-semibold text-zinc-900">{tpl.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{tpl.description}</p>
                {locked ? (
                  <span className="mt-3 inline-block text-xs font-semibold text-zinc-400">Locked — updating library</span>
                ) : (
                  <a href={tpl.downloadUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline">Download free →</a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

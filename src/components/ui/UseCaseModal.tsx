import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import type { UseCase } from '../../types';
import { getContactUrl } from '../../lib/utils';

interface Props {
  item: UseCase;
  onClose: () => void;
}

const PAIN_ICONS: Record<string, string> = {
  clock: '⏱',
  money: '💸',
  phone: '📱',
  chart: '📉',
  users: '👥',
  alert: '⚠️',
  manual: '📋',
  slow: '🐢',
  lost: '❌',
  trust: '🔒',
};

const DELIVERABLE_ICONS: Record<string, string> = {
  database: '💾',
  camera: '📷',
  sync: '🔄',
  map: '🗺',
  signature: '✍️',
  dashboard: '📊',
  bot: '🤖',
  scrape: '🔍',
  api: '🔌',
  security: '🔐',
  mobile: '📱',
  web: '🌐',
  alert: '🔔',
  pdf: '📄',
  payment: '💳',
  search: '🔎',
};

export default function UseCaseModal({ item, onClose }: Props) {
  const [imgError, setImgError] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  const heroImg = !imgError ? (item.image || item.thumbnail) : '';
  const isPdf = item.pdfUrl.endsWith('.pdf') || (item.pdfUrl.includes('pdf') && item.pdfUrl !== '#');

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="my-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: 'min(900px, calc(100dvh - 2rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px)))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {heroImg ? (
          <div className="relative h-48 shrink-0 sm:h-56">
            <img
              src={heroImg}
              alt={item.title}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
            <button type="button" onClick={onClose} className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60" aria-label="Close">✕</button>
            <div className="absolute bottom-4 left-5 right-5 sm:left-6 sm:right-6">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">{item.category}</span>
              <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">{item.title}</h3>
              {item.client && <p className="mt-1 text-xs text-white/80">{item.client}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                {item.metric && (
                  <span className="rounded-lg bg-violet-600 px-3 py-1 text-xs font-bold text-white">{item.metric}</span>
                )}
                {item.duration && (
                  <span className="rounded-lg bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">{item.duration}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">{item.category}</span>
              <h3 className="mt-1 font-display text-xl font-bold text-zinc-900">{item.title}</h3>
            </div>
            <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200" aria-label="Close">✕</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-10 sm:py-8">
          <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
            <strong className="font-semibold">Note:</strong> Composite scenario based on real project patterns.
            Client names, branding, and exact metrics are withheld under NDA.
          </p>

          {/* Executive summary + key metrics — unified card */}
          {(item.summary || item.context?.length || item.highlights?.length) && (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white">
              {(item.summary || (!item.deepSections?.length && item.context?.length)) && (
                <div className="border-b border-zinc-100 p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-violet-600">Executive summary</p>
                  {item.summary && (
                    <p className="mt-3 text-base font-medium leading-relaxed text-zinc-800">{item.summary}</p>
                  )}
                  {!item.deepSections?.length && item.context?.map((para) => (
                    <p key={para.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-zinc-600">{para}</p>
                  ))}
                </div>
              )}
              {item.highlights && item.highlights.length > 0 && (
                <div className={`grid grid-cols-2 gap-px bg-zinc-200 ${item.highlights.length >= 4 ? 'sm:grid-cols-4' : ''}`}>
                  {item.highlights.map((h) => (
                    <div key={h.label} className="bg-white p-4 text-center sm:p-5">
                      <p className="font-display text-xl font-bold text-violet-600 sm:text-2xl">{h.value}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{h.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {item.deepSections && item.deepSections.length > 0 && (
            <div className="mt-8 space-y-6">
              {item.deepSections.map((section) => (
                <div key={section.title} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-violet-600">{section.title}</p>
                  {section.paragraphs.map((para) => (
                    <p key={para.slice(0, 48)} className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base sm:leading-relaxed">{para}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Deliverables — visual showcase of what was built */}
          {item.deliverables && item.deliverables.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">What we delivered</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {item.deliverables.map((d) => (
                  <div key={d.title} className="flex gap-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-xl shadow-sm">
                      {DELIVERABLE_ICONS[d.icon] || '📦'}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{d.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-600">{d.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visual pain points */}
          {item.painPoints && item.painPoints.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">What wasn&apos;t working</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {item.painPoints.map((p) => (
                  <div key={p.label} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lg shadow-sm">{PAIN_ICONS[p.icon] || '•'}</span>
                    <p className="text-sm font-medium leading-snug text-zinc-700">{p.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!item.painPoints?.length && item.challenge && (
            <div className="mt-7 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">The challenge</p>
              {item.challengeParagraphs?.map((para) => (
                <p key={para.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-zinc-700">{para}</p>
              ))}
              {!item.challengeParagraphs?.length && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">{item.challenge}</p>
              )}
            </div>
          )}

          {/* Approach steps — visual timeline */}
          {item.approach && item.approach.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">What we built</p>
              <div className="mt-3 space-y-0">
                {item.approach.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">{i + 1}</span>
                      {i < item.approach!.length - 1 && <div className="my-1 w-0.5 flex-1 bg-violet-200" />}
                    </div>
                    <p className="pb-5 pt-1.5 text-sm leading-relaxed text-zinc-700">{step}</p>
                  </div>
                ))}
              </div>
              {item.solutionParagraphs?.map((para) => (
                <p key={para.slice(0, 40)} className="mt-2 text-sm leading-relaxed text-zinc-600">{para}</p>
              ))}
            </div>
          )}

          {!item.approach?.length && item.solution && (
            <div className="mt-7 rounded-xl border border-violet-100 bg-violet-50/50 p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-500">What we built</p>
              {item.solutionParagraphs?.map((para) => (
                <p key={para.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-zinc-700">{para}</p>
              ))}
              {!item.solutionParagraphs?.length && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">{item.solution}</p>
              )}
            </div>
          )}

          {/* Project timeline */}
          {item.timeline && item.timeline.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Project timeline</p>
              <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200">
                {item.timeline.map((t, i) => (
                  <div key={t.phase} className={`flex gap-4 p-4 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}`}>
                    <div className="w-20 shrink-0">
                      <p className="text-xs font-bold text-violet-600">{t.duration}</p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase text-zinc-400">{t.phase}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-600">{t.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech stack pills */}
          {item.techStack && item.techStack.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tech &amp; tools</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.techStack.map((t) => (
                  <span key={t} className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Outcomes grid */}
          {item.outcomes && item.outcomes.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Results</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {item.outcomes.map((o) => (
                  <div key={o.label} className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="font-display text-2xl font-bold text-emerald-700">{o.value}</p>
                    <p className="mt-0.5 text-sm font-semibold text-emerald-800">{o.label}</p>
                    {o.detail && <p className="mt-1 text-xs leading-relaxed text-emerald-700/80">{o.detail}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!item.outcomes?.length && item.results && (
            <div className="mt-7 rounded-xl border border-emerald-100 bg-emerald-50 p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Results</p>
              {item.resultsParagraphs?.map((para) => (
                <p key={para.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-emerald-900">{para}</p>
              ))}
              {!item.resultsParagraphs?.length && (
                <p className="mt-2 text-sm leading-relaxed text-emerald-800">{item.results}</p>
              )}
            </div>
          )}

          {/* Client quote — only when a verifiable full name is provided */}
          {item.quote && item.quote.author?.includes(' ') && !/^(ops lead|agency founder|managing partner|operations head|founder|fba seller|kitchen manager)$/i.test(item.quote.author.trim()) && (
            <blockquote className="mt-7 rounded-xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
              <p className="text-base italic leading-relaxed text-zinc-700">&ldquo;{item.quote.text}&rdquo;</p>
              <footer className="mt-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                  {item.quote.author.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{item.quote.author}</p>
                  <p className="text-xs text-zinc-500">{item.quote.role}</p>
                </div>
              </footer>
            </blockquote>
          )}

          {isPdf && item.pdfUrl !== '#' && (
            <iframe src={item.pdfUrl} title={item.title} className="mt-7 h-48 w-full rounded-xl border border-zinc-200 sm:h-64" />
          )}
        </div>

        <div className="flex shrink-0 gap-3 border-t border-zinc-100 px-5 py-4 sm:px-8">
          <a href={getContactUrl({ service: item.category, message: `Interested in a project like: ${item.title}\n\n`, intent: 'general' })} className="btn-accent flex-1 text-center !text-sm">Discuss This Project</a>
          {item.pdfUrl && item.pdfUrl !== '#' && isPdf && (
            <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 text-center !text-sm">Open PDF</a>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

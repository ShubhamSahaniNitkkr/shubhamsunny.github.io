import { useEffect, useState } from 'react';
import { readCookieConsent, writeCookieConsent, type CookieConsentLevel } from '../../lib/cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!readCookieConsent()) setVisible(true);

    const openSettings = () => {
      setExpanded(true);
      setVisible(true);
    };

    window.addEventListener('ss-open-cookie-settings', openSettings);
    return () => window.removeEventListener('ss-open-cookie-settings', openSettings);
  }, []);

  function save(level: CookieConsentLevel) {
    writeCookieConsent(level);
    setVisible(false);
    setExpanded(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] p-4 sm:p-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl sm:p-6">
        <p id="cookie-consent-title" className="font-display text-base font-bold text-zinc-900 sm:text-lg">
          We value your privacy
        </p>
        <p id="cookie-consent-desc" className="mt-2 text-sm leading-relaxed text-zinc-600">
          We use essential cookies and local storage to run this site securely. With your permission, we also use
          limited functional storage to improve your experience. We do not sell your data or use advertising trackers.
        </p>

        {expanded && (
          <div className="mt-4 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700">
            <p className="font-semibold text-zinc-900">Essential (always on)</p>
            <p className="mt-1">Security, cookie preference memory, service worker cache, and core site functionality.</p>
            <p className="mt-3 font-semibold text-zinc-900">Functional (optional with Accept all)</p>
            <p className="mt-1">Chat session memory, contact form prefill, and visit session flags within your browser.</p>
            <p className="mt-3">
              Read our{' '}
              <a href="/legal/cookie-policy" className="font-medium text-violet-600 hover:text-violet-700">
                Cookie Policy
              </a>{' '}
              and{' '}
              <a href="/legal/privacy-policy" className="font-medium text-violet-600 hover:text-violet-700">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button type="button" onClick={() => save('all')} className="btn-accent !py-2.5 text-sm">
            Accept all
          </button>
          <button
            type="button"
            onClick={() => save('essential')}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="px-2 py-2.5 text-sm font-semibold text-violet-600 hover:text-violet-700 sm:ml-auto"
          >
            {expanded ? 'Hide details' : 'Customize'}
          </button>
        </div>
      </div>
    </div>
  );
}

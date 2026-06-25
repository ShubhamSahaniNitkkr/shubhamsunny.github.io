import { useEffect } from 'react';

interface Props {
  enabled: boolean;
}

const SESSION_KEY = 'ss-visit-notified';

export default function VisitTracker({ enabled }: Props) {
  useEffect(() => {
    if (!enabled) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      return;
    }

    const payload = {
      page: window.location.pathname + window.location.search,
      referrer: document.referrer || 'direct',
    };

    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [enabled]);

  return null;
}

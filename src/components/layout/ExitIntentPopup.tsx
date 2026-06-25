import { useState, useEffect, useCallback } from 'react';
import { getConsultationEmailUrl } from '../../lib/utils';

const STORAGE_KEY = 'ss-exit-popup-dismissed';
const COOLDOWN_MS = 60 * 60 * 1000;

function isInCooldown(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < COOLDOWN_MS;
  } catch {
    return false;
  }
}

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [blocked, setBlocked] = useState(true);

  const dismiss = useCallback(() => {
    setShow(false);
    setBlocked(true);
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* */ }
  }, []);

  useEffect(() => {
    if (isInCooldown()) return;
    setBlocked(false);
    const handleMouseLeave = (e: MouseEvent) => { if (e.clientY <= 0) setShow(true); };
    const timer = setTimeout(() => { if (window.innerWidth < 768) setShow(true); }, 45000);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => { document.removeEventListener('mouseleave', handleMouseLeave); clearTimeout(timer); };
  }, []);

  if (blocked || !show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-md bg-ivory p-8 sm:p-10">
        <button onClick={dismiss} className="absolute top-4 right-4 text-muted hover:text-charcoal" aria-label="Close">✕</button>
        <p className="label">Free Review</p>
        <h3 className="font-display mt-4 text-3xl text-charcoal">Get a Free Website Review</h3>
        <p className="mt-3 text-sm text-muted">
          Not sure if your site needs an upgrade? Send me your URL — I'll review it and suggest the best path forward.
        </p>
        <a href={getConsultationEmailUrl()} target="_blank" rel="noopener noreferrer" className="btn-rose mt-8 block w-full text-center" onClick={dismiss}>
          Request Free Review
        </a>
      </div>
    </div>
  );
}

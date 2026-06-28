export type CookieConsentLevel = 'all' | 'essential';

const STORAGE_KEY = 'ss-cookie-consent';

export function readCookieConsent(): CookieConsentLevel | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'all' || value === 'essential') return value;
    return null;
  } catch {
    return null;
  }
}

export function writeCookieConsent(level: CookieConsentLevel) {
  try {
    localStorage.setItem(STORAGE_KEY, level);
    window.dispatchEvent(new CustomEvent('ss-cookie-consent', { detail: { level } }));
  } catch {
    /* ignore */
  }
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent() === 'all';
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent('ss-open-cookie-settings'));
}

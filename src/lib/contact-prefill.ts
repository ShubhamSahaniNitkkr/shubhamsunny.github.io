import { siteConfig, mapServiceOption } from './utils';

const PREFILL_PARAMS = ['service', 'package', 'message', 'intent'] as const;
export const PREFILL_CACHE_KEY = '__ssContactPrefill';

export type ContactPrefillValues = { service: string; message: string };

export function readPrefillFromSearch(search: string): ContactPrefillValues {
  const params = new URLSearchParams(search);
  const serviceRaw = params.get('service') || params.get('package') || '';
  const message = params.get('message') || '';
  const intent = params.get('intent') || '';

  let service = serviceRaw ? mapServiceOption(serviceRaw) : '';
  if (!service && serviceRaw) service = serviceRaw;

  let prefillMessage = message;
  if (!prefillMessage && intent === 'consultation') {
    prefillMessage = siteConfig.emailMessages?.consultation || siteConfig.whatsappMessages?.consultation || '';
  }

  return { service, message: prefillMessage };
}

export function hasPrefillParams(search = typeof window !== 'undefined' ? window.location.search : '') {
  const params = new URLSearchParams(search);
  return PREFILL_PARAMS.some((key) => params.has(key));
}

export function clearPrefillParamsFromUrl() {
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of PREFILL_PARAMS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (!changed) return;
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, '', next);
}

export function scrollContactFormIntoView() {
  const el = document.getElementById('contact-form');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => {
    document.getElementById('contact-message')?.focus();
  }, 400);
}

export function applyContactPrefillToDom(): ContactPrefillValues | null {
  if (typeof window === 'undefined' || !hasPrefillParams()) return null;

  const values = readPrefillFromSearch(window.location.search);
  if (!values.service && !values.message) return null;

  const msgEl = document.getElementById('contact-message') as HTMLTextAreaElement | null;
  const svcEl = document.getElementById('contact-service') as HTMLSelectElement | null;

  if (values.message && msgEl) msgEl.value = values.message;
  if (values.service && svcEl) svcEl.value = values.service;

  cacheContactPrefill(values);
  clearPrefillParamsFromUrl();
  if (window.location.hash === '#contact') scrollContactFormIntoView();

  return values;
}

export function cacheContactPrefill(values: ContactPrefillValues | null) {
  if (!values || (!values.service && !values.message)) return;
  (window as Window & { [PREFILL_CACHE_KEY]?: ContactPrefillValues })[PREFILL_CACHE_KEY] = values;
}

export function readCachedContactPrefill(): ContactPrefillValues {
  if (typeof window === 'undefined') return { service: '', message: '' };
  const cached = (window as Window & { [PREFILL_CACHE_KEY]?: ContactPrefillValues })[PREFILL_CACHE_KEY];
  if (cached) return cached;
  return hasPrefillParams() ? readPrefillFromSearch(window.location.search) : { service: '', message: '' };
}

export function bootContactPrefill() {
  const tryApply = (attempt = 0) => {
    if (hasPrefillParams()) {
      applyContactPrefillToDom();
    }

    const cached = readCachedContactPrefill();
    if (!cached.service && !cached.message) return;

    const msgEl = document.getElementById('contact-message') as HTMLTextAreaElement | null;
    const svcEl = document.getElementById('contact-service') as HTMLSelectElement | null;

    if (cached.message && msgEl && !msgEl.value) msgEl.value = cached.message;
    if (cached.service && svcEl && !svcEl.value) svcEl.value = cached.service;

    if ((!msgEl || !svcEl) && attempt < 50) {
      window.setTimeout(() => tryApply(attempt + 1), 50);
    }
  };

  tryApply();
}

export function initContactPrefill() {
  if (typeof window === 'undefined') return;

  const run = () => bootContactPrefill();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  window.addEventListener('hashchange', run);
  window.addEventListener('pageshow', run);
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as HTMLElement).closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (!href.includes('#contact')) return;
      if (!/[?&](message|service|package|intent)=/.test(href)) return;
      window.setTimeout(run, 0);
      window.setTimeout(run, 100);
      window.setTimeout(run, 300);
    },
    true,
  );
}

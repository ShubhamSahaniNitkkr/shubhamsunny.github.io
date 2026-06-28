import site from '../data/site.json';
import type { SiteConfig } from '../types';

export const siteConfig = site as SiteConfig;

export interface ContactPrefill {
  service?: string;
  message?: string;
  package?: string;
  intent?: 'consultation' | 'package' | 'general' | 'chat';
}

/** Scroll target on homepage — internal contact form with optional prefill query params */
export function getContactUrl(prefill: ContactPrefill = {}): string {
  const params = new URLSearchParams();
  if (prefill.service) params.set('service', prefill.service);
  if (prefill.message) params.set('message', prefill.message);
  if (prefill.package) params.set('package', prefill.package);
  if (prefill.intent) params.set('intent', prefill.intent);
  const q = params.toString();
  return q ? `/?${q}#contact` : '/#contact';
}

export function formatPrice(price: number, startingFrom = false): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
  return startingFrom ? `From ${formatted}` : formatted;
}

/** @deprecated Gmail fallback — prefer getContactUrl for site CTAs */
export function getGmailUrl(subject: string, body: string): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: siteConfig.email,
    su: subject,
    body: body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function getConsultationEmailUrl(): string {
  const msg = siteConfig.emailMessages?.consultation || siteConfig.whatsappMessages?.consultation || '';
  return getContactUrl({ message: msg, intent: 'consultation' });
}

export function getPackageEmailUrl(packageName: string, price: number): string {
  const template =
    siteConfig.emailMessages?.package || siteConfig.whatsappMessages?.package || '';
  const body = template
    .replace('{packageName}', packageName)
    .replace('{price}', price.toLocaleString('en-US'));
  return getContactUrl({
    service: packageName,
    package: packageName,
    message: body,
    intent: 'package',
  });
}

/** Opens Gmail compose for contact form — fallback when Web3Forms is unavailable */
export function getContactFormEmailUrl(
  name: string,
  email: string,
  phone: string,
  service: string,
  message: string,
): string {
  const visitor = name.trim() || 'Website visitor';
  const subject = `Contact form — ${visitor}`;
  const body = [
    'Hi Shubham,',
    '',
    message.trim(),
    '',
    '---',
    `Name: ${visitor}`,
    email.trim() ? `Email: ${email.trim()}` : '',
    phone.trim() ? `Phone: ${phone.trim()}` : '',
    service.trim() ? `Service: ${service.trim()}` : '',
    'Sent via website contact form',
  ].filter(Boolean).join('\n');
  return getGmailUrl(subject, body);
}

/** Opens Gmail compose for website chat — fallback when Web3Forms is unavailable */
export function getChatEmailUrl(name: string, email: string, message: string, page: string): string {
  const visitor = name.trim() || 'Website visitor';
  return getContactUrl({
    message: [
      'Hi Shubham,',
      '',
      message.trim(),
      '',
      `Name: ${visitor}`,
      email.trim() ? `Email: ${email.trim()}` : '',
      `Page: ${page || '/'}`,
    ].filter(Boolean).join('\n'),
    intent: 'chat',
  });
}

export function resolveVisitApiUrl(): string {
  const base = String(import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '');
  return base ? `${base}/api/visit` : '/api/visit';
}

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm)(\?|$)/i.test(url);
}

export function getCloudinaryUrl(url: string, width = 800, height?: number): string {
  if (!url) return url;
  if (url.includes('cloudinary.com')) {
    if (isVideoUrl(url)) return url;
    const transform = height
      ? `c_fill,w_${width},h_${height},g_face,q_auto,f_auto`
      : `c_limit,w_${width},q_auto,f_auto`;
    return url.replace('/upload/', `/upload/${transform}/`);
  }
  return url;
}

export function getCloudinaryVideoPoster(url: string, width = 800): string {
  if (!url) return url;
  if (url.includes('cloudinary.com') && isVideoUrl(url)) {
    return url.replace('/upload/', `/upload/so_0,f_jpg,w_${width},q_auto/`);
  }
  return url;
}

export function mapServiceOption(raw: string): string {
  const v = raw.trim().toLowerCase();
  if (v.includes('web') || v.includes('modern') || v.includes('redesign')) return 'Website Modernization';
  if (v.includes('scrap') || v.includes('data')) return 'Data Scraping';
  if (v.includes('custom') || v.includes('software') || v.includes('app') || v.includes('bot')) return 'Custom Software';
  return raw.trim();
}

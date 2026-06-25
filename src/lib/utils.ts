import site from '../data/site.json';
import type { SiteConfig } from '../types';

export const siteConfig = site as SiteConfig;

export function formatPrice(price: number, startingFrom = false): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
  return startingFrom ? `From ${formatted}` : formatted;
}

/** Gmail compose — same flow as WhatsApp but opens email with pre-filled subject & body */
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
  return getGmailUrl('Free Website Review Request', msg);
}

export function getPackageEmailUrl(packageName: string, price: number): string {
  const template =
    siteConfig.emailMessages?.package || siteConfig.whatsappMessages?.package || '';
  const body = template
    .replace('{packageName}', packageName)
    .replace('{price}', price.toLocaleString('en-US'));
  return getGmailUrl(`Interested in ${packageName}`, body);
}

/** Opens Gmail compose for website chat — fallback when Web3Forms is unavailable */
export function getChatEmailUrl(name: string, email: string, message: string, page: string): string {
  const visitor = name.trim() || 'Website visitor';
  const subject = `Website chat — ${visitor}`;
  const body = [
    'Hi Shubham,',
    '',
    message.trim(),
    '',
    '---',
    `Name: ${visitor}`,
    email.trim() ? `Reply-to: ${email.trim()}` : 'Reply-to: (not provided)',
    `Page: ${page || '/'}`,
    'Sent via website chat',
  ].join('\n');
  return getGmailUrl(subject, body);
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

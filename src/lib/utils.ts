import site from '../data/site.json';
import type { SiteConfig } from '../types';

export const siteConfig = site as SiteConfig;

export function getContactUrl(message?: string): string {
  if (!message) return '/#contact';
  const params = new URLSearchParams({ message });
  return `/?${params.toString()}#contact`;
}

export function getGmailUrl(subject: string, body: string): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: siteConfig.email,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function getContactFormEmailUrl(
  name: string,
  email: string,
  phone: string,
  company: string,
  message: string,
): string {
  const visitor = name.trim() || 'Website visitor';
  const subject = `Portfolio inquiry — ${visitor}`;
  const body = [
    'Hi Shubham,',
    '',
    message.trim(),
    '',
    '---',
    `Name: ${visitor}`,
    email.trim() ? `Email: ${email.trim()}` : '',
    phone.trim() ? `Phone: ${phone.trim()}` : '',
    company.trim() ? `Company / Role: ${company.trim()}` : '',
    'Sent via portfolio contact form',
  ]
    .filter(Boolean)
    .join('\n');
  return getGmailUrl(subject, body);
}

export function getCloudinaryUrl(url: string, width = 800, height?: number): string {
  if (!url) return url;
  if (url.includes('cloudinary.com')) {
    const transform = height
      ? `c_fill,w_${width},h_${height},g_face,q_auto,f_auto`
      : `c_limit,w_${width},q_auto,f_auto`;
    return url.replace('/upload/', `/upload/${transform}/`);
  }
  return url;
}

export function youtubeEmbedUrl(id: string): string {
  if (!id) return '';
  return `https://www.youtube.com/embed/${id}?rel=0`;
}

export function youtubeWatchUrl(id: string): string {
  if (!id) return '';
  return `https://www.youtube.com/watch?v=${id}`;
}

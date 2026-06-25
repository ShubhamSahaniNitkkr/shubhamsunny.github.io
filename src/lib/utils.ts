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

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  const wa = String(siteConfig.whatsapp).replace(/\D/g, '');
  return `https://wa.me/${wa}?text=${encoded}`;
}

export function getWhatsAppConsultationUrl(): string {
  return getWhatsAppUrl(siteConfig.whatsappMessages.consultation);
}

export function getWhatsAppPackageUrl(packageName: string, price: number): string {
  const message = siteConfig.whatsappMessages.package
    .replace('{packageName}', packageName)
    .replace('{price}', price.toLocaleString('en-US'));
  return getWhatsAppUrl(message);
}

export function getPhoneUrl(): string {
  return `tel:${siteConfig.phone.replace(/\s/g, '')}`;
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

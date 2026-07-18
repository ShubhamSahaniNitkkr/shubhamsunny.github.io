import site from '../data/site.json';
import type { SiteConfig } from '../types';

export const siteConfig = site as SiteConfig;

export function youtubeEmbedUrl(id: string): string {
  if (!id) return '';
  return `https://www.youtube.com/embed/${id}?rel=0`;
}

export function youtubeWatchUrl(id: string): string {
  if (!id) return '';
  return `https://www.youtube.com/watch?v=${id}`;
}

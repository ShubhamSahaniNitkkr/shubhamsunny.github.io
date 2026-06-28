/** Repeat items so one marquee group is wider than any viewport (prevents empty gaps). */
export function expandMarqueeItems<T>(items: T[]): T[] {
  if (!items.length) return [];
  const repeats = items.length <= 2 ? 8 : items.length <= 4 ? 5 : 3;
  return Array.from({ length: repeats }, () => items).flat();
}

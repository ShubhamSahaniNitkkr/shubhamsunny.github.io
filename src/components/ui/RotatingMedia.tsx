import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface RotationItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
}

interface Props {
  items: RotationItem[];
  intervalMs?: number;
  className?: string;
  aspectRatio?: string;
  showDots?: boolean;
  rounded?: boolean;
}

export default function RotatingMedia({
  items,
  intervalMs = 4500,
  className = '',
  aspectRatio = '3/4',
  showDots = true,
  rounded = false,
}: Props) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, intervalMs, next]);

  const radius = rounded ? 'rounded-sm' : '';
  if (!items.length) return null;

  const current = items[index];

  return (
    <div className={`hero-rotator relative overflow-hidden bg-charcoal ${radius} ${className}`} style={{ aspectRatio }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.type}-${current.src}`}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {current.type === 'video' ? (
            <video src={current.src} poster={current.poster} muted loop playsInline autoPlay className="hero-rotator-media h-full w-full object-cover" />
          ) : (
            <img src={current.src} alt={current.alt || ''} loading={index === 0 ? 'eager' : 'lazy'} className="hero-rotator-media h-full w-full object-cover" />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
      {showDots && items.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 transition-all duration-300 ${i === index ? 'w-8 bg-rose-gold' : 'w-3 bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

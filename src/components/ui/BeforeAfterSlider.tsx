import { useState, useRef, useCallback, useEffect } from 'react';
import { getCloudinaryUrl } from '../../lib/utils';

interface Props {
  before: string;
  after: string;
  beforeType?: 'image' | 'video';
  afterType?: 'image' | 'video';
  alt?: string;
}

function isVideo(type: 'image' | 'video' | undefined, src: string) {
  if (type === 'video') return true;
  if (type === 'image') return false;
  return /\.(mp4|mov|webm)$/i.test(src);
}

function MediaLayer({
  src,
  type,
  alt,
  fullWidth,
}: {
  src: string;
  type?: 'image' | 'video';
  alt: string;
  fullWidth: number;
}) {
  const style = fullWidth > 0 ? { width: fullWidth, maxWidth: 'none' } : undefined;

  if (isVideo(type, src)) {
    return (
      <video
        src={src}
        className="absolute top-0 left-0 h-full object-cover"
        style={style}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    );
  }
  return (
    <img
      src={getCloudinaryUrl(src, 1400)}
      alt={alt}
      className="absolute top-0 left-0 h-full object-cover object-top"
      style={style}
      loading="lazy"
      draggable={false}
    />
  );
}

export default function BeforeAfterSlider({
  before,
  after,
  beforeType,
  afterType,
  alt = 'Website transformation',
}: Props) {
  const [position, setPosition] = useState(50);
  const [fullWidth, setFullWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setFullWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  if (!before || !after) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-charcoal/10 text-sm text-muted">
        Media missing — check Excel Transformations sheet
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[200px] w-full cursor-col-resize select-none overflow-hidden bg-zinc-900"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <MediaLayer src={after} type={afterType} alt={`${alt} after`} fullWidth={fullWidth} />
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}>
        <MediaLayer src={before} type={beforeType} alt={`${alt} before`} fullWidth={fullWidth} />
      </div>

      <div className="absolute top-0 bottom-0 z-10 w-0.5 bg-violet-500" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-violet-500 bg-white shadow-lg">
          <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      <span className="absolute top-4 left-4 z-20 rounded-md bg-black/70 px-3 py-1 text-[10px] font-medium tracking-widest text-white uppercase">
        Before
      </span>
      <span className="absolute top-4 right-4 z-20 rounded-md border border-violet-500 bg-white/95 px-3 py-1 text-[10px] font-medium tracking-widest text-violet-700 uppercase">
        After
      </span>
    </div>
  );
}

import { useEffect, useState } from 'react';

const PHRASES = [
  'win customers, not lose them',
  'load fast on every phone',
  'look premium, not outdated',
  'turn visitors into leads',
  'build trust in seconds',
];

export default function HeroRotatingText() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 220);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`hero-rotating-line inline-block text-rose-gold-dark transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
      aria-live="polite"
    >
      {PHRASES[index]}
    </span>
  );
}

import { motion } from 'framer-motion';

const FLOATS = [
  { label: '<div/>', top: '12%', left: '6%', delay: 0 },
  { label: '{ API }', top: '22%', right: '8%', delay: 0.4 },
  { label: 'fetch()', top: '55%', left: '4%', delay: 0.8 },
  { label: '0.3s', top: '68%', right: '6%', delay: 1.2 },
  { label: 'JSON', top: '38%', left: '12%', delay: 0.6 },
  { label: 'React', top: '48%', right: '14%', delay: 1 },
];

const NODES = [
  { cx: '15%', cy: '30%' },
  { cx: '85%', cy: '25%' },
  { cx: '78%', cy: '62%' },
  { cx: '20%', cy: '70%' },
  { cx: '50%', cy: '45%' },
];

export default function HeroTechAnimation() {
  return (
    <div className="hero-tech-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="hero-tech-grid" />
      <div className="hero-tech-scan" />

      <div className="hero-tech-orb hero-tech-orb--1" />
      <div className="hero-tech-orb hero-tech-orb--2" />
      <div className="hero-tech-orb hero-tech-orb--3" />

      <svg className="hero-tech-network absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <motion.line
          x1="15%" y1="30%" x2="50%" y2="45%"
          stroke="#7856FF" strokeWidth="1.5" strokeOpacity="0.35"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.line
          x1="50%" y1="45%" x2="85%" y2="25%"
          stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.35"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.line
          x1="50%" y1="45%" x2="78%" y2="62%"
          stroke="#7856FF" strokeWidth="1.5" strokeOpacity="0.3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.line
          x1="15%" y1="30%" x2="20%" y2="70%"
          stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.25"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.8, delay: 0.9, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        {NODES.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r="5"
            fill="#7856FF"
            fillOpacity="0.5"
            animate={{ r: [4, 7, 4], fillOpacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      {FLOATS.map((f, i) => (
        <motion.span
          key={i}
          className="hero-tech-chip absolute rounded-lg border border-violet-200/80 bg-white/80 px-2.5 py-1 font-mono text-[11px] font-medium text-violet-700 shadow-sm backdrop-blur-sm sm:text-xs"
          style={{ top: f.top, left: f.left, right: f.right }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0.5, 1, 0.5], y: [0, -8, 0] }}
          transition={{ duration: 4 + i * 0.5, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {f.label}
        </motion.span>
      ))}
    </div>
  );
}

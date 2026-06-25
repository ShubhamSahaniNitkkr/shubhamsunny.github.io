import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import modelsData from '../../data/models.json';
import type { ClientProject } from '../../types';
import { getCloudinaryUrl } from '../../lib/utils';

const projects = (modelsData.models || []) as ClientProject[];

const bentoLayouts: Record<string, string> = {
  feature: 'col-span-2 row-span-2 min-h-[240px] sm:min-h-[360px] lg:min-h-[420px]',
  tall: 'col-span-1 row-span-2 min-h-[240px] sm:min-h-[340px] lg:min-h-[400px]',
  wide: 'col-span-2 row-span-1 min-h-[200px] sm:min-h-[240px] lg:min-h-[260px]',
  standard: 'col-span-1 row-span-1 min-h-[200px] sm:min-h-[220px] lg:min-h-[240px]',
  half: 'col-span-1 row-span-1 min-h-[200px]',
};

function bentoClass(project: ClientProject, index: number): string {
  if (project.bento && bentoLayouts[project.bento]) return bentoLayouts[project.bento];
  const patterns = ['feature', 'standard', 'standard', 'wide', 'standard', 'tall', 'standard', 'wide', 'standard', 'tall'];
  return bentoLayouts[patterns[index % patterns.length]];
}

function ProjectCard({ project, index }: { project: ClientProject; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), { stiffness: 280, damping: 28 });

  const cover = project.cover;
  const isFeature = project.bento === 'feature' || index === 0;
  const href = project.liveUrl || `/projects#${project.id}`;

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target={project.liveUrl ? '_blank' : undefined}
      rel={project.liveUrl ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        mx.set(0);
        my.set(0);
      }}
      onMouseMove={(e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      className={`portfolio-bento-card group relative block overflow-hidden rounded-sm bg-charcoal ${bentoClass(project, index)}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      {cover ? (
        <img
          src={getCloudinaryUrl(cover, isFeature ? 1400 : 900)}
          alt={project.title}
          className={`portfolio-ken-burns absolute inset-0 h-full w-full object-cover transition duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}
          loading={index < 3 ? 'eager' : 'lazy'}
        />
      ) : (
        <div className="flex h-full min-h-[inherit] w-full items-center justify-center bg-gradient-to-br from-charcoal to-black p-6">
          <span className="font-display text-center text-2xl text-ivory/30">{project.title}</span>
        </div>
      )}

      <div className="portfolio-card-shine pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/10" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 transition group-hover:ring-rose-gold/40" />

      <div className="absolute top-3 left-3 z-10 sm:top-4 sm:left-4">
        <span className="font-display text-2xl text-white/20 transition group-hover:text-rose-gold/50 sm:text-4xl">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {project.liveUrl && (
        <div className="absolute top-3 right-3 z-10 rounded-full border border-white/25 bg-black/50 px-2.5 py-1 text-[9px] font-semibold tracking-widest text-white uppercase backdrop-blur-sm">
          Live Demo
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-4 pt-10 pb-4 sm:px-5 sm:pb-5">
        <p className="text-[9px] font-semibold tracking-[0.22em] text-rose-gold-light uppercase sm:text-[10px]">
          {project.clientIndustry || project.category}
        </p>
        <p className={`mt-1 font-display font-semibold text-white ${isFeature ? 'text-lg sm:text-2xl' : 'text-base sm:text-lg'}`}>
          {project.title}
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/80 sm:text-sm">{project.outcome}</p>
        <span className="mt-3 inline-flex items-center gap-2 rounded-sm border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm transition group-hover:border-rose-gold/50 group-hover:bg-rose-gold/20">
          View project →
        </span>
      </div>
    </motion.a>
  );
}

export default function ProjectsBento() {
  if (!projects.length) {
    return <p className="text-center text-sm text-white/50">Add projects in site-data.xlsx → Portfolio sheet</p>;
  }

  return (
    <div className="grid w-full auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </div>
  );
}

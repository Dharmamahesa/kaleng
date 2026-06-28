'use client'

import React from 'react'
import { motion } from 'framer-motion'

const projects = [
  {
    id: 1,
    title: 'Resonance UI',
    category: 'Design System',
    tag: 'frontend',
    description: 'A handcrafted component library inspired by lo-fi aesthetics and indie game interfaces.',
    accent: '#FF6B9D',
    year: '2024',
  },
  {
    id: 2,
    title: 'Hitori.fm',
    category: 'Web App',
    tag: 'fullstack',
    description: 'A personal music diary that visualizes your listening habits as an animated soundscape.',
    accent: '#9B59B6',
    year: '2024',
  },
  {
    id: 3,
    title: 'Live House',
    category: 'Creative Portfolio',
    tag: 'design',
    description: 'Interactive venue map for underground bands — click a stage, hear the crowd.',
    accent: '#E8A4C8',
    year: '2023',
  },
  {
    id: 4,
    title: 'Kessoku.css',
    category: 'Open Source',
    tag: 'library',
    description: 'A minimal CSS framework with anime-coded utility classes. 2.3k GitHub stars.',
    accent: '#FFD93D',
    year: '2023',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

// Guitar pick SVG inline component
const GuitarPickIcon = ({ color = '#f4a7b9', size = 18 }: { color?: string; size?: number }) => (
  <svg width={size} height={Math.round(size * 1.2)} viewBox="0 0 30 36" fill="none">
    <path
      d="M15 2C8 2 2 8 2 15C2 22 8 30 15 34C22 30 28 22 28 15C28 8 22 2 15 2Z"
      fill={color}
      opacity="0.9"
    />
  </svg>
)

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative py-24 md:py-36 px-5 md:px-10 overflow-hidden bokeh-bg"
      style={{ background: 'linear-gradient(180deg, #1a1520 0%, #120f18 60%, #1a1520 100%)' }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute top-20 left-1/4 w-80 h-80 rounded-full pointer-events-none animate-glow-pulse"
        style={{ background: 'radial-gradient(circle, rgba(244,167,185,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full pointer-events-none animate-glow-pulse"
        style={{ background: 'radial-gradient(circle, rgba(139,111,158,0.06) 0%, transparent 70%)', filter: 'blur(50px)', animationDelay: '1.5s' }}
      />

      <div className="relative max-w-6xl mx-auto z-10">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 md:mb-20"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="washi-tape">selected works</span>
          </div>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight"
            style={{ fontFamily: 'var(--font-caveat)', color: '#fde8ef' }}
          >
            my{' '}
            <span className="gradient-pink-purple">projects</span>
            <span style={{ color: 'rgba(244,167,185,0.5)' }}> ✦</span>
          </h2>
          <p
            className="mt-3 text-sm md:text-base max-w-lg leading-relaxed"
            style={{ color: 'rgba(245,240,248,0.35)', fontFamily: 'var(--font-outfit)' }}
          >
            things i built when i wasn&apos;t hiding under my blanket
          </p>
        </motion.div>

        {/* ── Card Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className="group relative glass-bocchi-card rounded-2xl md:rounded-3xl p-5 md:p-7 transition-all duration-500 cursor-pointer"
            >
              {/* Top row: tag + year + pick accent */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {/* Category badge */}
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      background: `${project.accent}18`,
                      border: `1px solid ${project.accent}35`,
                      color: project.accent,
                      fontFamily: 'var(--font-outfit)',
                    }}
                  >
                    {/* Cassette tape dot */}
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.accent }} />
                    {project.tag}
                  </span>
                </div>

                {/* Guitar pick + year */}
                <div className="flex items-center gap-2 opacity-50 group-hover:opacity-90 transition-opacity duration-300">
                  <span className="text-[10px] font-mono" style={{ color: project.accent }}>
                    {project.year}
                  </span>
                  <div className="group-hover:rotate-12 transition-transform duration-300">
                    <GuitarPickIcon color={project.accent} size={16} />
                  </div>
                </div>
              </div>

              {/* Music note watermark */}
              <span
                className="absolute top-4 right-16 text-4xl font-bold select-none pointer-events-none opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500"
                style={{ color: project.accent }}
              >
                ♫
              </span>

              {/* Category label */}
              <p
                className="text-[10px] md:text-xs uppercase tracking-[0.18em] mb-1.5"
                style={{ color: `${project.accent}80`, fontFamily: 'var(--font-outfit)' }}
              >
                {project.category}
              </p>

              {/* Title */}
              <h3
                className="text-2xl md:text-3xl font-bold mb-3 leading-tight tracking-tight transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-caveat)',
                  color: '#fde8ef',
                }}
              >
                {project.title}
              </h3>

              {/* Description */}
              <p
                className="text-xs md:text-sm leading-relaxed mb-5"
                style={{ color: 'rgba(245,240,248,0.42)', fontFamily: 'var(--font-outfit)' }}
              >
                {project.description}
              </p>

              {/* Bottom bar */}
              <div
                className="flex items-center justify-between pt-4"
                style={{ borderTop: `1px solid ${project.accent}18` }}
              >
                <span
                  className="text-xs font-medium"
                  style={{ color: `${project.accent}90`, fontFamily: 'var(--font-caveat)', fontSize: '0.95rem' }}
                >
                  view project →
                </span>

                {/* Arrow circle */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-400 group-hover:scale-110"
                  style={{
                    borderColor: `${project.accent}30`,
                    background: `${project.accent}0a`,
                    color: project.accent,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </div>

              {/* Spec-exact neon pink hover glow ring */}
              <div
                className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: `0 0 10px ${project.accent}44, 0 0 30px ${project.accent}22, inset 0 0 0 1px ${project.accent}40`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom decoration ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mt-14"
        >
          <p
            style={{
              fontFamily: 'var(--font-caveat)',
              fontSize: '1.2rem',
              color: 'rgba(244,167,185,0.3)',
            }}
          >
            ♪ more coming soon... probably ♪
          </p>
        </motion.div>
      </div>
    </section>
  )
}

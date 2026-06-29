'use client'

import React from 'react'
import { motion } from 'framer-motion'

const skills = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: 'frontend dev',
    description: 'React, Next.js, TypeScript. I build things that feel alive — components that breathe, layouts that flow.',
    tag: '∼ main skill',
    accent: '#FF6B9D',  // pink — main skill
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: 'ui / ux design',
    description: 'Figma, design systems, micro-interactions. Every pixel is a decision. I agonize over each one.',
    tag: '∼ obsession',
    accent: '#FFD93D',  // gold — obsession
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'motion design',
    description: 'Framer Motion, GSAP, CSS animations. I believe everything should move with intention — shy but expressive.',
    tag: '∼ specialty',
    accent: '#9B59B6',  // purple — specialty
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'open source',
    description: 'Contributor, maintainer, occasional bug reporter. Giving back feels good even when you\'re shy.',
    tag: '∼ community',
    accent: '#00CEC9',  // cyan — community
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

export default function Features() {
  return (
    <section
      id="skills"
      className="relative py-24 md:py-36 px-5 md:px-10 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #120f18 0%, #1a1520 50%, #120f18 100%)' }}
    >
      {/* Subtle top + bottom gradient fades */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-bocchi-dark/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-bocchi-dark/80 to-transparent pointer-events-none" />

      {/* Ambient blobs */}
      <div
        className="absolute left-1/2 top-1/3 w-[500px] h-[500px] -translate-x-1/2 rounded-full pointer-events-none animate-glow-pulse"
        style={{ background: 'radial-gradient(circle, rgba(201,116,138,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-6xl mx-auto z-10">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="washi-tape-purple mb-5 inline-block">
            what i do~
          </span>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold mt-4 tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-caveat)', color: '#fde8ef' }}
          >
            skills{' '}
            <span className="gradient-pink-purple">&amp; stuff</span>
            <span style={{ color: 'rgba(176,154,199,0.6)' }}>~</span>
          </h2>
          <p
            className="mt-4 text-sm md:text-base max-w-md mx-auto leading-relaxed"
            style={{ color: 'rgba(245,240,248,0.3)', fontFamily: 'var(--font-outfit)' }}
          >
            things i&apos;ve gotten good at while avoiding eye contact
          </p>
        </motion.div>

        {/* ── Skill Cards ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6"
        >
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group bocchi-skill-card"
              style={{ '--card-color': skill.accent } as React.CSSProperties}
            >
              {/* Icon container */}
              <div className="bocchi-skill-icon">
                {skill.icon}
              </div>

              {/* Tag */}
              <p className="bocchi-skill-tag" style={{ fontFamily: 'var(--font-outfit)' }}>
                {skill.tag}
              </p>

              {/* Title */}
              <h3 className="bocchi-skill-title" style={{ fontFamily: 'var(--font-caveat)' }}>
                {skill.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm md:text-[0.9rem] leading-relaxed"
                style={{ color: 'rgba(245,240,248,0.38)', fontFamily: 'var(--font-outfit)' }}
              >
                {skill.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom stars ── */}
        <div className="flex justify-center gap-3 mt-16 opacity-25">
          {['✦', '✧', '✦', '✧', '✦'].map((s, i) => (
            <span
              key={i}
              className="animate-star-float"
              style={{
                color: i % 2 === 0 ? '#f4a7b9' : '#8b6f9e',
                animationDelay: `${i * 0.4}s`,
                fontSize: i === 2 ? '1rem' : '0.7rem',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

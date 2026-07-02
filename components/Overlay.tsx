'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, MotionValue, useTransform, useMotionValue, useSpring } from 'framer-motion'

interface OverlayProps {
  scrollYProgress: MotionValue<number>
}

const TAGLINES = [
  'guitar · code · dreams ✦',
  'shy dev. loud code.',
  'making noise since day 1.',
  'one component at a time~',
]

// Floating decorative elements
const FloatingStar = ({ style }: { style: React.CSSProperties }) => (
  <span
    className="absolute pointer-events-none select-none animate-star-float"
    style={{ color: 'rgba(255,107,157,0.6)', fontSize: '1rem', ...style }}
  >
    ✦
  </span>
)

const FloatingNote = ({
  style,
  note = '♪',
}: {
  style: React.CSSProperties
  note?: string
}) => (
  <span
    className="absolute pointer-events-none select-none"
    style={{ color: 'rgba(255,107,157,0.35)', fontSize: '1.1rem', ...style }}
  >
    {note}
  </span>
)

// Typewriter hook — manual impl, no external dep needed
function useTypewriter(words: string[], speed = 55, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIdx]
    let delay = deleting ? speed / 2 : speed

    if (!deleting && charIdx === word.length) {
      delay = pause
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setWordIdx((i) => (i + 1) % words.length)
      return
    }

    const t = setTimeout(() => {
      if (!deleting && charIdx < word.length) {
        setDisplay(word.slice(0, charIdx + 1))
        setCharIdx((c) => c + 1)
      } else if (!deleting && charIdx === word.length) {
        setDeleting(true)
      } else if (deleting) {
        setDisplay(word.slice(0, charIdx - 1))
        setCharIdx((c) => c - 1)
      }
    }, delay)

    return () => clearTimeout(t)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return display
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const tagline = useTypewriter(TAGLINES)

  // ── Hero (0 – 14%) ──────────────────────────────────────
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.14], [1, 1, 0])
  const heroScale   = useTransform(scrollYProgress, [0, 0.14], [1, 1.04])
  const heroBlur    = useTransform(scrollYProgress, [0.08, 0.14], ['blur(0px)', 'blur(10px)'])
  const scrollIndOp = useTransform(scrollYProgress, [0, 0.06], [1, 0])

  // ── Left / About (20 – 52%) ─────────────────────────────
  const leftOpacity = useTransform(scrollYProgress, [0.18, 0.27, 0.48, 0.55], [0, 1, 1, 0])
  const leftX       = useTransform(scrollYProgress, [0.18, 0.27], [-50, 0])

  // ── Right / Skills (57 – 90%) ───────────────────────────
  const rightOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.86, 0.93], [0, 1, 1, 0])
  const rightX       = useTransform(scrollYProgress, [0.55, 0.65], [50, 0])

  // ── Mouse parallax 3D ───────────────────────────────────
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isIdle, setIsIdle] = useState(true)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.set(x)
      mouseY.set(y)
      setIsIdle(false)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 2000)
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [mouseX, mouseY])

  const springCfg = { stiffness: 200, damping: 15 }
  const rotateX     = useSpring(useTransform(mouseY, (v) => v * -25), springCfg)
  const rotateY     = useSpring(useTransform(mouseX, (v) => v *  25), springCfg)

  // Decreasing depth for child elements
  const rotateXHalf  = useTransform(rotateX, (v) => v * 0.48)  // 25 × 0.48 ≈ 12°
  const rotateYHalf  = useTransform(rotateY, (v) => v * 0.48)
  const rotateXLight = useTransform(rotateX, (v) => v * 0.28)  // 25 × 0.28 ≈  7°
  const rotateYLight = useTransform(rotateY, (v) => v * 0.28)
  const rotateXMin   = useTransform(rotateX, (v) => v * 0.1)
  const rotateYMin   = useTransform(rotateY, (v) => v * 0.1)

  // Layered text-shadow for depth illusion
  const depth3dShadow = [
    '1px 1px 0 #c94f7c',
    '2px 2px 0 #b8436d',
    '3px 3px 0 #a7375e',
    '4px 4px 0 #96294f',
    '5px 5px 0 #851b40',
    '6px 6px 10px rgba(0,0,0,0.5)',
    '0 0 30px rgba(255,107,157,0.6)',
    '0 0 60px rgba(255,107,157,0.3)',
  ].join(', ')

  const idleShadow = [
    '1px 1px 0 #c94f7c',
    '2px 2px 0 #b8436d',
    '3px 3px 0 #a7375e',
    '4px 4px 0 #96294f',
    '5px 5px 0 #851b40',
    '6px 6px 10px rgba(0,0,0,0.5)',
    '0 0 60px rgba(255,107,157,0.9)',
    '0 0 100px rgba(255,107,157,0.4)',
  ].join(', ')

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="w-full h-full relative">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, filter: heroBlur }}
          className="absolute inset-0 flex flex-col items-center justify-between py-16 md:py-20 px-5"
        >
          {/* ── Top cluster ── */}
          <div className="text-center mt-6 relative" style={{ transformStyle: 'preserve-3d' }}>
            {/* Washi tape badge — minimal parallax */}
            {mounted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="mb-4 flex justify-center"
                style={{ rotateX: rotateXMin, rotateY: rotateYMin, transformPerspective: 800 }}
              >
                <span className="washi-tape">✦ kessoku band · indie rock ✦</span>
              </motion.div>
            )}

            {/* Main title "bocchi." — full 3D tilt */}
            {mounted && (
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="leading-none tracking-tight"
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                  fontWeight: 700,
                  color: 'var(--bocchi-cream)',
                  rotateX,
                  rotateY,
                  transformPerspective: 800,
                  transformStyle: 'preserve-3d',
                  textShadow: isIdle ? idleShadow : depth3dShadow,
                  transition: isIdle ? 'text-shadow 1.5s ease' : 'text-shadow 0.15s ease',
                }}
              >
                <span
                  className="glitch"
                  data-text="Dharma mahesa"
                  style={{ display: 'inline-block' }}
                >
                  Dharma mahesa
                </span>
              </motion.h1>
            )}

            {/* "portfolio" subtitle — half depth (0.5×) */}
            {mounted && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: 'clamp(2rem, 5.5vw, 5rem)',
                  color: 'rgba(232,164,200,0.85)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  marginTop: '-0.15em',
                  rotateX: rotateXHalf,
                  rotateY: rotateYHalf,
                  transformPerspective: 800,
                }}
              >
                portfolio
              </motion.p>
            )}

            {/* Floating decorators */}
            <FloatingStar style={{ top: '-10px', left: '10%', animationDelay: '0s' }} />
            <FloatingStar style={{ top: '20px', right: '8%', animationDelay: '1.2s' }} />
            <FloatingNote style={{ top: '10px', left: '5%', animationDelay: '0.5s' }} note="♫" />
          </div>

          {/* ── Bottom cluster ── */}
          <div className="text-center mb-8 md:mb-16 relative" style={{ transformStyle: 'preserve-3d' }}>
            {/* Typewriter tagline — 0.3× depth */}
            {mounted && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: 'clamp(1.1rem, 3vw, 1.7rem)',
                  color: 'rgba(255,107,157,0.75)',
                  letterSpacing: '0.05em',
                  minHeight: '2rem',
                  rotateX: rotateXLight,
                  rotateY: rotateYLight,
                  transformPerspective: 800,
                }}
              >
                hitori goto ·{' '}
                <span style={{ color: 'var(--bocchi-cream)' }}>
                  {tagline}
                  <span
                    className="animate-scroll-bounce inline-block"
                    style={{ color: 'var(--bocchi-pink)', marginLeft: 2 }}
                  >
                    |
                  </span>
                </span>
              </motion.p>
            )}
            {/* Description — 0.1× depth (almost flat) */}
            {mounted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.35, duration: 0.8 }}
                className="text-xs md:text-sm mt-2 max-w-xs mx-auto leading-relaxed"
                style={{
                  color: 'rgba(255,245,248,0.28)',
                  fontFamily: 'var(--font-klee, var(--font-outfit))',
                  rotateX: rotateXMin,
                  rotateY: rotateYMin,
                  transformPerspective: 800,
                }}
              >
                shy developer who speaks in semicolons and power chords
              </motion.p>
            )}

            {/* Floating notes near bottom */}
            <FloatingNote style={{ bottom: '30px', left: '-30px', animationDelay: '0.8s' }} note="♩" />
            <FloatingNote style={{ bottom: '20px', right: '-20px', animationDelay: '1.5s' }} note="♪" />
          </div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          style={{ opacity: scrollIndOp }}
          className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span
            className="text-[9px] md:text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'rgba(255,107,157,0.3)', fontFamily: 'var(--font-outfit)' }}
          >
            scroll
          </span>
          <span className="animate-scroll-bounce text-base" style={{ color: 'rgba(255,107,157,0.4)' }}>
            ♪
          </span>
        </motion.div>

        {/* ══════════════════════════════════════
            LEFT PANEL — About
        ══════════════════════════════════════ */}
        <motion.div
          style={{ opacity: leftOpacity, x: leftX }}
          className="absolute left-4 md:left-10 lg:left-16 top-1/2 -translate-y-1/2 max-w-[280px] md:max-w-xs"
        >
          <div className="glass-bocchi p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-visible">
            {/* Washi tape corner */}
            <div className="absolute -top-3 left-4 washi-tape-purple" style={{ transform: 'rotate(-2deg)' }}>
              about me~
            </div>

            <h2
              className="text-2xl md:text-3xl font-bold mb-2 mt-2 leading-tight"
              style={{ fontFamily: 'var(--font-caveat)', color: 'var(--bocchi-cream)' }}
            >
              a little bit{' '}
              <span className="gradient-pink-purple">about</span>
              <span style={{ color: 'var(--bocchi-pink)' }}> me...</span>
            </h2>

            <p
              className="text-xs md:text-sm leading-relaxed mb-4"
              style={{
                color: 'rgba(255,245,248,0.5)',
                fontFamily: 'var(--font-klee, var(--font-outfit))',
              }}
            >
              I build interfaces that feel like songs — each component a note,
              each animation a chord change. Mostly alone in my room. It&apos;s fine.
            </p>

            {/* Stats */}
            <div
              className="flex gap-4 pt-3"
              style={{ borderTop: '1px solid rgba(255,107,157,0.1)' }}
            >
              {[
                { val: '3+', label: 'years dev' },
                { val: '47', label: 'projects' },
                { val: '∞', label: 'coffees' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <p
                    className="text-lg md:text-xl font-bold"
                    style={{ fontFamily: 'var(--font-caveat)', color: 'var(--bocchi-pink)' }}
                  >
                    {val}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: 'rgba(255,107,157,0.35)' }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Decorative pick */}
            <div
              className="absolute -bottom-3 -right-3 w-6 h-7 opacity-40"
              style={{
                background: 'linear-gradient(135deg, #FF6B9D, #9B59B6)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                transform: 'rotate(25deg)',
              }}
            />
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            RIGHT PANEL — Skills
        ══════════════════════════════════════ */}
        <motion.div
          style={{ opacity: rightOpacity, x: rightX }}
          className="absolute right-4 md:right-10 lg:right-16 top-1/2 -translate-y-1/2 max-w-[280px] md:max-w-xs"
        >
          <div className="glass-bocchi p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-visible">
            {/* Washi tape corner */}
            <div className="absolute -top-3 right-4 washi-tape" style={{ transform: 'rotate(1.5deg)' }}>
              skills~
            </div>

            <h2
              className="text-2xl md:text-3xl font-bold mb-3 mt-2 leading-tight text-right"
              style={{ fontFamily: 'var(--font-caveat)', color: 'var(--bocchi-cream)' }}
            >
              things i{' '}
              <span className="gradient-pink-purple">know</span>
              <span style={{ color: 'var(--bocchi-purple-light)' }}> (mostly)</span>
            </h2>

            {/* Skill list with guitar-pick bullets */}
            <ul className="space-y-2">
              {[
                { name: 'React / Next.js', level: 8 },
                { name: 'TypeScript',      level: 7 },
                { name: 'Framer Motion',   level: 10 },
                { name: 'CSS / Tailwind',  level: 9 },
                { name: 'UI / UX Design',  level: 8 },
              ].map(({ name, level }) => (
                <li key={name} className="flex items-center gap-2 group">
                  <span
                    className="w-2.5 h-3 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'linear-gradient(135deg, #FF6B9D, #9B59B6)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      transform: 'rotate(15deg)',
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className="text-xs font-medium"
                        style={{ color: 'rgba(255,245,248,0.75)', fontFamily: 'var(--font-outfit)' }}
                      >
                        {name}
                      </span>
                    </div>
                    {/* Pink progress bar */}
                    <div
                      className="w-full h-1 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,107,157,0.12)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${level * 10}%`,
                          background: 'linear-gradient(90deg, #FF6B9D, #9B59B6)',
                          boxShadow: '0 0 6px rgba(255,107,157,0.4)',
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,107,157,0.1)' }}>
              <a
                href="#projects"
                className="pointer-events-auto inline-flex items-center gap-2 text-xs font-semibold"
                style={{ color: 'var(--bocchi-pink)', fontFamily: 'var(--font-caveat)', fontSize: '1rem' }}
              >
                see my work ✦
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>

            {/* Decorative note */}
            <span
              className="absolute -bottom-2 -left-4 text-2xl opacity-20 select-none pointer-events-none"
              style={{ color: 'var(--bocchi-pink)' }}
            >
              ♫
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

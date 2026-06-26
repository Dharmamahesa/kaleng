'use client'

import React from 'react'
import { motion, MotionValue, useTransform } from 'framer-motion'

interface OverlayProps {
  scrollYProgress: MotionValue<number>
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  // ---- Hero section (0% - 15%) ----
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.05])
  const heroBlur = useTransform(scrollYProgress, [0.08, 0.15], ['blur(0px)', 'blur(8px)'])

  // ---- Left panel (25% - 50%) ----
  const leftOpacity = useTransform(scrollYProgress, [0.18, 0.28, 0.48, 0.55], [0, 1, 1, 0])
  const leftX = useTransform(scrollYProgress, [0.18, 0.28], [-40, 0])

  // ---- Right panel (55% - 85%) ----
  const rightOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.82, 0.9], [0, 1, 1, 0])
  const rightX = useTransform(scrollYProgress, [0.55, 0.65], [40, 0])

  // ---- Scroll indicator ----
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="w-full h-full relative">
        
        {/* ====== HERO: Brand & Tagline ====== */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, filter: heroBlur }}
          className="absolute inset-0 flex flex-col items-center justify-between py-20 md:py-24 px-5"
        >
          {/* Top text cluster */}
          <div className="text-center mt-4 md:mt-2">
            {/* Brand badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-3 md:mb-4"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs text-copper-light font-medium tracking-[0.15em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-copper animate-pulse" />
                Premium Canned Coffee
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-cream tracking-tighter drop-shadow-2xl"
            >
              KOPI JALES
            </motion.h1>
          </div>

          {/* Bottom text cluster - below the can */}
          <div className="text-center mb-8 md:mb-12">
            {/* Product name */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-xl sm:text-2xl md:text-3xl font-light tracking-wider drop-shadow-lg mb-2 md:mb-3"
              style={{ color: 'rgba(200, 135, 92, 0.9)' }}
            >
              Cinnamon Latte
            </motion.p>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-xs md:text-sm text-white/35 max-w-sm mx-auto leading-relaxed"
            >
              Smooth cold brew infused with Ceylon cinnamon. 300ml of pure indulgence.
            </motion.p>
          </div>
        </motion.div>

        {/* ====== Scroll indicator ====== */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] md:text-[10px] text-white/25 uppercase tracking-[0.2em] font-medium">Scroll</span>
          <div className="w-4 h-7 md:w-5 md:h-8 rounded-full border border-white/15 flex items-start justify-center p-1">
            <div className="w-0.5 h-1.5 rounded-full bg-copper-light/60 animate-scroll-hint" />
          </div>
        </motion.div>

        {/* ====== LEFT PANEL: Story ====== */}
        <motion.div 
          style={{ opacity: leftOpacity, x: leftX }}
          className="absolute left-4 md:left-12 lg:left-20 top-1/2 -translate-y-1/2 max-w-xs md:max-w-sm"
        >
          <div className="glass-light p-5 md:p-7 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/40">
            <span className="inline-block text-copper text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase mb-2.5">
              Our Story
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-cream mb-3 tracking-tight leading-tight">
              Brewed with{' '}
              <span className="bg-gradient-to-r from-copper-light to-gold bg-clip-text text-transparent">
                Passion
              </span>
            </h2>
            <p className="text-xs md:text-sm text-white/45 leading-relaxed">
              Each can is cold-brewed for 18 hours using single-origin Indonesian Arabica beans, 
              then perfectly blended with authentic Ceylon cinnamon and creamy milk.
            </p>
            {/* Stats row */}
            <div className="flex gap-5 mt-5 pt-4 border-t border-white/5">
              <div>
                <p className="text-lg md:text-xl font-bold text-copper-light">18h</p>
                <p className="text-[9px] md:text-[10px] text-white/25 uppercase tracking-wider">Cold Brew</p>
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold text-copper-light">300ml</p>
                <p className="text-[9px] md:text-[10px] text-white/25 uppercase tracking-wider">Per Can</p>
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold text-copper-light">100%</p>
                <p className="text-[9px] md:text-[10px] text-white/25 uppercase tracking-wider">Arabica</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ====== RIGHT PANEL: Experience ====== */}
        <motion.div 
          style={{ opacity: rightOpacity, x: rightX }}
          className="absolute right-4 md:right-12 lg:right-20 top-1/2 -translate-y-1/2 max-w-xs md:max-w-sm flex flex-col items-end"
        >
          <div className="glass-light p-5 md:p-7 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/40 text-left md:text-right">
            <span className="inline-block text-copper text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase mb-2.5">
              The Experience
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-cream mb-3 tracking-tight leading-tight">
              Taste the{' '}
              <span className="bg-gradient-to-r from-gold to-copper-light bg-clip-text text-transparent">
                Difference
              </span>
            </h2>
            <p className="text-xs md:text-sm text-white/45 leading-relaxed">
              The warm spice of cinnamon meets velvety smooth cold brew in every sip. 
              No artificial flavors — just pure, premium coffee crafted for the modern connoisseur.
            </p>
            {/* CTA Button */}
            <div className="mt-5 pt-4 border-t border-white/5 flex md:justify-end">
              <a 
                href="#features" 
                className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-copper to-copper-dark text-white text-xs md:text-sm font-semibold shadow-lg shadow-copper/20 hover:shadow-copper/40 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Discover More
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

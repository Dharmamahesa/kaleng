'use client'

import React from 'react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
      </svg>
    ),
    title: 'Premium Arabica',
    description: 'Sourced from the finest single-origin Arabica beans, carefully selected from the highlands of Indonesia.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'Cold Brew Process',
    description: 'Slow-steeped for 18 hours at low temperature, extracting smooth flavors without bitterness.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8l4 4-4 4"/>
        <path d="M3 12h18"/>
        <path d="M7 16l-4-4 4-4"/>
      </svg>
    ),
    title: 'Ceylon Cinnamon',
    description: 'Infused with authentic Ceylon cinnamon for a warm, aromatic spice that complements the rich coffee flavor.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M12 8v8"/>
        <path d="M8 12h8"/>
      </svg>
    ),
    title: '300ml Premium Can',
    description: 'Perfectly portioned in a sleek 300ml aluminum can. Keep it chilled and enjoy anytime, anywhere.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 px-5 md:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-background to-navy pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-copper/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block text-copper text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            What Makes Us Special
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-cream tracking-tight mb-5">
            Crafted to{' '}
            <span className="bg-gradient-to-r from-copper-light to-copper bg-clip-text text-transparent">
              Perfection
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
            Every can of Kopi Jales Cinnamon Latte is a masterpiece of flavor, 
            quality, and craftsmanship.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group relative p-6 md:p-8 rounded-2xl md:rounded-3xl glass-light hover:bg-white/[0.06] transition-all duration-500 cursor-default"
            >
              {/* Icon */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-copper/20 to-copper-dark/20 border border-copper/10 flex items-center justify-center text-copper-light mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-copper/10 transition-all duration-500">
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold text-cream mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-white/40 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-white/0 group-hover:ring-copper/20 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

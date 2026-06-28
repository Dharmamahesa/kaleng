'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'home', href: '#home' },
  { label: 'about', href: '#home' },
  { label: 'skills', href: '#skills' },
  { label: 'projects', href: '#projects' },
  { label: 'contact', href: '#contact' },
]

// Guitar pick logo shape
const PickLogo = () => (
  <svg width="22" height="26" viewBox="0 0 30 36" fill="none">
    <defs>
      <linearGradient id="pickGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f4a7b9" />
        <stop offset="100%" stopColor="#8b6f9e" />
      </linearGradient>
    </defs>
    <path
      d="M15 2C8 2 2 8 2 15C2 22 8 30 15 34C22 30 28 22 28 15C28 8 22 2 15 2Z"
      fill="url(#pickGrad)"
    />
    <circle cx="15" cy="15" r="3" fill="rgba(255,255,255,0.4)" />
  </svg>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'glass-bocchi shadow-xl' : 'bg-transparent'
        }`}
        style={scrolled ? { boxShadow: '0 4px 32px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(244,167,185,0.1)' } : {}}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16 md:h-20">
          
          {/* ── Logo ── */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="group-hover:scale-110 transition-transform duration-300">
              <PickLogo />
            </div>
            <span
              className="text-xl md:text-2xl font-bold group-hover:text-glow-pink transition-all duration-300"
              style={{ fontFamily: 'var(--font-caveat)', color: '#fde8ef' }}
            >
              bocchi
              <span style={{ color: '#f4a7b9' }}>.</span>
            </span>
          </a>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:text-bocchi-pink-light group"
                style={{ color: 'rgba(245,240,248,0.55)', fontFamily: 'var(--font-outfit)' }}
              >
                {link.label}
                {/* Underline accent */}
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px rounded-full transition-all duration-300 group-hover:w-4"
                  style={{ background: '#f4a7b9' }}
                />
              </a>
            ))}

            {/* CTA */}
            <a
              href="#contact"
              id="nav-cta"
              className="ml-3 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                fontFamily: 'var(--font-caveat)',
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #c9748a, #8b6f9e)',
                color: '#fde8ef',
                boxShadow: '0 4px 20px rgba(201,116,138,0.25)',
              }}
            >
              say hi~ ✦
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
            style={{ background: mobileOpen ? 'rgba(244,167,185,0.1)' : 'transparent' }}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className="block h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: '#f4a7b9',
                  transform: mobileOpen ? 'rotate(45deg) translate(0, 8px)' : 'none',
                }}
              />
              <span
                className="block h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: '#f4a7b9',
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? 'scaleX(0)' : 'none',
                }}
              />
              <span
                className="block h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: '#f4a7b9',
                  transform: mobileOpen ? 'rotate(-45deg) translate(0, -8px)' : 'none',
                }}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: 'rgba(18,15,24,0.7)' }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Side panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 h-full w-72 flex flex-col pt-24 px-6"
              style={{ background: 'rgba(26,21,32,0.97)', borderLeft: '1px solid rgba(244,167,185,0.1)' }}
            >
              {/* Decorative pick */}
              <div className="absolute top-16 right-6 opacity-20">
                <PickLogo />
              </div>

              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href + link.label + 'm'}
                  href={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  onClick={() => setMobileOpen(false)}
                  className="py-4 text-lg font-medium border-b transition-colors"
                  style={{
                    fontFamily: 'var(--font-caveat)',
                    color: 'rgba(245,240,248,0.7)',
                    borderColor: 'rgba(244,167,185,0.07)',
                  }}
                >
                  <span style={{ color: 'rgba(244,167,185,0.4)', marginRight: 8 }}>✦</span>
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                onClick={() => setMobileOpen(false)}
                className="mt-8 text-center py-3 rounded-xl font-semibold text-lg"
                style={{
                  fontFamily: 'var(--font-caveat)',
                  background: 'linear-gradient(135deg, #c9748a, #8b6f9e)',
                  color: '#fde8ef',
                }}
              >
                say hi~ ✦
              </motion.a>

              {/* Bottom note */}
              <p
                className="absolute bottom-8 left-0 right-0 text-center text-sm"
                style={{ fontFamily: 'var(--font-caveat)', color: 'rgba(244,167,185,0.2)' }}
              >
                ♪ kessoku band forever ♪
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import React from 'react'

const footerLinks = ['home', 'projects', 'skills', 'contact']
const socialLinks = [
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Spotify',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 01-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.622.622 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.13-9.965-1.166a.78.78 0 01-.973-.516.781.781 0 01.516-.973c3.632-1.102 8.147-.568 11.237 1.327a.78.78 0 01.257 1.07zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 11-.543-1.794c3.516-1.066 9.333-.86 13.006 1.34a.937.937 0 01-.946 1.611z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #120f18 0%, #0e0b14 100%)',
        borderTop: '1px solid rgba(244,167,185,0.08)',
      }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(244,167,185,0.4), rgba(139,111,158,0.4), transparent)' }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(201,116,138,0.04) 0%, transparent 70%)' }}
      />

      {/* Stars decoration */}
      {['top-8 left-[10%]', 'top-12 right-[8%]', 'top-20 left-[35%]', 'top-6 right-[30%]'].map((pos, i) => (
        <span
          key={i}
          className={`absolute ${pos} select-none pointer-events-none animate-star-float`}
          style={{
            color: i % 2 === 0 ? 'rgba(244,167,185,0.15)' : 'rgba(139,111,158,0.12)',
            fontSize: i % 3 === 0 ? '0.9rem' : '0.65rem',
            animationDelay: `${i * 0.6}s`,
          }}
        >
          ✦
        </span>
      ))}

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* ── Brand ── */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              {/* Guitar pick logo */}
              <svg width="20" height="24" viewBox="0 0 30 36" fill="none">
                <defs>
                  <linearGradient id="footerPickGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f4a7b9" />
                    <stop offset="100%" stopColor="#8b6f9e" />
                  </linearGradient>
                </defs>
                <path d="M15 2C8 2 2 8 2 15C2 22 8 30 15 34C22 30 28 22 28 15C28 8 22 2 15 2Z" fill="url(#footerPickGrad)" />
                <circle cx="15" cy="15" r="3" fill="rgba(255,255,255,0.3)" />
              </svg>
              <span
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-caveat)', color: '#fde8ef' }}
              >
                bocchi<span style={{ color: '#f4a7b9' }}>.</span>
              </span>
            </div>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: 'rgba(245,240,248,0.35)', fontFamily: 'var(--font-outfit)' }}
            >
              a shy developer&apos;s corner of the internet. building interfaces, 
              writing code, and playing guitar (badly, but with heart).
            </p>
            <p
              className="mt-4 text-sm"
              style={{ fontFamily: 'var(--font-caveat)', color: 'rgba(244,167,185,0.4)', fontSize: '1.05rem' }}
            >
              made with 🎸 and lots of anxiety
            </p>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-5"
              style={{ color: '#f4a7b9', fontFamily: 'var(--font-outfit)' }}
            >
              navigate
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item}`}
                    className="text-sm inline-flex items-center gap-2 group transition-colors duration-300"
                    style={{ color: 'rgba(245,240,248,0.4)', fontFamily: 'var(--font-outfit)' }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-150"
                      style={{ background: 'rgba(244,167,185,0.3)' }}
                    />
                    <span className="group-hover:text-bocchi-pink transition-colors">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact + Social ── */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-5"
              style={{ color: '#f4a7b9', fontFamily: 'var(--font-outfit)' }}
            >
              find me
            </h4>
            <ul className="space-y-2.5 mb-6">
              <li className="text-sm" style={{ color: 'rgba(245,240,248,0.4)', fontFamily: 'var(--font-outfit)' }}>
                <span style={{ color: 'rgba(244,167,185,0.4)' }}>email: </span>
                <a href="mailto:bocchi@kessoku.band" className="hover:text-bocchi-pink transition-colors">
                  bocchi@kessoku.band
                </a>
              </li>
              <li className="text-sm" style={{ color: 'rgba(245,240,248,0.4)', fontFamily: 'var(--font-outfit)' }}>
                <span style={{ color: 'rgba(244,167,185,0.4)' }}>based in: </span>
                shibuya, tokyo ♪
              </li>
              <li className="text-sm" style={{ color: 'rgba(245,240,248,0.4)', fontFamily: 'var(--font-outfit)' }}>
                <span style={{ color: 'rgba(244,167,185,0.4)' }}>status: </span>
                <span style={{ color: 'rgba(139,111,158,0.8)' }}>✦ open to work</span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 group"
                  style={{
                    background: 'rgba(244,167,185,0.04)',
                    borderColor: 'rgba(244,167,185,0.1)',
                    color: 'rgba(245,240,248,0.4)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(244,167,185,0.12)'
                    el.style.borderColor = 'rgba(244,167,185,0.3)'
                    el.style.color = '#f4a7b9'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(244,167,185,0.04)'
                    el.style.borderColor = 'rgba(244,167,185,0.1)'
                    el.style.color = 'rgba(245,240,248,0.4)'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3"
          style={{ borderTop: '1px solid rgba(244,167,185,0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(245,240,248,0.2)', fontFamily: 'var(--font-outfit)' }}>
            © 2026 bocchi.portfolio — all rights reserved (i think)
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: 'var(--font-caveat)', color: 'rgba(244,167,185,0.2)', fontSize: '0.95rem' }}
          >
            ♪ distortion!!! — kessoku band ♪
          </p>
        </div>
      </div>
    </footer>
  )
}

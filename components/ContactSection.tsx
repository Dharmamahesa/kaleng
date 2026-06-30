'use client'

import React, { useEffect, useRef, useState } from 'react'

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/Dharmamahesa',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'Twitter/X',
    href: 'https://twitter.com',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Spotify',
    href: 'https://open.spotify.com',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
]

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // AOS-style scroll reveal with IntersectionObserver
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    el.querySelectorAll('[data-reveal]').forEach((c) => obs.observe(c))
    return () => obs.disconnect()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Visual-only submit — no backend
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 px-5 grain-overlay bokeh-bg overflow-hidden"
      style={{ background: 'var(--bocchi-dark)' }}
    >
      {/* Star field */}
      <div className="star-field" />

      {/* Section header */}
      <div
        data-reveal
        className="reveal-item text-center mb-16"
      >
        <span className="washi-tape mb-4 inline-block">✦ get in touch ✦</span>
        <h2
          className="text-5xl md:text-7xl font-bold mt-4 text-glow-pink"
          style={{ fontFamily: 'var(--font-caveat)', color: 'var(--bocchi-cream)' }}
        >
          say hi~
          <span style={{ color: 'var(--bocchi-pink)' }}> ✦</span>
        </h2>
        <p
          className="mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed"
          style={{
            color: 'rgba(255,245,248,0.4)',
            fontFamily: 'var(--font-klee, var(--font-outfit))',
          }}
        >
          I&apos;m shy but I promise I read every message...
          <br />
          (it might take me a while to respond though)
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact form */}
        <div
          data-reveal
          className="reveal-item glass-bocchi-card rounded-3xl p-7 md:p-9 relative overflow-hidden"
        >
          {/* Decorative washi */}
          <div
            className="absolute top-0 left-6 washi-tape-purple"
            style={{ transform: 'rotate(-1.5deg)' }}
          >
            message me~
          </div>

          {sent ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
              <span className="text-5xl animate-float-gentle">✉️</span>
              <p
                className="text-2xl text-glow-pink"
                style={{ fontFamily: 'var(--font-caveat)', color: 'var(--bocchi-pink)' }}
              >
                Message sent! ✦
              </p>
              <p
                className="text-sm text-center"
                style={{ color: 'rgba(255,245,248,0.4)' }}
              >
                I&apos;ll respond when I gather enough courage...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {[
                { id: 'name', label: 'Your Name', type: 'text', placeholder: 'hitori goto' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'bocchi@kessoku.band' },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="block text-xs uppercase tracking-widest mb-1.5"
                    style={{ color: 'rgba(255,107,157,0.5)', fontFamily: 'var(--font-outfit)' }}
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    value={form[id as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255,107,157,0.06)',
                      border: '1px solid rgba(255,107,157,0.18)',
                      color: 'var(--bocchi-cream)',
                      fontFamily: 'var(--font-outfit)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(255,107,157,0.5)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(255,107,157,0.08)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,107,157,0.18)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs uppercase tracking-widest mb-1.5"
                  style={{ color: 'rgba(255,107,157,0.5)', fontFamily: 'var(--font-outfit)' }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Um... I wanted to say..."
                  rows={4}
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,107,157,0.06)',
                    border: '1px solid rgba(255,107,157,0.18)',
                    color: 'var(--bocchi-cream)',
                    fontFamily: 'var(--font-outfit)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,107,157,0.5)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(255,107,157,0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,107,157,0.18)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #FF6B9D, #9B59B6)',
                  color: '#FFF5F8',
                  fontFamily: 'var(--font-caveat)',
                  fontSize: '1.1rem',
                  boxShadow: '0 0 0 rgba(255,107,157,0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255,107,157,0.4), 0 0 40px rgba(255,107,157,0.15)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 rgba(255,107,157,0)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                send it~ ✦
              </button>
            </form>
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-col gap-6">
          {/* Contact cards */}
          {[
            {
              icon: '📧',
              label: 'Email',
              value: 'dharmamahesa18@gmail.com',
              delay: '0.1s',
            },
            {
              icon: '📍',
              label: 'Location',
              value: 'Paskot, jatim',
              delay: '0.2s',
            },
            {
              icon: '🎸',
              label: 'Available For',
              value: 'Freelance · Collabs · ngopi',
              delay: '0.3s',
            },
          ].map(({ icon, label, value, delay }) => (
            <div
              key={label}
              data-reveal
              className="reveal-item glass-bocchi p-5 rounded-2xl flex items-center gap-4"
              style={{ transitionDelay: delay }}
            >
              <span className="text-2xl">{icon}</span>
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest mb-0.5"
                  style={{ color: 'rgba(255,107,157,0.45)', fontFamily: 'var(--font-outfit)' }}
                >
                  {label}
                </p>
                <p
                  className="text-sm"
                  style={{ color: 'var(--bocchi-cream)', fontFamily: 'var(--font-outfit)' }}
                >
                  {value}
                </p>
              </div>
            </div>
          ))}

          {/* Social links */}
          <div
            data-reveal
            className="reveal-item glass-bocchi p-5 rounded-2xl"
            style={{ transitionDelay: '0.4s' }}
          >
            <p
              className="text-[10px] uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,107,157,0.45)', fontFamily: 'var(--font-outfit)' }}
            >
              Find Me Online
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300"
                  style={{
                    background: 'rgba(255,107,157,0.08)',
                    border: '1px solid rgba(255,107,157,0.2)',
                    color: 'rgba(255,245,248,0.6)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,107,157,0.18)'
                    e.currentTarget.style.borderColor = 'rgba(255,107,157,0.5)'
                    e.currentTarget.style.color = '#FF6B9D'
                    e.currentTarget.style.boxShadow = '0 0 14px rgba(255,107,157,0.25)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,107,157,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,107,157,0.2)'
                    e.currentTarget.style.color = 'rgba(255,245,248,0.6)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Cute closing note */}
          <div
            data-reveal
            className="reveal-item text-center py-4"
            style={{ transitionDelay: '0.5s' }}
          >
            <p
              className="text-lg"
              style={{ fontFamily: 'var(--font-caveat)', color: 'rgba(255,107,157,0.5)' }}
            >
              ♪ let&apos;s make something beautiful together ♪
            </p>
          </div>
        </div>
      </div>

      {/* Inline styles for reveal animation */}
      <style jsx>{`
        .reveal-item {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal-item.in-view {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  )
}

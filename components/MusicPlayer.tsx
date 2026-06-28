'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SONG_TITLE = 'Distortion!!! — KESSOKU BAND · Guitar · Bocchi the Rock!'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div
      className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-2"
      style={{ fontFamily: 'var(--font-outfit)' }}
    >
      {/* ── Expanded cassette player ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-bocchi rounded-2xl overflow-hidden"
            style={{
              width: '240px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,157,0.15)',
            }}
          >
            {/* ── Cassette body ── */}
            <div className="p-4">
              {/* Header label */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,107,157,0.4)' }}>
                  now playing
                </span>
                <span className="text-[9px]" style={{ color: 'rgba(255,107,157,0.25)' }}>
                  {isPlaying ? '▶ live' : '⏸ paused'}
                </span>
              </div>

              {/* Cassette visual */}
              <div
                className="relative rounded-xl p-3 mb-3"
                style={{
                  background: 'linear-gradient(135deg, #2d1f3d, #1e1530)',
                  border: '1px solid rgba(244,167,185,0.12)',
                }}
              >
                {/* Tape window */}
                <div
                  className="relative mx-auto rounded-lg overflow-hidden flex items-center justify-center"
                  style={{
                    width: '100%',
                    height: '52px',
                    background: 'rgba(10,8,16,0.8)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Left reel */}
                  <div className="absolute left-6">
                    <div
                      className="relative w-9 h-9 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: 'rgba(255,107,157,0.25)',
                        background: 'rgba(255,107,157,0.05)',
                        animation: isPlaying ? 'cassette-spin 2s linear infinite' : 'none',
                      }}
                    >
                      {/* Spokes */}
                      {[0, 60, 120].map((deg) => (
                        <div
                          key={deg}
                          className="absolute w-0.5 h-3 rounded-full"
                          style={{
                            background: 'rgba(255,107,157,0.3)',
                            transformOrigin: 'bottom center',
                            transform: `rotate(${deg}deg) translateX(-50%)`,
                            left: '50%',
                            top: '2px',
                          }}
                        />
                      ))}
                      {/* Hub */}
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: 'rgba(255,107,157,0.4)' }}
                      />
                    </div>
                  </div>

                  {/* Tape ribbon */}
                  <div className="flex-1 mx-12 h-1.5 rounded-full" style={{ background: 'rgba(155,89,182,0.3)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #FF6B9D, #9B59B6)',
                        boxShadow: '0 0 6px rgba(255,107,157,0.5)',
                        width: isPlaying ? '60%' : '30%',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>

                  {/* Right reel */}
                  <div className="absolute right-6">
                    <div
                      className="relative w-9 h-9 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: 'rgba(176,154,199,0.25)',
                        background: 'rgba(176,154,199,0.05)',
                        animation: isPlaying ? 'cassette-spin 3s linear infinite reverse' : 'none',
                      }}
                    >
                      {[0, 60, 120].map((deg) => (
                        <div
                          key={deg}
                          className="absolute w-0.5 h-3 rounded-full"
                          style={{
                            background: 'rgba(176,154,199,0.3)',
                            transformOrigin: 'bottom center',
                            transform: `rotate(${deg}deg) translateX(-50%)`,
                            left: '50%',
                            top: '2px',
                          }}
                        />
                      ))}
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: 'rgba(176,154,199,0.4)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Label strip */}
                <div
                  className="mt-2 px-2 py-1 rounded-lg text-center"
                  style={{ background: 'rgba(244,167,185,0.08)', border: '1px solid rgba(244,167,185,0.1)' }}
                >
                  <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(244,167,185,0.5)' }}>
                    KESSOKU BAND
                  </p>
                </div>
              </div>

              {/* Song title marquee */}
              <div
                className="rounded-lg overflow-hidden mb-3"
                style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 8px' }}
              >
                <div className="overflow-hidden whitespace-nowrap">
                  <span
                    className={isPlaying ? 'animate-marquee inline-block' : 'inline-block'}
                    style={{
                      fontSize: '10px',
                      color: 'rgba(244,167,185,0.7)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {isPlaying ? `${SONG_TITLE}　　　${SONG_TITLE}` : SONG_TITLE}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {/* Rewind */}
                <button
                  className="text-sm transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{ color: 'rgba(244,167,185,0.4)' }}
                  aria-label="Rewind"
                >
                  ⏮
                </button>

                {/* Play / Pause */}
                <button
                  id="music-play-toggle"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                  style={{
                    background: isPlaying
                      ? 'linear-gradient(135deg, #FF6B9D, #9B59B6)'
                      : 'rgba(255,107,157,0.12)',
                    border: '1px solid rgba(255,107,157,0.35)',
                    boxShadow: isPlaying ? '0 0 20px rgba(255,107,157,0.4)' : 'none',
                  }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <span style={{ color: '#fde8ef', fontSize: '14px' }}>
                    {isPlaying ? '⏸' : '▶'}
                  </span>
                </button>

                {/* Forward */}
                <button
                  className="text-sm transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{ color: 'rgba(244,167,185,0.4)' }}
                  aria-label="Forward"
                >
                  ⏭
                </button>
              </div>
            </div>

            {/* Bottom note */}
            <div
              className="px-4 py-2 text-center"
              style={{ borderTop: '1px solid rgba(244,167,185,0.07)', background: 'rgba(0,0,0,0.2)' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: '0.8rem',
                  color: 'rgba(244,167,185,0.25)',
                }}
              >
                {isPlaying ? '♪ playing in your heart~' : '♪ drop a .mp3 to enable audio'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating toggle button ── */}
      <motion.button
        id="music-player-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
        style={{
          background: isExpanded
            ? 'linear-gradient(135deg, #FF6B9D, #9B59B6)'
            : 'rgba(26,10,46,0.88)',
          border: '1px solid rgba(255,107,157,0.22)',
          backdropFilter: 'blur(12px)',
          boxShadow: isExpanded
            ? '0 4px 24px rgba(255,107,157,0.35)'
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
        aria-label="Toggle music player"
      >
        {/* Cassette icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isExpanded ? '#fde8ef' : '#f4a7b9' }}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="8" cy="12" r="2" />
          <circle cx="16" cy="12" r="2" />
          <path d="M10 12h4" />
        </svg>

        {/* Playing pulse ring */}
        {isPlaying && (
          <span
            className="absolute inset-0 rounded-xl animate-glow-pulse pointer-events-none"
            style={{ boxShadow: '0 0 0 2px rgba(244,167,185,0.3)', background: 'transparent' }}
          />
        )}
      </motion.button>
    </div>
  )
}

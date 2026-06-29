'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Overlay from './Overlay'

const TOTAL_FRAMES = 293
const CHUNK_SIZE   = 30
const LERP_FACTOR  = 0.12

// px scrolled per rAF tick during auto-scroll (≈60fps → ~90px/s = ~55s full traverse)
const AUTO_SCROLL_SPEED = 1.5

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)

  const imagesRef       = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null))
  const loadedChunksRef = useRef<Set<number>>(new Set())
  const rafRef          = useRef<number | null>(null)

  const targetFrameRef  = useRef<number>(0)
  const displayFrameRef = useRef<number>(0)
  const canvasSizeRef   = useRef({ w: 0, h: 0, dpr: 1 })

  // Auto-scroll state
  const autoScrollRef        = useRef<boolean>(false)
  const autoScrollRafRef     = useRef<number | null>(null)
  const userScrolledRef      = useRef<boolean>(false)   // flag: user touched scroll manually
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const [scrollProgress, setScrollProgress]   = useState(0) // 0–1 for progress arc

  const [firstChunkReady, setFirstChunkReady] = useState(false)
  const [loadProgress, setLoadProgress]       = useState(0)

  /* ─── Frame path ─────────────────────────────────────── */
  const getFramePath = (i: number) =>
    `/sequence/frame_${String(i).padStart(3, '0')}.webp`

  /* ─── Canvas resize ──────────────────────────────────── */
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w   = window.innerWidth
    const h   = window.innerHeight
    const sz  = canvasSizeRef.current
    if (sz.w === w && sz.h === h && sz.dpr === dpr) return
    canvas.width  = w * dpr
    canvas.height = h * dpr
    canvas.style.width  = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)
    canvasSizeRef.current = { w, h, dpr }
  }, [])

  /* ─── Draw with cross-frame alpha blend ─────────────── */
  const drawBlended = useCallback(
    (imgA: HTMLImageElement, imgB: HTMLImageElement | null, alpha: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      syncCanvasSize()
      const { w, h } = canvasSizeRef.current
      const iR = imgA.naturalWidth / imgA.naturalHeight
      const vR = w / h
      let dW: number, dH: number, dX: number, dY: number
      if (vR > iR) {
        dW = w;  dH = w / iR; dX = 0;            dY = (h - dH) / 2
      } else {
        dH = h;  dW = h * iR; dX = (w - dW) / 2; dY = 0
      }
      ctx.fillStyle = '#1a1520'
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1
      ctx.drawImage(imgA, dX, dY, dW, dH)
      if (imgB?.complete && alpha > 0.01) {
        ctx.globalAlpha = alpha
        ctx.drawImage(imgB, dX, dY, dW, dH)
        ctx.globalAlpha = 1
      }
    },
    [syncCanvasSize]
  )

  /* ─── rAF render loop (lerp + blend) ────────────────── */
  const renderLoop = useCallback(() => {
    rafRef.current = requestAnimationFrame(renderLoop)
    const target  = targetFrameRef.current
    const current = displayFrameRef.current
    const delta   = target - current
    if (Math.abs(delta) < 0.02) {
      if (Math.abs(delta) > 0) {
        displayFrameRef.current = target
        const imgA = imagesRef.current[Math.round(target)]
        if (imgA?.complete) drawBlended(imgA, null, 0)
      }
      return
    }
    const next     = current + delta * LERP_FACTOR
    displayFrameRef.current = next
    const floorIdx = Math.floor(next)
    const ceilIdx  = Math.min(floorIdx + 1, TOTAL_FRAMES - 1)
    const alpha    = next - floorIdx
    const imgA     = imagesRef.current[Math.max(0, floorIdx)]
    const imgB     = imagesRef.current[ceilIdx]
    if (imgA?.complete) drawBlended(imgA, imgB ?? null, alpha)
  }, [drawBlended])

  /* ─── Chunk loader ───────────────────────────────────── */
  const loadChunk = useCallback((chunkIndex: number) => {
    if (loadedChunksRef.current.has(chunkIndex)) return
    loadedChunksRef.current.add(chunkIndex)
    const start = chunkIndex * CHUNK_SIZE
    const end   = Math.min(start + CHUNK_SIZE, TOTAL_FRAMES)
    for (let i = start; i < end; i++) {
      if (imagesRef.current[i]) continue
      const img      = new Image()
      img.src        = getFramePath(i)
      const frameIdx = i
      img.onload = () => {
        imagesRef.current[frameIdx] = img
        const totalLoaded = imagesRef.current.filter(Boolean).length
        setLoadProgress(Math.round((totalLoaded / TOTAL_FRAMES) * 100))
        if (chunkIndex === 0 && !loadedChunksRef.current.has(-1)) {
          if (totalLoaded >= CHUNK_SIZE) {
            loadedChunksRef.current.add(-1)
            setFirstChunkReady(true)
          }
        }
      }
    }
  }, [])

  /* ─── Auto-scroll loop ───────────────────────────────── */
  const stopAutoScroll = useCallback(() => {
    autoScrollRef.current = false
    setIsAutoScrolling(false)
    if (autoScrollRafRef.current) {
      cancelAnimationFrame(autoScrollRafRef.current)
      autoScrollRafRef.current = null
    }
  }, [])

  const runAutoScroll = useCallback(() => {
    if (!autoScrollRef.current) return
    const container = containerRef.current
    if (!container) return

    const containerTop    = container.offsetTop
    const containerHeight = container.offsetHeight
    const viewportHeight  = window.innerHeight
    const maxScroll       = containerTop + containerHeight - viewportHeight
    const currentScroll   = window.scrollY

    // Update progress arc
    const progress = Math.max(0, (currentScroll - containerTop) / (containerHeight - viewportHeight))
    setScrollProgress(Math.min(1, progress))

    // Stop at bottom of section
    if (currentScroll >= maxScroll) {
      stopAutoScroll()
      return
    }

    window.scrollBy({ top: AUTO_SCROLL_SPEED, behavior: 'instant' })
    autoScrollRafRef.current = requestAnimationFrame(runAutoScroll)
  }, [stopAutoScroll])

  const toggleAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      stopAutoScroll()
    } else {
      // If at bottom, jump back to section start first
      const container = containerRef.current
      if (container) {
        const containerTop    = container.offsetTop
        const containerHeight = container.offsetHeight
        const viewportHeight  = window.innerHeight
        const maxScroll       = containerTop + containerHeight - viewportHeight
        if (window.scrollY >= maxScroll - 20) {
          window.scrollTo({ top: containerTop, behavior: 'smooth' })
          setTimeout(() => {
            autoScrollRef.current = true
            setIsAutoScrolling(true)
            userScrolledRef.current = false
            autoScrollRafRef.current = requestAnimationFrame(runAutoScroll)
          }, 600)
          return
        }
      }
      autoScrollRef.current = true
      setIsAutoScrolling(true)
      userScrolledRef.current = false
      autoScrollRafRef.current = requestAnimationFrame(runAutoScroll)
    }
  }, [stopAutoScroll, runAutoScroll])

  /* ─── Stop on manual wheel / touch ──────────────────── */
  useEffect(() => {
    const onManualScroll = () => {
      if (autoScrollRef.current) {
        userScrolledRef.current = true
        stopAutoScroll()
      }
    }
    window.addEventListener('wheel',      onManualScroll, { passive: true })
    window.addEventListener('touchstart', onManualScroll, { passive: true })
    window.addEventListener('keydown',    onManualScroll)
    return () => {
      window.removeEventListener('wheel',      onManualScroll)
      window.removeEventListener('touchstart', onManualScroll)
      window.removeEventListener('keydown',    onManualScroll)
    }
  }, [stopAutoScroll])

  /* ─── Bootstrap ──────────────────────────────────────── */
  useEffect(() => {
    syncCanvasSize()
    loadChunk(0)
    rafRef.current = requestAnimationFrame(renderLoop)
    return () => {
      if (rafRef.current)        cancelAnimationFrame(rafRef.current)
      if (autoScrollRafRef.current) cancelAnimationFrame(autoScrollRafRef.current)
    }
  }, [loadChunk, renderLoop, syncCanvasSize])

  useEffect(() => {
    const onResize = () => { canvasSizeRef.current = { w: 0, h: 0, dpr: 1 } }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ─── Scroll → target frame ──────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1])

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, latest))
    targetFrameRef.current = clamped
    setScrollProgress(clamped / (TOTAL_FRAMES - 1))
    const targetChunk = Math.floor(clamped / CHUNK_SIZE)
    loadChunk(targetChunk)
    if (targetChunk + 1 < Math.ceil(TOTAL_FRAMES / CHUNK_SIZE)) loadChunk(targetChunk + 1)
    if (targetChunk + 2 < Math.ceil(TOTAL_FRAMES / CHUNK_SIZE)) loadChunk(targetChunk + 2)
  })

  /* ─── SVG arc progress helper ────────────────────────── */
  const RADIUS = 22
  const CIRC   = 2 * Math.PI * RADIUS
  const arcOffset = CIRC - scrollProgress * CIRC

  /* ─── Render ─────────────────────────────────────────── */
  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full"
      style={{ height: '700vh', background: '#1a1520' }}
    >
      <div
        className="sticky top-0 left-0 w-full h-screen overflow-hidden"
        style={{ background: '#1a1520' }}
      >
        {/* ── Loading Screen ── */}
        {!firstChunkReady && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle 400px at 50% 50%, rgba(244,167,185,0.06) 0%, transparent 70%)',
              }}
            />
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div
                className="w-10 h-12 animate-float-gentle"
                style={{
                  background: 'linear-gradient(135deg, #f4a7b9, #c9748a)',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  boxShadow: '0 0 24px rgba(244,167,185,0.5)',
                }}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-44 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${loadProgress}%`,
                    background: 'linear-gradient(90deg, #c9748a, #f4a7b9)',
                  }}
                />
              </div>
              <p className="text-xs tracking-widest uppercase"
                style={{ color: 'rgba(244,167,185,0.4)', fontFamily: 'var(--font-outfit)' }}>
                loading... {loadProgress}%
              </p>
              <p style={{ color: 'rgba(244,167,185,0.2)', fontFamily: 'var(--font-caveat)', fontSize: '1rem' }}>
                ♪ tuning up~
              </p>
            </div>
          </div>
        )}

        {/* ── Canvas ── */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* ── Vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 25%, rgba(26,21,32,0.55) 100%)',
          }}
        />

        {/* ── Overlay ── */}
        <Overlay scrollYProgress={scrollYProgress} />

        {/* ════════════════════════════════════════
            AUTO-SCROLL BUTTON — bottom center
        ════════════════════════════════════════ */}
        <AnimatePresence>
          {firstChunkReady && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
              {/* Label */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={isAutoScrolling ? 'pause' : 'play'}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: 'rgba(244,167,185,0.45)', fontFamily: 'var(--font-outfit)' }}
                >
                  {isAutoScrolling ? 'pause' : scrollProgress > 0.98 ? 'replay' : 'auto play'}
                </motion.p>
              </AnimatePresence>

              {/* Button with SVG progress arc */}
              <motion.button
                id="auto-scroll-btn"
                onClick={toggleAutoScroll}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                className="relative flex items-center justify-center"
                aria-label={isAutoScrolling ? 'Pause auto scroll' : 'Start auto scroll'}
                style={{ width: 56, height: 56 }}
              >
                {/* SVG ring */}
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 56 56"
                  className="absolute inset-0"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  {/* Track */}
                  <circle
                    cx="28" cy="28" r={RADIUS}
                    fill="none"
                    stroke="rgba(244,167,185,0.12)"
                    strokeWidth="2"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="28" cy="28" r={RADIUS}
                    fill="none"
                    stroke="url(#arcGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    strokeDashoffset={arcOffset}
                    style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                  />
                  <defs>
                    <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f4a7b9" />
                      <stop offset="100%" stopColor="#8b6f9e" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner glass circle */}
                <div
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isAutoScrolling
                      ? 'linear-gradient(135deg, rgba(201,116,138,0.35), rgba(139,111,158,0.35))'
                      : 'rgba(26,21,32,0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(244,167,185,0.2)',
                    boxShadow: isAutoScrolling
                      ? '0 0 20px rgba(244,167,185,0.25)'
                      : '0 4px 16px rgba(0,0,0,0.3)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isAutoScrolling ? (
                      /* Pause icon */
                      <motion.div
                        key="pause"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex gap-0.5"
                      >
                        <span className="w-1 h-3.5 rounded-full" style={{ background: '#f4a7b9' }} />
                        <span className="w-1 h-3.5 rounded-full" style={{ background: '#f4a7b9' }} />
                      </motion.div>
                    ) : scrollProgress > 0.98 ? (
                      /* Replay icon */
                      <motion.div
                        key="replay"
                        initial={{ scale: 0, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f4a7b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1 4 1 10 7 10" />
                          <path d="M3.51 15a9 9 0 1 0 .49-3.83" />
                        </svg>
                      </motion.div>
                    ) : (
                      /* Play icon */
                      <motion.div
                        key="play"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{ marginLeft: 2 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#f4a7b9">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>

              {/* Scroll hint when idle */}
              <AnimatePresence>
                {!isAutoScrolling && scrollProgress < 0.02 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="animate-scroll-bounce text-base select-none"
                    style={{ color: 'rgba(244,167,185,0.3)', marginTop: 2 }}
                  >
                    ♪
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

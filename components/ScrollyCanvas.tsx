'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Overlay from './Overlay'

const TOTAL_FRAMES = 293
const CHUNK_SIZE = 30

// How quickly the displayed frame catches up to the scroll target.
// Lower = smoother/laggier. Higher = snappier. 0.12 feels cinematic.
const LERP_FACTOR = 0.12

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)

  // Stores loaded image elements
  const imagesRef       = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null))
  const loadedChunksRef = useRef<Set<number>>(new Set())
  const rafRef          = useRef<number | null>(null)

  // Scroll target (raw, fractional) — updated on every scroll event
  const targetFrameRef  = useRef<number>(0)
  // Smoothed display value — lerps toward targetFrameRef each rAF tick
  const displayFrameRef = useRef<number>(0)

  // Canvas size cache to avoid unnecessary resize ops
  const canvasSizeRef = useRef({ w: 0, h: 0, dpr: 1 })

  const [firstChunkReady, setFirstChunkReady] = useState(false)
  const [loadProgress, setLoadProgress]       = useState(0)

  /* ─────────────────────────────────────────────────────────
     Frame path helper
  ───────────────────────────────────────────────────────── */
  const getFramePath = (i: number) =>
    `/sequence/frame_${String(i).padStart(3, '0')}.webp`

  /* ─────────────────────────────────────────────────────────
     Resize canvas once if dimensions changed
  ───────────────────────────────────────────────────────── */
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w   = window.innerWidth
    const h   = window.innerHeight
    const sz  = canvasSizeRef.current

    if (sz.w === w && sz.h === h && sz.dpr === dpr) return // no-op

    canvas.width  = w * dpr
    canvas.height = h * dpr
    canvas.style.width  = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)
    canvasSizeRef.current = { w, h, dpr }
  }, [])

  /* ─────────────────────────────────────────────────────────
     Draw two frames blended by `alpha` (0 = frameA only,
     1 = frameB only). This gives smooth sub-frame transitions.
  ───────────────────────────────────────────────────────── */
  const drawBlended = useCallback(
    (imgA: HTMLImageElement, imgB: HTMLImageElement | null, alpha: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      syncCanvasSize()

      const { w, h } = canvasSizeRef.current

      // Compute cover-fit rect (same for all frames — same source dimensions)
      const iR = imgA.naturalWidth / imgA.naturalHeight
      const vR = w / h
      let dW: number, dH: number, dX: number, dY: number
      if (vR > iR) {
        dW = w;  dH = w / iR; dX = 0;           dY = (h - dH) / 2
      } else {
        dH = h;  dW = h * iR; dX = (w - dW) / 2; dY = 0
      }

      // Background
      ctx.fillStyle = '#1a1520'
      ctx.fillRect(0, 0, w, h)

      // Frame A — full opacity
      ctx.globalAlpha = 1
      ctx.drawImage(imgA, dX, dY, dW, dH)

      // Frame B — blended on top only if we have it and alpha > threshold
      if (imgB?.complete && alpha > 0.01) {
        ctx.globalAlpha = alpha
        ctx.drawImage(imgB, dX, dY, dW, dH)
        ctx.globalAlpha = 1
      }
    },
    [syncCanvasSize]
  )

  /* ─────────────────────────────────────────────────────────
     rAF loop — lerp displayFrame → targetFrame every tick,
     draw only when display value actually moved.
  ───────────────────────────────────────────────────────── */
  const renderLoop = useCallback(() => {
    rafRef.current = requestAnimationFrame(renderLoop)

    const target  = targetFrameRef.current
    const current = displayFrameRef.current
    const delta   = target - current

    // Stop updating if close enough (< 0.02 of a frame)
    if (Math.abs(delta) < 0.02) {
      if (Math.abs(delta) > 0) {
        // Snap to exact target on final tick
        displayFrameRef.current = target
        const idx  = Math.round(target)
        const imgA = imagesRef.current[idx]
        if (imgA?.complete) drawBlended(imgA, null, 0)
      }
      return
    }

    // Lerp
    const next = current + delta * LERP_FACTOR
    displayFrameRef.current = next

    // Integer part → frameA, fractional part → blend alpha toward frameB
    const floorIdx = Math.floor(next)
    const ceilIdx  = Math.min(floorIdx + 1, TOTAL_FRAMES - 1)
    const alpha    = next - floorIdx          // 0 … 1 blending weight

    const imgA = imagesRef.current[Math.max(0, floorIdx)]
    const imgB = imagesRef.current[ceilIdx]

    if (imgA?.complete) drawBlended(imgA, imgB ?? null, alpha)
  }, [drawBlended])

  /* ─────────────────────────────────────────────────────────
     Load a chunk of frames progressively
  ───────────────────────────────────────────────────────── */
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

        // Progress tracking
        const totalLoaded = imagesRef.current.filter(Boolean).length
        setLoadProgress(Math.round((totalLoaded / TOTAL_FRAMES) * 100))

        // Unlock canvas after first chunk is ready
        if (chunkIndex === 0 && !loadedChunksRef.current.has(-1)) {
          if (totalLoaded >= CHUNK_SIZE) {
            loadedChunksRef.current.add(-1) // sentinel
            setFirstChunkReady(true)
          }
        }
      }
    }
  }, [])

  /* ─────────────────────────────────────────────────────────
     Bootstrap
  ───────────────────────────────────────────────────────── */
  useEffect(() => {
    syncCanvasSize()
    loadChunk(0)
    rafRef.current = requestAnimationFrame(renderLoop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loadChunk, renderLoop, syncCanvasSize])

  // Resize → re-sync canvas dimensions on next rAF tick
  useEffect(() => {
    const onResize = () => {
      canvasSizeRef.current = { w: 0, h: 0, dpr: 1 } // invalidate cache
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ─────────────────────────────────────────────────────────
     Scroll → target frame (fractional, not rounded)
  ───────────────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Keep fractional precision — do NOT round here
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1])

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, latest))
    targetFrameRef.current = clamped

    // Preload 2 chunks ahead of the target
    const targetChunk = Math.floor(clamped / CHUNK_SIZE)
    loadChunk(targetChunk)
    if (targetChunk + 1 < Math.ceil(TOTAL_FRAMES / CHUNK_SIZE)) loadChunk(targetChunk + 1)
    if (targetChunk + 2 < Math.ceil(TOTAL_FRAMES / CHUNK_SIZE)) loadChunk(targetChunk + 2)
  })

  /* ─────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────── */
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
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: 'rgba(244,167,185,0.4)', fontFamily: 'var(--font-outfit)' }}
              >
                loading... {loadProgress}%
              </p>
              <p
                style={{
                  color: 'rgba(244,167,185,0.2)',
                  fontFamily: 'var(--font-caveat)',
                  fontSize: '1rem',
                }}
              >
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

        {/* ── Overlay text panels ── */}
        <Overlay scrollYProgress={scrollYProgress} />
      </div>
    </section>
  )
}

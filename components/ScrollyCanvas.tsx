'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Overlay from './Overlay'

const TOTAL_FRAMES = 293
const CHUNK_SIZE = 30

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null))
  const loadedChunksRef = useRef<Set<number>>(new Set())
  const rafRef = useRef<number | null>(null)
  const currentFrameRef = useRef<number>(0)
  const isDirtyRef = useRef<boolean>(false)

  const [firstChunkReady, setFirstChunkReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  // ── Helpers ────────────────────────────────────────────
  const getFramePath = (i: number) => {
    const p = String(i).padStart(3, '0')
    return `/sequence/frame_${p}.webp`
  }

  // ── Draw a single frame to canvas (cover-fit) ──────────
  const drawFrame = useCallback((image: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas || !image?.complete) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }

    // object-fit: cover
    const iR = image.naturalWidth / image.naturalHeight
    const vR = w / h
    let dW: number, dH: number, dX: number, dY: number

    if (vR > iR) {
      dW = w; dH = w / iR; dX = 0; dY = (h - dH) / 2
    } else {
      dH = h; dW = h * iR; dX = (w - dW) / 2; dY = 0
    }

    ctx.fillStyle = '#1a1520'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(image, dX, dY, dW, dH)
  }, [])

  // ── rAF render loop — only re-draws when dirty ─────────
  const renderLoop = useCallback(() => {
    rafRef.current = requestAnimationFrame(renderLoop)
    if (!isDirtyRef.current) return
    isDirtyRef.current = false

    const idx = currentFrameRef.current
    const img = imagesRef.current[idx]
    if (img?.complete) drawFrame(img)
  }, [drawFrame])

  // ── Load a chunk of frames ─────────────────────────────
  const loadChunk = useCallback((chunkIndex: number) => {
    if (loadedChunksRef.current.has(chunkIndex)) return
    loadedChunksRef.current.add(chunkIndex)

    const start = chunkIndex * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, TOTAL_FRAMES)
    let loadedInChunk = 0
    const chunkSize = end - start

    for (let i = start; i < end; i++) {
      if (imagesRef.current[i]) { loadedInChunk++; continue }

      const img = new Image()
      img.src = getFramePath(i)
      const frameIdx = i

      img.onload = () => {
        imagesRef.current[frameIdx] = img
        loadedInChunk++

        // Update global progress
        const totalLoaded = imagesRef.current.filter(Boolean).length
        setLoadProgress(Math.round((totalLoaded / TOTAL_FRAMES) * 100))

        // First chunk: trigger ready state & draw frame 0
        if (chunkIndex === 0 && !loadedChunksRef.current.has(-1)) {
          if (totalLoaded >= CHUNK_SIZE) {
            loadedChunksRef.current.add(-1) // sentinel
            setFirstChunkReady(true)
            currentFrameRef.current = 0
            isDirtyRef.current = true
          }
        }

        // Draw immediately if this is current frame
        if (frameIdx === currentFrameRef.current) {
          isDirtyRef.current = true
        }
      }
    }

    void chunkSize // suppress lint
  }, [])

  // ── Initial load: first chunk ──────────────────────────
  useEffect(() => {
    loadChunk(0)
    rafRef.current = requestAnimationFrame(renderLoop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loadChunk, renderLoop])

  // ── Resize handler ─────────────────────────────────────
  useEffect(() => {
    const onResize = () => { isDirtyRef.current = true }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Scroll → frame mapping ─────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1])

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const idx = Math.round(Math.max(0, Math.min(TOTAL_FRAMES - 1, latest)))
    currentFrameRef.current = idx
    isDirtyRef.current = true

    // Progressive chunk loading: preload 2 chunks ahead
    const currentChunk = Math.floor(idx / CHUNK_SIZE)
    loadChunk(currentChunk)
    if (currentChunk + 1 < Math.ceil(TOTAL_FRAMES / CHUNK_SIZE)) {
      loadChunk(currentChunk + 1)
    }
    if (currentChunk + 2 < Math.ceil(TOTAL_FRAMES / CHUNK_SIZE)) {
      loadChunk(currentChunk + 2)
    }
  })

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
            {/* Bokeh glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle 400px at 50% 50%, rgba(244,167,185,0.06) 0%, transparent 70%)',
              }}
            />
            {/* Guitar pick spinner */}
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
            {/* Progress bar */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-44 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 animate-shimmer"
                  style={{
                    width: `${loadProgress}%`,
                    background: 'linear-gradient(90deg, #c9748a, #f4a7b9, #c9748a)',
                    backgroundSize: '200% 100%',
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
                className="text-[10px]"
                style={{ color: 'rgba(244,167,185,0.2)', fontFamily: 'var(--font-caveat)', fontSize: '1rem' }}
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

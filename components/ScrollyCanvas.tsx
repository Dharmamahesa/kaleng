'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Overlay from './Overlay'

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [loadProgress, setLoadProgress] = useState(0)
  
  const frameCount = 120

  const drawFrame = useCallback((image: HTMLImageElement) => {
    if (!canvasRef.current || !image) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`

    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, w, h)

    // Calculate scaled-down can size
    // Mobile: ~55% of viewport height, Desktop: ~70%
    const isMobile = w < 768
    const canScale = isMobile ? 0.55 : 0.70
    
    const imgRatio = image.width / image.height
    const targetH = h * canScale
    const targetW = targetH * imgRatio

    // Center the can
    const x = (w - targetW) / 2
    const y = (h - targetH) / 2

    // Draw radial glow behind the can
    const glowX = w / 2
    const glowY = h / 2
    const glowRadius = Math.max(targetW, targetH) * 0.9
    const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius)
    glow.addColorStop(0, 'rgba(200, 135, 92, 0.12)')
    glow.addColorStop(0.5, 'rgba(200, 135, 92, 0.04)')
    glow.addColorStop(1, 'rgba(200, 135, 92, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)

    // Draw the can image scaled down
    ctx.drawImage(image, x, y, targetW, targetH)

    // Feathered edge mask to blend the image into the dark background
    // Top edge
    const topGrad = ctx.createLinearGradient(x, y, x, y + targetH * 0.08)
    topGrad.addColorStop(0, 'rgba(10, 10, 15, 0.8)')
    topGrad.addColorStop(1, 'rgba(10, 10, 15, 0)')
    ctx.fillStyle = topGrad
    ctx.fillRect(x, y, targetW, targetH * 0.08)

    // Bottom edge
    const bottomGrad = ctx.createLinearGradient(x, y + targetH * 0.92, x, y + targetH)
    bottomGrad.addColorStop(0, 'rgba(10, 10, 15, 0)')
    bottomGrad.addColorStop(1, 'rgba(10, 10, 15, 0.8)')
    ctx.fillStyle = bottomGrad
    ctx.fillRect(x, y + targetH * 0.92, targetW, targetH * 0.08)

    // Left edge
    const leftGrad = ctx.createLinearGradient(x, y, x + targetW * 0.05, y)
    leftGrad.addColorStop(0, 'rgba(10, 10, 15, 0.8)')
    leftGrad.addColorStop(1, 'rgba(10, 10, 15, 0)')
    ctx.fillStyle = leftGrad
    ctx.fillRect(x, y, targetW * 0.05, targetH)

    // Right edge
    const rightGrad = ctx.createLinearGradient(x + targetW * 0.95, y, x + targetW, y)
    rightGrad.addColorStop(0, 'rgba(10, 10, 15, 0)')
    rightGrad.addColorStop(1, 'rgba(10, 10, 15, 0.8)')
    ctx.fillStyle = rightGrad
    ctx.fillRect(x + targetW * 0.95, y, targetW * 0.05, targetH)
  }, [])

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = []
    let loadedCount = 0

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      const paddedIndex = String(i).padStart(3, '0')
      img.src = `/sequence/frame_${paddedIndex}_delay-0.066s.png`
      
      img.onload = () => {
        loadedImages[i] = img
        loadedCount++
        setLoadProgress(Math.round((loadedCount / frameCount) * 100))
        if (loadedCount === frameCount) {
          setImages(loadedImages)
          drawFrame(loadedImages[0])
        }
      }
    }
  }, [drawFrame])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1])

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const idx = Math.floor(latest)
    if (images[idx]) {
      drawFrame(images[idx])
    }
  })

  useEffect(() => {
    const handleResize = () => {
      if (images.length > 0) {
        drawFrame(images[Math.floor(frameIndex.get())])
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [images, frameIndex, drawFrame])

  return (
    <section id="home" ref={containerRef} className="relative w-full h-[400vh]" style={{ background: '#0a0a0f' }}>
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
        {/* Loading Screen */}
        {images.length === 0 && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center shadow-lg shadow-copper/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white animate-pulse">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-copper to-copper-light rounded-full transition-all duration-300" 
                style={{ width: `${loadProgress}%` }} 
              />
            </div>
            <p className="text-xs text-white/30 font-mono">{loadProgress}%</p>
          </div>
        )}
        
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Subtle vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,15,0.6) 100%)' 
          }} 
        />
        
        <Overlay scrollYProgress={scrollYProgress} />
      </div>
    </section>
  )
}

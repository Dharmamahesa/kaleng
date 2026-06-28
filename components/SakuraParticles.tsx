'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  drift: number
  rotation: number
  rotSpeed: number
  opacity: number
}

const PETAL_COUNT = 28

function createPetal(w: number): Particle {
  return {
    x: Math.random() * w,
    y: -20 - Math.random() * 200,
    size: 6 + Math.random() * 10,
    speed: 0.5 + Math.random() * 1.2,
    drift: (Math.random() - 0.5) * 0.6,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    opacity: 0.05 + Math.random() * 0.1,
  }
}

export default function SakuraParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Init petals
    particlesRef.current = Array.from({ length: PETAL_COUNT }, () =>
      createPetal(canvas.width)
    )
    // Stagger starting positions vertically
    particlesRef.current.forEach((p, i) => {
      p.y = (i / PETAL_COUNT) * canvas.height - canvas.height * 0.2
    })

    const drawPetal = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.globalAlpha = opacity
      ctx.beginPath()
      // Teardrop petal shape
      ctx.moveTo(0, -size)
      ctx.bezierCurveTo(size * 0.7, -size * 0.6, size * 0.7, size * 0.4, 0, size * 0.5)
      ctx.bezierCurveTo(-size * 0.7, size * 0.4, -size * 0.7, -size * 0.6, 0, -size)
      ctx.fillStyle = '#FF6B9D'
      ctx.fill()
      ctx.restore()
    }

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.y += p.speed
        p.x += p.drift + Math.sin(p.y * 0.015) * 0.4
        p.rotation += p.rotSpeed

        // Reset if off screen
        if (p.y > canvas.height + 30) {
          const np = createPetal(canvas.width)
          p.x = np.x
          p.y = np.y
          p.size = np.size
          p.speed = np.speed
          p.drift = np.drift
          p.rotSpeed = np.rotSpeed
          p.opacity = np.opacity
        }

        drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.opacity)
      })
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5, mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}

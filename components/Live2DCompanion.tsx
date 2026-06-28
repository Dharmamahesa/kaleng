'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

const MESSAGES = [
  'Eh... konnichiwa...',
  'A-arigatou...',
  'G-gambatte ne...',
  'S-senpai noticed me...',
  'I... I made this...',
  'W-wow, you scrolled here...',
]

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) { resolve(); return }
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load: ${src}`))
    document.head.appendChild(script)
  })
}

const MODEL_URL =
  '/l2d/hitori%20goto%20vtuber%20model%20-%20bocchi%20the%20rock%20-%20%40paimamodels.model3.json'

const W = 280
const H = 400

// ─── Helpers ───────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

// Safe param setter — silently ignores missing params
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setParam(core: any, id: string, value: number) {
  try { core.setParameterValueById(id, value) } catch { /* param absent */ }
}

function Live2DInner() {
  const containerRef    = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appRef          = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelRef        = useRef<any>(null)
  const [message,       setMessage]     = useState<string | null>(null)
  const [isHovered,     setIsHovered]   = useState(false)
  const [modelLoaded,   setModelLoaded] = useState(false)

  // Mouse tracking targets (smoothly interpolated each frame)
  const mouseTarget   = useRef({ x: 0, y: 0 })   // -1..1 range
  const mouseCurrent  = useRef({ x: 0, y: 0 })

  // Blink state
  const blinkTimer    = useRef(0)
  const blinkDur      = useRef(0)
  const isBlinking    = useRef(false)

  const scrollDirRef    = useRef<'up' | 'down'>('down')
  const lastScrollY     = useRef(0)
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showMessage = useCallback((msg?: string) => {
    const text = msg ?? MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    setMessage(text)
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    messageTimerRef.current = setTimeout(() => setMessage(null), 3000)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    let cancelled = false

    const init = async () => {
      try {
        // 1 — Cubism core
        await loadScript('/l2d/live2dcubismcore.min.js')
        if (cancelled) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(window as any).Live2DCubismCore) throw new Error('Live2DCubismCore not on window')

        // 2 — PIXI monolith
        const PIXI = await import('pixi.js')
        if (cancelled) return

        // 3 — pixi-live2d-display
        const { Live2DModel } = await import('pixi-live2d-display/cubism4')
        if (cancelled) return

        // 4 — Register ticker
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(Live2DModel as any).registerTicker(PIXI.Ticker)

        // 5 — Create PIXI Application
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const app = new PIXI.Application({
          width:           W,
          height:          H,
          backgroundAlpha: 0,
          antialias:       true,
          resolution:      dpr,
          autoDensity:     true,
        })
        appRef.current = app
        if (!containerRef.current || cancelled) return
        containerRef.current.appendChild(app.view as HTMLCanvasElement)

        // 6 — Load model
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const model = await (Live2DModel as any).from(MODEL_URL, {
          autoInteract: false,
          autoUpdate:   true,
        })
        if (cancelled) { model.destroy(); return }
        modelRef.current = model

        // 7 — Scale & position
        const origW = model.width
        const origH = model.height
        const scaleX = W / (origW || W)
        const scaleY = H / (origH || H)
        const scale  = Math.min(scaleX, scaleY) * 0.9
        model.scale.set(scale)
        model.x = (W - origW * scale) / 2
        model.y = Math.max(0, H - origH * scale)
        app.stage.addChild(model)
        setModelLoaded(true)

        // 8 — Idle animation loop via PIXI ticker
        let t = 0
        // Stagger blink randomly
        blinkTimer.current = Math.random() * 5 + 3

        app.ticker.add((delta: number) => {
          const dt = delta / 60  // delta in seconds (approx)
          t += dt

          const core = model?.internalModel?.coreModel
          if (!core) return

          // ── Mouse tracking (head & eyes follow cursor) ──────────────
          const mx = mouseCurrent.current.x
          const my = mouseCurrent.current.y
          const tx = mouseTarget.current.x
          const ty = mouseTarget.current.y
          // Smooth lerp toward target
          mouseCurrent.current.x = lerp(mx, tx, 0.08)
          mouseCurrent.current.y = lerp(my, ty, 0.08)
          const cx = mouseCurrent.current.x
          const cy = mouseCurrent.current.y

          // Head angles (range -30..30 for X/Y, -15..15 for Z)
          setParam(core, 'ParamAngleX',    cx * 20)
          setParam(core, 'ParamAngleY',    cy * -15)
          setParam(core, 'ParamAngleZ',    cx * -8)
          // Eye tracking
          setParam(core, 'ParamEyeBallX',  cx * 0.8)
          setParam(core, 'ParamEyeBallY',  cy * -0.5)
          // Body follows head slightly
          setParam(core, 'ParamBodyAngleX', cx * 8)
          setParam(core, 'ParamBodyAngleZ', cx * -4)

          // ── Breathing ───────────────────────────────────────────────
          const breath = (Math.sin(t * 0.8) * 0.5 + 0.5)        // 0..1, ~0.8 Hz
          setParam(core, 'ParamBreath', breath)
          // Subtle chest/body rise
          setParam(core, 'ParamBodyAngleY', Math.sin(t * 0.8) * 1.5)

          // ── Idle sway ───────────────────────────────────────────────
          const sway = Math.sin(t * 0.4) * 1.2
          setParam(core, 'ParamBodyAngleX',
            (cx * 8) + sway)  // combine mouse + sway

          // ── Eye blink ───────────────────────────────────────────────
          blinkTimer.current -= dt
          if (blinkTimer.current <= 0) {
            isBlinking.current = true
            blinkDur.current   = 0
            // Next blink in 2–6 s
            blinkTimer.current = Math.random() * 4 + 2
          }
          if (isBlinking.current) {
            blinkDur.current += dt
            // Close (0→0.1 s) then open (0.1→0.25 s)
            let eyeOpen: number
            if (blinkDur.current < 0.1) {
              eyeOpen = 1 - blinkDur.current / 0.1
            } else if (blinkDur.current < 0.25) {
              eyeOpen = (blinkDur.current - 0.1) / 0.15
            } else {
              eyeOpen = 1
              isBlinking.current = false
            }
            setParam(core, 'ParamEyeLOpen', eyeOpen)
            setParam(core, 'ParamEyeROpen', eyeOpen)
          }
        })

      } catch (err) {
        console.error('[Live2D] Init failed:', err)
      }
    }

    const timer = setTimeout(init, 600)
    return () => {
      cancelled = true
      clearTimeout(timer)
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
      if (appRef.current) {
        try { appRef.current.destroy(true, { children: true }) } catch { /* ignore */ }
        appRef.current = null
        modelRef.current = null
      }
    }
  }, [])

  // Global mouse move → update target for head tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Map mouse to -1..1 relative to viewport center
      mouseTarget.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseTarget.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Scroll → slight body forward/back tilt
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      scrollDirRef.current = y > lastScrollY.current ? 'down' : 'up'
      lastScrollY.current = y
      // Body tilt is handled in the ticker now; just store scroll dir
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleHoverEnter = useCallback(() => {
    setIsHovered(true)
    try { modelRef.current?.expression?.('Happy') } catch { /* ignore */ }
  }, [])
  const handleHoverLeave = useCallback(() => {
    setIsHovered(false)
  }, [])
  const handleClick = useCallback(() => {
    showMessage()
    try {
      modelRef.current?.expression?.('Scare')
      setTimeout(() => {
        try { modelRef.current?.expression?.('Happy') } catch { /* ignore */ }
      }, 1500)
    } catch { /* ignore */ }
  }, [showMessage])

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end"
      style={{ userSelect: 'none' }}
    >
      {/* Speech bubble */}
      {message && (
        <div className="speech-bubble mb-1 mr-1">
          <p style={{ fontFamily: 'var(--font-caveat)', fontSize: '0.95rem', color: 'var(--bocchi-pink)' }}>
            {message}
          </p>
        </div>
      )}

      {/* Canvas container */}
      <div
        ref={containerRef}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
        onClick={handleClick}
        style={{
          width:    W,
          height:   H,
          cursor:   'pointer',
          position: 'relative',
          overflow: 'visible',
          transition: 'filter 0.3s ease',
          filter: isHovered
            ? 'drop-shadow(0 0 18px rgba(255,107,157,0.65))'
            : 'drop-shadow(0 0 8px rgba(255,107,157,0.25))',
        }}
        title="Click me~ ✦"
      >
        {/* Loading spinner */}
        {!modelLoaded && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            paddingBottom: 16, gap: 6, pointerEvents: 'none',
          }}>
            <div style={{
              width: 28, height: 34,
              background: 'linear-gradient(135deg, #FF6B9D, #9B59B6)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animation: 'float-gentle 1.2s ease-in-out infinite',
              boxShadow: '0 0 14px rgba(255,107,157,0.5)',
            }} />
            <p style={{
              fontFamily: 'var(--font-caveat)',
              fontSize: '0.75rem',
              color: 'rgba(255,107,157,0.45)',
              letterSpacing: '0.1em',
            }}>
              loading...
            </p>
          </div>
        )}
      </div>

      <p className="mt-1 text-[10px] tracking-widest uppercase"
        style={{ color: 'rgba(255,107,157,0.3)', fontFamily: 'var(--font-outfit)' }}>
        click me~
      </p>
    </div>
  )
}

export default function Live2DCompanion() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (document.readyState === 'complete') {
      setReady(true)
    } else {
      const onLoad = () => setReady(true)
      window.addEventListener('load', onLoad)
      return () => window.removeEventListener('load', onLoad)
    }
  }, [])
  if (!ready) return null
  return <Live2DInner />
}

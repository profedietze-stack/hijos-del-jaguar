// ══════════════════════════════════════════════════════
// MENU EMBERS — Canvas 2D fire particle system
// Brasas realistas que suben desde la base del menú.
// ══════════════════════════════════════════════════════

interface Ember {
  x:       number   // posición actual X
  y:       number   // posición actual Y
  vx:      number   // velocidad X (wobble lateral)
  vy:      number   // velocidad Y (sube)
  radius:  number   // tamaño actual
  r0:      number   // tamaño inicial
  life:    number   // 0..1 (0=recién nacida, 1=muerta)
  lifeInc: number   // velocidad de envejecimiento
  wobFreq: number   // frecuencia del wobble sinusoidal
  wobAmp:  number   // amplitud del wobble
  phase:   number   // fase inicial del seno
  // color base: mezcla entre naranja y rojo
  hue:     number   // 10..30 (rojo-naranja)
}

const EMBER_COUNT  = 55    // partículas vivas simultáneamente
const SPAWN_SPREAD = 0.85  // fracción del ancho donde pueden nacer

// ── Constructor de brasa ────────────────────────────

function makeEmber(canvasW: number, canvasH: number): Ember {
  const r0 = 1.2 + Math.random() * 2.6
  return {
    x:       (0.5 - SPAWN_SPREAD / 2 + Math.random() * SPAWN_SPREAD) * canvasW,
    y:       canvasH + r0,
    vx:      0,
    vy:      -(0.35 + Math.random() * 0.65),   // sube 0.35–1 px/frame
    radius:  r0,
    r0,
    life:    0,
    lifeInc: 0.0018 + Math.random() * 0.0022,  // duración ~450–560 frames
    wobFreq: 0.018 + Math.random() * 0.024,
    wobAmp:  0.35  + Math.random() * 0.9,
    phase:   Math.random() * Math.PI * 2,
    hue:     10 + Math.random() * 22,
  }
}

// ── Loop de animación ────────────────────────────────

let _raf: number | null = null
let _canvas: HTMLCanvasElement | null = null

export function startMenuEmbers(containerId: string): void {
  stopMenuEmbers()

  const container = document.getElementById(containerId)
  if (!container) return

  // Crear canvas
  const canvas = document.createElement('canvas')
  canvas.style.cssText = `
    position:absolute; inset:0;
    width:100%; height:100%;
    pointer-events:none;
  `
  container.appendChild(canvas)
  _canvas = canvas

  const ctx = canvas.getContext('2d')!

  // Resize handler
  const resize = () => {
    canvas.width  = container.clientWidth
    canvas.height = container.clientHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // Pool inicial con edades distribuidas (evita que aparezcan todas juntas)
  const embers: Ember[] = Array.from({ length: EMBER_COUNT }, () => {
    const e = makeEmber(canvas.width, canvas.height)
    // Arrancar en posición aleatoria del ciclo
    const t = Math.random()
    e.life = t
    e.y    = canvas.height * (1 - t) + (canvas.height * 0.05)
    e.x   += e.wobAmp * Math.sin(e.wobFreq * (t / e.lifeInc) + e.phase) * 40
    return e
  })

  // ── glow base: parámetros ──────────────────────────
  const GLOW_H     = 0.18   // altura del glow (fracción del canvas)
  const GLOW_ALPHA = 0.38   // opacidad máx del glow

  // ── tick ──────────────────────────────────────────
  let frame = 0

  const tick = () => {
    _raf = requestAnimationFrame(tick)
    frame++

    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    // ── 1. Glow difuso en la base ──────────────────
    const glowH = H * GLOW_H
    const grad  = ctx.createLinearGradient(0, H, 0, H - glowH)
    grad.addColorStop(0,   `rgba(180, 60, 10, ${GLOW_ALPHA})`)
    grad.addColorStop(0.4, `rgba(140, 35,  5, ${GLOW_ALPHA * 0.55})`)
    grad.addColorStop(1,   `rgba( 80, 15,  2, 0)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, H - glowH, W, glowH)

    // Pulso sutil del glow (cada ~3s)
    const pulse = 0.5 + 0.5 * Math.sin(frame * 0.012)
    const glowExtra = ctx.createLinearGradient(0, H, 0, H - glowH * 0.5)
    glowExtra.addColorStop(0,   `rgba(220, 80, 10, ${0.12 * pulse})`)
    glowExtra.addColorStop(1,   `rgba(220, 80, 10, 0)`)
    ctx.fillStyle = glowExtra
    ctx.fillRect(0, H - glowH * 0.5, W, glowH * 0.5)

    // ── 2. Brasas ─────────────────────────────────
    for (const e of embers) {
      e.life += e.lifeInc
      if (e.life >= 1) {
        // Renacer en la base
        Object.assign(e, makeEmber(W, H))
        continue
      }

      // Posición
      const t  = e.life
      e.x += e.vx + e.wobAmp * Math.cos(e.wobFreq * frame + e.phase)
      e.y += e.vy

      // Tamaño: crece ligeramente al inicio, encoge al final
      const sizeCurve = t < 0.15
        ? t / 0.15
        : 1 - Math.pow((t - 0.15) / 0.85, 1.4)
      e.radius = Math.max(0.3, e.r0 * sizeCurve)

      // Opacidad: fade-in 0→0.15, plena 0.15→0.7, fade-out 0.7→1
      let alpha: number
      if (t < 0.15)      alpha = t / 0.15
      else if (t < 0.70) alpha = 1
      else               alpha = 1 - (t - 0.70) / 0.30
      alpha = Math.min(1, alpha * 0.92)

      // ── Dibujado: núcleo brillante + halo suave ──
      const r = e.radius

      // Halo exterior (glow de calor)
      const haloR = r * 3.5
      const halo  = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, haloR)
      halo.addColorStop(0,   `hsla(${e.hue}, 100%, 65%, ${alpha * 0.55})`)
      halo.addColorStop(0.4, `hsla(${e.hue},  90%, 40%, ${alpha * 0.20})`)
      halo.addColorStop(1,   `hsla(${e.hue},  80%, 20%, 0)`)
      ctx.beginPath()
      ctx.arc(e.x, e.y, haloR, 0, Math.PI * 2)
      ctx.fillStyle = halo
      ctx.fill()

      // Núcleo de la brasa
      const core = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, r)
      core.addColorStop(0,   `hsla(45,  100%, 95%, ${alpha})`)        // centro blanco-amarillo
      core.addColorStop(0.3, `hsla(${e.hue + 15}, 100%, 70%, ${alpha * 0.9})`)
      core.addColorStop(0.7, `hsla(${e.hue},       95%, 45%, ${alpha * 0.7})`)
      core.addColorStop(1,   `hsla(${e.hue - 5},   80%, 25%, 0)`)
      ctx.beginPath()
      ctx.arc(e.x, e.y, r, 0, Math.PI * 2)
      ctx.fillStyle = core
      ctx.fill()
    }
  }

  tick()
  ;(canvas as any)._resizeCleanup = () => window.removeEventListener('resize', resize)
}

export function stopMenuEmbers(): void {
  if (_raf !== null) {
    cancelAnimationFrame(_raf)
    _raf = null
  }
  if (_canvas) {
    ;(_canvas as any)._resizeCleanup?.()
    _canvas.remove()
    _canvas = null
  }
}

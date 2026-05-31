// ══════════════════════════════════════════════════════
// SPLASH SCREEN
// Primer gesto del usuario: activa audio + fullscreen,
// certifica que el DOM está listo, luego pasa al menú.
// ══════════════════════════════════════════════════════

import { enterFullscreen } from '../ui/dom.js'

// Mínimo de "carga simulada" para que la pantalla no desaparezca de golpe
const SPLASH_MIN_MS = 1800

/**
 * Monta el splash screen. Devuelve una Promise que resuelve
 * cuando el usuario hace click en "Comenzar" y el fade-out terminó.
 */
export function mountSplash(): Promise<void> {
  return new Promise(resolve => {
    const splash = document.getElementById('splash-screen')
    if (!splash) { resolve(); return }

    // Partículas de fuego
    _spawnParticles()

    // Después del mínimo de carga, mostrar el botón
    setTimeout(() => _showStartButton(splash, resolve), SPLASH_MIN_MS)
  })
}

// ── Botón de inicio ───────────────────────────────────

function _showStartButton(splash: HTMLElement, resolve: () => void): void {
  const loading = document.getElementById('splash-loading')
  const btn     = document.getElementById('btn-splash-start')
  const hint    = document.getElementById('splash-hint')

  // Ocultar dots, mostrar botón
  if (loading) loading.style.display = 'none'
  if (btn) {
    btn.style.display = 'inline-block'
    // Pequeño delay para que el fade-in CSS se note
    requestAnimationFrame(() => requestAnimationFrame(() => {
      btn.style.opacity = '1'
    }))
  }
  if (hint) hint.style.display = 'block'

  const handleStart = () => {
    btn?.removeEventListener('click', handleStart)

    // Fullscreen al primer gesto
    enterFullscreen()

    // Fade out del splash
    splash.classList.add('splash-out')
    setTimeout(() => {
      splash.style.display = 'none'
      resolve()
    }, 850)
  }

  btn?.addEventListener('click', handleStart)

  // También responder a teclado (Enter / Space)
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      document.removeEventListener('keydown', handleKey)
      handleStart()
    }
  }
  document.addEventListener('keydown', handleKey)
}

// ── Partículas de fuego (puro CSS + JS) ───────────────

function _spawnParticles(): void {
  const container = document.getElementById('splash-particles')
  if (!container) return

  const EMOJIS   = ['🔥', '✨', '🌟', '💫', '🔥', '🔥']
  const COUNT    = 18

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('span')
    p.className  = 'splash-particle'
    p.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]

    const left    = 5 + Math.random() * 90
    const dur     = 3.5 + Math.random() * 4.5
    const delay   = Math.random() * 5
    const size    = 0.7 + Math.random() * 0.9

    p.style.left              = `${left}%`
    p.style.animationDuration = `${dur}s`
    p.style.animationDelay    = `${delay}s`
    p.style.fontSize          = `${size}rem`

    container.appendChild(p)
  }
}

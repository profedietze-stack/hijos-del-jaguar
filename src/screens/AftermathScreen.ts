// ══════════════════════════════════════════════════════
// AFTERMATH SCREEN
//
// 1. showAftermath — tarjeta de consecuencias tras una decisión.
//    Se muestra como overlay sobre el event-screen; el jugador
//    ve claramente qué cambió antes de volver al mapa.
//
// 2. showActTransition — cinemática de cambio de acto.
//    Pantalla completa estilo "capítulo" entre Act I→II, etc.
// ══════════════════════════════════════════════════════

import type { Notif } from '../core/GameState.js'

// ── AFTERMATH: mapa de iconos para los stats ──────────

const STAT_ICON: Record<string, string> = {
  alimentos: '🌽',
  moral:     '🔥',
  salud:     '💊',
  unión:     '🤝',
  guerreros: '⚔️',
  chamanes:  '🌿',
  civiles:   '👥',
}

function _iconFor(msg: string): string {
  for (const [key, icon] of Object.entries(STAT_ICON)) {
    if (msg.includes(key)) return icon
  }
  return '•'
}

// ── 1. AFTERMATH — tarjeta de consecuencias ───────────

/**
 * Muestra la tarjeta de consecuencias sobre el event-screen.
 * Llama a onContinue cuando el jugador la descarta (o tras auto-dismiss).
 */
export function showAftermath(notifs: Notif[], onContinue: () => void): void {
  // Si no hay nada que mostrar, ir directo (no bloquear el flujo)
  if (notifs.length === 0) { onContinue(); return }

  const overlay   = document.getElementById('aftermath-overlay')
  const effectsEl = document.getElementById('aftermath-effects')
  const btn       = document.getElementById('aftermath-continue')

  if (!overlay || !effectsEl || !btn) { onContinue(); return }

  // ── Separar notifs de stats vs. info (alianzas, etc.) ─
  const statNotifs = notifs.filter(n => n.kind !== 'info')
  const infoNotifs = notifs.filter(n => n.kind === 'info')

  // ── Construir efectos ─────────────────────────────────
  let html = ''

  if (statNotifs.length > 0) {
    html += '<div class="am-stat-grid">'
    html += statNotifs.map(n => {
      const icon  = _iconFor(n.msg)
      const cls   = n.kind === 'gain' ? 'am-gain' : 'am-loss'
      // Formatear el msg: "+10 alimentos" → mostrar el número grande
      const match = n.msg.match(/^([+\-]?\d+)\s+(.+)$/)
      if (match) {
        return `<div class="am-stat-item ${cls}">
          <span class="am-stat-icon">${icon}</span>
          <span class="am-stat-val">${match[1]}</span>
          <span class="am-stat-lbl">${match[2]}</span>
        </div>`
      }
      return `<div class="am-stat-item ${cls}"><span class="am-stat-icon">${icon}</span><span class="am-stat-lbl">${n.msg}</span></div>`
    }).join('')
    html += '</div>'
  } else {
    html += '<p class="am-neutral">Sin cambios en recursos</p>'
  }

  if (infoNotifs.length > 0) {
    html += '<div class="am-infos">'
    html += infoNotifs.map(n =>
      `<div class="am-info-item">${n.msg}</div>`
    ).join('')
    html += '</div>'
  }

  effectsEl.innerHTML = html

  // ── Mostrar overlay ───────────────────────────────────
  overlay.classList.add('visible')
  btn.focus()

  // ── Dismiss ───────────────────────────────────────────
  let dismissed = false
  const dismiss = () => {
    if (dismissed) return
    dismissed = true
    overlay.classList.add('fadeout')
    setTimeout(() => {
      overlay.classList.remove('visible', 'fadeout')
      onContinue()
    }, 280)
  }

  btn.addEventListener('click', dismiss, { once: true })

  // Auto-dismiss: 3.5s si hay solo stats, 2s si son solo decay sin alianzas
  const hasAlliance = infoNotifs.some(n => n.msg.includes('Alianza'))
  const autoMs = hasAlliance ? 5000 : statNotifs.length > 0 ? 3200 : 2000
  setTimeout(() => {
    if (!dismissed) dismiss()
  }, autoMs)
}

// ── 2. ACT TRANSITION — cinemática de cambio de acto ──

interface ActInfo {
  badge:    string
  title:    string
  subtitle: string
  glyph:    string
}

const ACT_INFO: Record<number, ActInfo> = {
  2: {
    badge:    'Acto II',
    title:    'La Travesía',
    subtitle: 'La selva profunda y los grandes ríos aguardan. El conquistador avanza. La esperanza también.',
    glyph:    '🌿',
  },
  3: {
    badge:    'Acto III',
    title:    'El Sur',
    subtitle: 'Nuevas tierras, nuevos pueblos, nuevas alianzas posibles. El camino se bifurca ante vos.',
    glyph:    '🏔️',
  },
  4: {
    badge:    'Acto IV',
    title:    'El Destino',
    subtitle: 'El tramo final de la Gran Huida. Solo los más fuertes —y los más sabios— llegan hasta aquí.',
    glyph:    '⭐',
  },
}

/**
 * Muestra la pantalla cinemática de transición de acto.
 * Se auto-descarta a los 4 segundos o al toque del usuario.
 * @param actNum — número de acto al que se ENTRA (2, 3 o 4)
 * @param onDone — callback cuando termina la cinemática
 */
export function showActTransition(actNum: number, onDone: () => void): void {
  const info = ACT_INFO[actNum]
  if (!info) { onDone(); return }

  const el       = document.getElementById('act-transition')
  const badgeEl  = document.getElementById('act-tr-badge')
  const glyphEl  = document.getElementById('act-tr-glyph')
  const titleEl  = document.getElementById('act-tr-title')
  const subEl    = document.getElementById('act-tr-subtitle')

  if (!el) { onDone(); return }

  if (badgeEl)  badgeEl.textContent  = info.badge
  if (glyphEl)  glyphEl.textContent  = info.glyph
  if (titleEl)  titleEl.textContent  = info.title
  if (subEl)    subEl.textContent    = info.subtitle

  // Reiniciar animaciones
  el.classList.remove('visible', 'fadeout')
  void el.offsetWidth  // forzar reflow para que el CSS animation se reinicie

  el.classList.add('visible')

  let done = false
  const finish = () => {
    if (done) return
    done = true
    el.classList.add('fadeout')
    setTimeout(() => {
      el.classList.remove('visible', 'fadeout')
      onDone()
    }, 700)
  }

  el.addEventListener('click', finish, { once: true })
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') finish()
  }, { once: true })

  // Auto-dismiss a los 4 segundos
  setTimeout(() => { if (!done) finish() }, 4000)
}

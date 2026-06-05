import type { GameState }  from '../core/GameState.js'
import type { Notif }      from '../core/GameState.js'
import { totalM }          from '../core/GameState.js'
import { DIFF_CONFIG }     from '../data/difficultyConfig.js'

// ══════════════════════════════════════════════════════
// DOM UTILITIES
// Helpers sin lógica de juego — solo manipulación de DOM.
// ══════════════════════════════════════════════════════

// ── SCREEN ROUTER ─────────────────────────────────────

export function showScreen(id: string): void {
  const tt = document.getElementById('map-node-tt')
  if (tt) tt.style.display = 'none'
  document.querySelectorAll<HTMLElement>('.screen').forEach(s => s.classList.remove('active'))
  const el = document.getElementById(id)
  if (!el) return
  el.classList.add('active')
  // Animación de entrada (la clase .screen-enter está definida en base.css)
  el.classList.remove('screen-enter')
  void el.offsetWidth   // forzar reflow para reiniciar la animación
  el.classList.add('screen-enter')
  el.addEventListener('animationend', () => el.classList.remove('screen-enter'), { once: true })
}

// ── STATS BAR (HUD) ───────────────────────────────────

export function updateStatsBar(gs: GameState): void {
  const s   = gs.stats
  const m   = totalM(s)
  const cfg = DIFF_CONFIG[gs.diff]

  const set = (id: string, v: string | number) => {
    const el = document.getElementById(id)
    if (el) el.textContent = String(v)
  }

  set('sb-total', m)
  set('sb-w',     s.warriors)
  set('sb-s',     s.shamans)
  set('sb-c',     s.civilians)

  const statMap: Array<{ val: number; valId: string; barId: string; threshold: number }> = [
    { val: s.food,  valId: 'sv-food',  barId: 'bar-food',  threshold: cfg.deathThreshold.food  },
    { val: s.moral, valId: 'sv-moral', barId: 'bar-moral',  threshold: 25                      },
    { val: s.salud, valId: 'sv-salud', barId: 'bar-salud',  threshold: cfg.deathThreshold.salud },
    { val: s.union, valId: 'sv-union', barId: 'bar-union',  threshold: cfg.lowUnionThreshold   },
  ]

  statMap.forEach(({ val, valId, barId, threshold }) => {
    const valEl = document.getElementById(valId)
    const barEl = document.getElementById(barId)
    if (valEl) {
      valEl.textContent = String(val)
      valEl.classList.toggle('danger', val < threshold)
    }
    if (barEl) {
      barEl.style.width = `${val}%`
      barEl.classList.toggle('danger', val < threshold)
    }
  })

  // Badge de dificultad y acto en la barra
  const badge = document.getElementById('sb-diff-badge')
  if (badge) badge.textContent = cfg.label

  const actEl = document.getElementById('sb-act-label')
  if (actEl && gs.currentNode && gs.nodes[gs.currentNode]) {
    const act = gs.nodes[gs.currentNode].act
    actEl.textContent = `Acto ${act}`
  }
}

export function showStatsBar(): void {
  document.getElementById('stats-bar')?.classList.add('visible')
}

export function hideStatsBar(): void {
  document.getElementById('stats-bar')?.classList.remove('visible')
}

// ── NOTIFICACIONES ────────────────────────────────────

let _notifTimer: ReturnType<typeof setTimeout> | null = null
const NOTIF_DURATION = 2800   // ms cada notif
const NOTIF_GAP      = 320    // ms entre notifs

export function showNotif(msg: string, kind: Notif['kind'] = 'info'): void {
  const area = document.getElementById('notif-area')
  if (!area) return
  const el = document.createElement('div')
  el.className = `notif ${kind}`
  el.textContent = msg
  area.appendChild(el)
  // Forzar reflow para que la transición CSS funcione
  void el.offsetWidth
  el.classList.add('visible')
  setTimeout(() => {
    el.classList.remove('visible')
    setTimeout(() => el.remove(), 400)
  }, NOTIF_DURATION)
}

/** Muestra una lista de notificaciones con delay escalonado */
export function showNotifs(notifs: Notif[]): void {
  notifs.forEach((n, i) => {
    setTimeout(() => showNotif(n.msg, n.kind), i * NOTIF_GAP)
  })
}

// ── SAVE INDICATOR ────────────────────────────────────

export function flashSaveIndicator(): void {
  const ind = document.getElementById('sb-save-indicator') as HTMLElement | null
  if (!ind) return
  ind.style.opacity = '1'
  if (_notifTimer) clearTimeout(_notifTimer)
  _notifTimer = setTimeout(() => { ind.style.opacity = '0' }, 1800)
}

// ── TOOLTIP ───────────────────────────────────────────

export function showTip(e: MouseEvent | TouchEvent, text: string): void {
  const tt = document.getElementById('tooltip')
  if (!tt) return
  tt.textContent = text
  tt.style.display = 'block'
  let x = 0, y = 0
  if ('touches' in e && e.touches[0]) {
    x = e.touches[0].clientX; y = e.touches[0].clientY
  } else if ('clientX' in e) {
    x = e.clientX; y = e.clientY
  }
  const PAD = 12
  tt.style.left = `${Math.min(x + PAD, window.innerWidth  - tt.offsetWidth  - PAD)}px`
  tt.style.top  = `${Math.min(y + PAD, window.innerHeight - tt.offsetHeight - PAD)}px`
}

export function hideTip(): void {
  const tt = document.getElementById('tooltip')
  if (tt) tt.style.display = 'none'
}

// ── MODAL GENÉRICO ────────────────────────────────────

const MODAL_DEFS: Record<string, { title: string; html: string }> = {
  cacique: {
    title: 'El Cacique',
    html: `<p>El <strong>cacique</strong> era el líder de una comunidad indígena en América. Su autoridad dependía del consenso comunitario, no de la herencia. La primera obligación del cacique era su pueblo, no el poder.</p>
           <p>En este juego, <em>vos sos el cacique</em>. Cada decisión que tomás afecta a los supervivientes bajo tu liderazgo.</p>`,
  },
  medicinaSelva: {
    title: 'Medicina de la Selva',
    html: `<p>La <strong>cataplasma de corteza de cedro y barro</strong> era usada por chamanes mayas para tratar inflamaciones y heridas. El cedro tiene propiedades antisépticas naturales. El barro actúa como agente antiinflamatorio.</p>`,
  },
  amazonasInfo: {
    title: 'El Río Amazonas',
    html: `<p>El <strong>Amazonas</strong> es el río más caudaloso del planeta. Su cuenca cubre el 40% de América del Sur. Alberga el 10% de todas las especies vivas conocidas. Su caudal equivale a la suma de los 7 ríos siguientes más grandes del mundo.</p>`,
  },
  jaguarInfo: {
    title: 'El Jaguar',
    html: `<p>El <strong>jaguar</strong> (Panthera onca) es el felino más grande de América. Para los mayas era una deidad del inframundo y símbolo del poder guerrero. Los chamanes mayas creían poder transformarse en jaguar durante los rituales. Su nombre en náhuatl, <em>ocelotl</em>, dio origen a la palabra española "ocelote".</p>`,
  },
}

export function showModal(key: string): void {
  const def = MODAL_DEFS[key]
  if (!def) return
  const overlay = document.getElementById('modal-overlay')
  const title   = document.getElementById('modal-title')
  const body    = document.getElementById('modal-body')
  if (!overlay || !title || !body) return
  title.textContent = def.title
  body.innerHTML    = def.html
  overlay.style.display = 'flex'
}

export function hideModal(): void {
  const overlay = document.getElementById('modal-overlay')
  if (overlay) overlay.style.display = 'none'
}

// ── CONFIRM MODAL ─────────────────────────────────────

export function showConfirmModal(
  title:    string,
  message:  string,
  onConfirm: () => void,
): void {
  const overlay = document.getElementById('confirm-modal')
  const titleEl = document.getElementById('confirm-title')
  const msgEl   = document.getElementById('confirm-body')
  const btnOk   = document.getElementById('confirm-ok')
  if (!overlay || !titleEl || !msgEl || !btnOk) { onConfirm(); return }

  titleEl.textContent = title
  msgEl.innerHTML     = message   // message puede contener <strong> y otros tags
  overlay.style.display = 'flex'

  const newBtn = btnOk.cloneNode(true) as HTMLButtonElement
  btnOk.parentNode?.replaceChild(newBtn, btnOk)
  newBtn.onclick = () => {
    overlay.style.display = 'none'
    onConfirm()
  }
}

// ── FULLSCREEN ────────────────────────────────────────

export function enterFullscreen(): void {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => void
    mozRequestFullScreen?: () => void
    msRequestFullscreen?: () => void
  }
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return
  try {
    if (el.requestFullscreen)            el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    else if (el.mozRequestFullScreen)    el.mozRequestFullScreen()
    else if (el.msRequestFullscreen)     el.msRequestFullscreen()
  } catch (_) { /* silencioso */ }
}

// ── WIRE UP GLOBAL TOOLTIP + MODAL LISTENERS ─────────

export function initGlobalListeners(): void {
  // Cerrar tooltip con click fuera
  document.addEventListener('click', (e) => {
    const tt = document.getElementById('tooltip')
    if (tt && !(e.target as Element).closest('.tt')) hideTip()
  })

  // Cerrar modal con click en overlay o btn-cerrar
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) hideModal()
  })
  document.getElementById('modal-close')?.addEventListener('click', hideModal)

  // Cerrar confirm modal con btn-cancel
  document.getElementById('confirm-cancel')?.addEventListener('click', () => {
    const overlay = document.getElementById('confirm-modal')
    if (overlay) overlay.style.display = 'none'
  })
}

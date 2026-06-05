import type { GameState }   from '../core/GameState.js'
import type { GameEvent, Decision } from '../data/types.js'
import type { ClaseInfo }    from '../data/claseData.js'
import { showScreen }        from '../ui/dom.js'
import { showTip, hideTip, showModal } from '../ui/dom.js'
import { isClaseMode, showFichaDidactica } from '../ui/claseMode.js'

// ══════════════════════════════════════════════════════
// EVENT SCREEN
// Renderiza el evento actual y sus decisiones.
// La función onDecision es inyectada por main.ts
// (separa la UI de la lógica de juego).
//
// BUNDLE SPLITTING:
//   events.ts (148 KB) y claseData.ts (19 KB) se cargan de
//   forma diferida mediante import() dinámico. Se precargan
//   en segundo plano cuando el mapa ya es visible (antes de
//   que el jugador seleccione un nodo). Ver preloadEventData().
// ══════════════════════════════════════════════════════

// ── Caches de módulos cargados diferidamente ──────────
let _eventsCache: Record<string, GameEvent> | null = null
let _claseCache:  Record<string, ClaseInfo>  | null = null

/**
 * Precarga los módulos de datos pesados en segundo plano.
 * Llamar cuando el mapa ya es visible (antes de la primera selección de nodo).
 * Si ya están cargados, no hace nada.
 */
export function preloadEventData(): void {
  if (!_eventsCache) {
    import('../data/events.js').then(m => { _eventsCache = m.EVENTS_DEF })
  }
  if (!_claseCache) {
    import('../data/claseData.js').then(m => { _claseCache = m.CLASE_DATA })
  }
}

/** Callback: índice de decisión + objeto Decision para que main.ts no necesite EVENTS_DEF */
type DecisionCallback = (decisionIndex: number, decision: Decision) => void

/** Personaliza la narrativa con el nombre del cacique */
function personalizeNarr(narrHtml: string, name: string): string {
  const n = name
  return narrHtml
    .replace('llama aparte al cacique,',         `llama aparte al cacique ${n},`)
    .replace('Doce guaraníes miran al cacique.',  `Doce guaraníes miran al cacique ${n}.`)
    .replace('Le ofrecen al cacique hablar',      `Le ofrecen al cacique ${n} hablar`)
    .replace('Cuando el cacique se acerca,',      `Cuando ${n} se acerca,`)
    .replace('una expresión que el cacique nunca le vio', `una expresión que ${n} nunca le vio`)
    .replace('cerca de los pies del cacique:',    `cerca de los pies de ${n}:`)
    .replace('ya no es solo tuya, cacique.',      `ya no es solo tuya, ${n}.`)
    .replace(
      '<span class="ct" data-modal="cacique">cacique</span>',
      `<span class="ct" data-modal="cacique">cacique</span> <strong style="color:var(--ocre2)">${n}</strong>`,
    )
}

/** Construye el HTML del hint de efectos para modo educativo */
function buildHintHtml(fx: Decision['effects']): string {
  if (!fx) return ''
  const parts: string[] = []
  if (fx.food     !== undefined) parts.push(fx.food     > 0 ? '🌽+' : fx.food     < 0 ? '🌽−' : '')
  if (fx.moral    !== undefined) parts.push(fx.moral    > 0 ? '🔥+' : fx.moral    < 0 ? '🔥−' : '')
  if (fx.salud    !== undefined) parts.push(fx.salud    > 0 ? '💊+' : fx.salud    < 0 ? '💊−' : '')
  if (fx.union    !== undefined) parts.push(fx.union    > 0 ? '🤝+' : fx.union    < 0 ? '🤝−' : '')
  if (fx.civilians !== undefined && fx.civilians < 0) parts.push('💀')
  if (fx.warriors  !== undefined && fx.warriors  < 0) parts.push('⚔️−')
  if (fx.shamans   !== undefined && fx.shamans   < 0) parts.push('🌿−')
  const filtered = parts.filter(p => p !== '')
  return filtered.length > 0 ? `<span class="dec-hint">${filtered.join(' ')}</span>` : ''
}

export function mountEventScreen(gs: GameState, onDecision: DecisionCallback): void {
  // Si los datos aún no están en caché (raro: partida cargada antes del preload)
  // los pedimos ahora sincrónicamente — el jugador ya hizo el gesto de seleccionar un nodo.
  if (!_eventsCache) {
    import('../data/events.js').then(m => {
      _eventsCache = m.EVENTS_DEF
      mountEventScreen(gs, onDecision)
    })
    return
  }

  const eventId = gs.currentNode ? gs.nodes[gs.currentNode]?.eventId : null
  if (!eventId) return
  const ev = _eventsCache[eventId]
  if (!ev) return

  // Modo peligro (evento del conquistador)
  const isDanger = eventId === '_conq_catch'
  document.getElementById('event-screen')?.classList.toggle('danger-event', isDanger)

  // Encabezado
  const actEl = document.getElementById('ev-act-badge')
  if (actEl) actEl.textContent = ev.act ?? 'Acto'

  const titleEl = document.getElementById('ev-title')
  if (titleEl) titleEl.textContent = ev.title

  const sbActEl = document.getElementById('sb-act-label')
  if (sbActEl) sbActEl.textContent = ev.act ?? ''

  // Imagen
  const img = document.getElementById('ev-img') as HTMLImageElement | null
  if (img) {
    if (ev.img) { img.src = ev.img; img.style.display = 'block' }
    else          img.style.display = 'none'
  }
  const capEl = document.getElementById('ev-img-cap')
  if (capEl) capEl.textContent = ev.cap ?? ''

  // Narrativa
  const narrEl = document.getElementById('ev-narr')
  if (narrEl) {
    let narrHtml = ev.narr
    if (gs.caciqueName) narrHtml = personalizeNarr(narrHtml, gs.caciqueName)
    narrEl.innerHTML = narrHtml

    // Tooltips .tt
    narrEl.querySelectorAll<HTMLElement>('.tt').forEach(el => {
      el.addEventListener('mouseenter', e => {
        if (!('ontouchstart' in window)) showTip(e as MouseEvent, el.dataset.tip ?? '')
      })
      el.addEventListener('mouseleave', () => {
        if (!('ontouchstart' in window)) hideTip()
      })
      el.addEventListener('click', e => {
        e.stopPropagation()
        const tt = document.getElementById('tooltip') as (HTMLElement & { _sourceEl?: Element }) | null
        const isOpen = tt?.style.display === 'block' && tt._sourceEl === el
        hideTip()
        if (!isOpen) {
          showTip(e as MouseEvent, el.dataset.tip ?? '')
          if (tt) tt._sourceEl = el
        }
      })
    })

    // Modales .ct
    narrEl.querySelectorAll<HTMLElement>('.ct').forEach(el => {
      el.addEventListener('click', () => showModal(el.dataset.modal ?? ''))
    })
  }

  // Decisiones
  const cont = document.getElementById('dec-buttons')
  if (cont) {
    cont.innerHTML = ''
    ev.decisions.forEach((dec: Decision, i: number) => {
      const btn = document.createElement('button')
      btn.className = 'dec-btn'
      const hintHtml = gs.diff === 'educativo' ? buildHintHtml(dec.effects) : ''
      btn.innerHTML = `<span class="dec-text">${dec.text}</span>${hintHtml}`
      btn.onclick = () => {
        cont.querySelectorAll<HTMLButtonElement>('.dec-btn').forEach(b => { b.disabled = true })
        onDecision(i, dec)
      }
      cont.appendChild(btn)
    })
  }

  showScreen('event-screen')

  // ── Modo Clase: mostrar ficha didáctica antes de las decisiones ──
  if (isClaseMode()) {
    if (_claseCache) {
      const claseInfo = _claseCache[eventId]
      if (claseInfo) showFichaDidactica(ev.title, claseInfo)
    } else {
      // Cargar claseData si aún no está (modo clase activado tarde)
      import('../data/claseData.js').then(m => {
        _claseCache = m.CLASE_DATA
        const claseInfo = _claseCache[eventId]
        if (claseInfo) showFichaDidactica(ev.title, claseInfo)
      })
    }
  }
  // Reset de scroll: usar el elemento scrollable correcto en lugar de window.scrollTo
  // (window.scrollTo es no-op en iOS cuando overflow:hidden está en body)
  requestAnimationFrame(() => {
    const body = document.getElementById('ev-body')
    if (body) body.scrollTop = 0
    const narrWrap = document.getElementById('ev-narr-wrap')
    if (narrWrap) narrWrap.scrollTop = 0
  })
}

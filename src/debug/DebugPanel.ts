// ══════════════════════════════════════════════════════
// DEBUG PANEL — solo activo en DEV
// Activar: Ctrl+Shift+D  o  ?debug=1 en la URL
// ══════════════════════════════════════════════════════

import type { GameState } from '../core/GameState.js'
import { log } from './logger.js'

export interface DebugCallbacks {
  getGs:     () => GameState | null
  applyGs:   (gs: GameState) => void
  selectNode:(id: string) => void
}

let _cb: DebugCallbacks | null = null

// ── Init ──────────────────────────────────────────────

export function initDebugPanel(cb: DebugCallbacks): void {
  if (!import.meta.env.DEV) return
  _cb = cb

  _buildPanel()

  if (new URLSearchParams(location.search).has('debug')) _open()

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault()
      _toggle()
    }
  })

  log('DEBUG', 'Panel listo. Ctrl+Shift+D para abrir.')
}

// ── Panel DOM ─────────────────────────────────────────

function _buildPanel(): void {
  const panel = document.createElement('div')
  panel.id = 'dev-panel'
  panel.innerHTML = `
    <div id="dev-header">
      <span>🐛 DEV PANEL</span>
      <div style="display:flex;gap:5px;align-items:center">
        <button id="dev-btn-refresh" title="Refresh">⟳</button>
        <button id="dev-btn-close">✕</button>
      </div>
    </div>

    <div id="dev-body">

      <div class="dev-sec">
        <div class="dev-sec-title">STATS — ajuste directo</div>
        <div id="dev-stats"></div>
      </div>

      <div class="dev-sec">
        <div class="dev-sec-title">ACCIONES RÁPIDAS</div>
        <div class="dev-actions">
          <button class="dev-act-btn" id="dev-kill-food">🌽 food=0</button>
          <button class="dev-act-btn" id="dev-kill-moral">❤️ moral=0</button>
          <button class="dev-act-btn" id="dev-kill-salud">💉 salud=0</button>
          <button class="dev-act-btn" id="dev-max-all">✨ max all</button>
          <button class="dev-act-btn" id="dev-kill-pop">💀 warriors=0</button>
        </div>
      </div>

      <div class="dev-sec">
        <div class="dev-sec-title">SEED (exportar / importar estado)</div>
        <div class="dev-actions">
          <button class="dev-act-btn" id="dev-copy-seed">📋 Copiar seed</button>
          <button class="dev-act-btn" id="dev-load-seed">📥 Cargar seed</button>
        </div>
        <textarea id="dev-seed-input" placeholder="Pegar seed aquí…" rows="3"></textarea>
        <div id="dev-seed-status"></div>
      </div>

      <div class="dev-sec">
        <div class="dev-sec-title">ESTADO ACTUAL</div>
        <pre id="dev-state-json">—</pre>
      </div>

    </div>
  `
  document.body.appendChild(panel)

  document.getElementById('dev-btn-close')   ?.addEventListener('click', _close)
  document.getElementById('dev-btn-refresh') ?.addEventListener('click', _refresh)
  document.getElementById('dev-copy-seed')   ?.addEventListener('click', _copySeed)
  document.getElementById('dev-load-seed')   ?.addEventListener('click', _loadSeed)
  document.getElementById('dev-kill-food')   ?.addEventListener('click', () => _patchStat('food',  0))
  document.getElementById('dev-kill-moral')  ?.addEventListener('click', () => _patchStat('moral', 0))
  document.getElementById('dev-kill-salud')  ?.addEventListener('click', () => _patchStat('salud', 0))
  document.getElementById('dev-kill-pop')    ?.addEventListener('click', () => _patchStat('warriors', 0))
  document.getElementById('dev-max-all')     ?.addEventListener('click', _maxAllStats)
}

// ── Open / close ──────────────────────────────────────

function _open():  void { document.getElementById('dev-panel')?.classList.add('open');    _refresh() }
function _close(): void { document.getElementById('dev-panel')?.classList.remove('open') }
function _toggle(): void {
  document.getElementById('dev-panel')?.classList.contains('open') ? _close() : _open()
}

// ── Refresh — sincroniza panel con gs actual ───────────

function _refresh(): void {
  const gs = _cb?.getGs()

  // Stats sliders
  const statsEl = document.getElementById('dev-stats')
  if (statsEl) {
    const s = gs?.stats
    if (!s) { statsEl.innerHTML = '<em>sin partida activa</em>'; return }
    statsEl.innerHTML = Object.entries(s).map(([k, v]) => `
      <div class="dev-stat-row">
        <label class="dev-stat-label">${k}</label>
        <input type="range" class="dev-slider" min="0" max="100" value="${v}" data-stat="${k}">
        <span class="dev-stat-val" id="dev-val-${k}">${v}</span>
      </div>
    `).join('')

    statsEl.querySelectorAll<HTMLInputElement>('.dev-slider').forEach(inp => {
      inp.addEventListener('input', () => {
        const curGs = _cb?.getGs()
        if (!curGs) return
        const key = inp.dataset.stat as keyof typeof curGs.stats
        const val = Number(inp.value)
        const valEl = document.getElementById(`dev-val-${key}`)
        if (valEl) valEl.textContent = String(val)
        _cb?.applyGs({ ...curGs, stats: { ...curGs.stats, [key]: val } })
        log('DEBUG', `stat ${key} → ${val}`)
      })
    })
  }

  // JSON dump (nodes colapsados para legibilidad)
  const jsonEl = document.getElementById('dev-state-json')
  if (jsonEl) {
    if (!gs) { jsonEl.textContent = 'sin partida activa'; return }
    const display = {
      diff:        gs.diff,
      caciqueName: gs.caciqueName,
      tribeToken:  gs.tribeToken,
      stats:       gs.stats,
      history:     gs.history,
      alliances:   gs.alliances,
      currentNode: gs.currentNode,
      finalTag:    gs.finalTag,
      conq:        gs.conq,
      nodes:       `[${Object.keys(gs.nodes).length} nodos]`,
    }
    jsonEl.textContent = JSON.stringify(display, null, 2)
  }
}

// ── Acciones rápidas ──────────────────────────────────

function _patchStat(key: string, val: number): void {
  const gs = _cb?.getGs()
  if (!gs) return
  const newGs = { ...gs, stats: { ...gs.stats, [key]: val } }
  _cb?.applyGs(newGs)
  log('DEBUG', `patch ${key} → ${val}`)
  _refresh()
}

function _maxAllStats(): void {
  const gs = _cb?.getGs()
  if (!gs) return
  const maxed = Object.fromEntries(Object.keys(gs.stats).map(k => [k, 100])) as unknown as typeof gs.stats
  _cb?.applyGs({ ...gs, stats: maxed })
  log('DEBUG', 'all stats → 100')
  _refresh()
}

// ── Seed export ───────────────────────────────────────

function _copySeed(): void {
  const gs = _cb?.getGs()
  if (!gs) { _seedStatus('sin partida activa', 'err'); return }

  const seed = btoa(unescape(encodeURIComponent(JSON.stringify(gs))))
  navigator.clipboard.writeText(seed).then(() => {
    _seedStatus('✓ Seed copiada al portapapeles', 'ok')
    log('DEBUG', 'Seed copiada', { chars: seed.length })
  }).catch(() => {
    // Fallback si clipboard API falla
    const ta = document.getElementById('dev-seed-input') as HTMLTextAreaElement
    ta.value = seed
    ta.select()
    _seedStatus('✓ Seed en el textarea — copiá manualmente', 'ok')
  })
}

// ── Seed import ───────────────────────────────────────

function _loadSeed(): void {
  const ta  = document.getElementById('dev-seed-input') as HTMLTextAreaElement
  const raw = ta.value.trim()
  if (!raw) { _seedStatus('Pegá una seed primero', 'err'); return }

  try {
    const gs = JSON.parse(decodeURIComponent(escape(atob(raw)))) as GameState

    // Guardar en localStorage como save normal y recargar — forma más
    // limpia de restaurar estado completo sin rehacer el mapa a mano.
    localStorage.setItem('jaguar_save', JSON.stringify({
      diff:        gs.diff,
      caciqueName: gs.caciqueName,
      tribeToken:  gs.tribeToken,
      stats:       gs.stats,
      nodes:       gs.nodes,
      history:     gs.history,
      alliances:   gs.alliances,
      currentNode: gs.currentNode,
      finalTag:    gs.finalTag,
      conq:        gs.conq,
      startTime:   gs.startTime,
    }))

    _seedStatus('✓ Seed cargada — recargando…', 'ok')
    log('DEBUG', 'Seed loaded — reloading')
    setTimeout(() => location.reload(), 800)

  } catch (e) {
    _seedStatus('✗ Seed inválida (¿pegaste bien?)', 'err')
    log('DEBUG', 'Seed parse error', e)
  }
}

function _seedStatus(msg: string, type: 'ok' | 'err'): void {
  const el = document.getElementById('dev-seed-status')
  if (!el) return
  el.textContent = msg
  el.className = type === 'ok' ? 'dev-status-ok' : 'dev-status-err'
  setTimeout(() => { el.textContent = '' }, 4000)
}

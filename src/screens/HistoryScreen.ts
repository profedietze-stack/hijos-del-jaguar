import type { FinishedGame } from '../core/GameState.js'
import type { Difficulty }    from '../data/types.js'
import { LOGROS_DEF }         from '../data/achievements.js'
import { CONQ_BRIDGE }        from '../data/nodes.js'
import { loadHistory, loadUnlockedAchievements } from '../core/SaveSystem.js'
import { showScreen }          from '../ui/dom.js'

// ══════════════════════════════════════════════════════
// HISTORY SCREEN — historial de partidas y logros
// ══════════════════════════════════════════════════════

export function mountHistoryScreen(): void {
  const h             = loadHistory()
  const desbloqueados = new Set(loadUnlockedAchievements())

  // Activar primer tab
  document.querySelectorAll<HTMLElement>('.hs-tab').forEach((t, i) => t.classList.toggle('active', i === 0))
  document.querySelectorAll<HTMLElement>('.hs-panel').forEach((p, i) => p.classList.toggle('active', i === 0))

  renderHsStats(h)
  renderHsLogros(desbloqueados)
  renderHsPartidas(h)

  showScreen('history-screen')
}

/** Cambia de tab en la pantalla de historial */
export function hsTab(btn: HTMLElement, panelId: string): void {
  document.querySelectorAll<HTMLElement>('.hs-tab').forEach(t => t.classList.remove('active'))
  document.querySelectorAll<HTMLElement>('.hs-panel').forEach(p => p.classList.remove('active'))
  btn.classList.add('active')
  document.getElementById(panelId)?.classList.add('active')
}

// ── Estadísticas globales ─────────────────────────────

function renderHsStats(h: FinishedGame[]): void {
  const el   = document.getElementById('hs-stats-grid')
  const avg  = document.getElementById('hs-avg-grid')
  const dest = document.getElementById('hs-dest-bars')
  const best = document.getElementById('hs-best-card')
  const doc  = document.getElementById('hs-docente-text')

  if (!h.length) {
    if (el)   el.innerHTML = `<div id="hs-empty" style="grid-column:1/-1">Todavía no hay partidas completadas.<br>¡Comenzá la primera huida!</div>`
    if (avg)  avg.innerHTML  = ''
    if (dest) dest.innerHTML = ''
    if (best) best.innerHTML = ''
    if (doc)  doc.innerHTML  = ''
    return
  }

  const total        = h.length
  const ganadas      = h.filter(e => !e.endBadge.includes('TRÁGICO')).length
  const perdidas     = total - ganadas
  const epicas       = h.filter(e => e.endBadge.includes('ÉPICO')).length
  const atrapados    = h.filter(e => e.conqCaught ?? false).length
  const tiempoTotal  = h.reduce((a, e) => a + Math.round(e.durationMs / 60000), 0)
  const eventosTotal = h.reduce((a, e) => a + (e.visitedCount ?? 0), 0)
  const scoreArr     = h.map(e => calcScoreFromFG(e))
  const scoreTotal   = scoreArr.reduce((a, s) => a + s, 0)
  const bestScore    = Math.max(...scoreArr)
  const maxSurv      = Math.max(...h.map(e => e.m))
  const maxAlianzas  = Math.max(...h.map(e => e.alliances.length))
  const edu          = h.filter(e => e.diff === 'educativo').length
  const his          = h.filter(e => e.diff === 'historico').length
  const winRate      = Math.round(ganadas / total * 100)

  if (el) {
    el.innerHTML = [
      { v: total,                                 l: 'Partidas jugadas' },
      { v: ganadas,    cls: ganadas > 0 ? 'good' : '',   l: 'Partidas ganadas' },
      { v: perdidas,   cls: perdidas > 0 && ganadas === 0 ? 'danger' : '', l: 'Partidas perdidas' },
      { v: epicas,     cls: epicas > 0 ? 'good' : '',    l: 'Finales épicos' },
      { v: winRate + '%', cls: winRate >= 50 ? 'good' : winRate >= 25 ? 'warn' : 'danger', l: 'Tasa de victoria' },
      { v: atrapados,  cls: atrapados > 0 ? 'danger' : 'good', l: '⚔️ Veces capturado' },
      { v: edu,                                   l: 'Partidas educativo' },
      { v: his,                                   l: 'Partidas histórico' },
      { v: tiempoTotal + 'm',                     l: 'Tiempo total jugado' },
      { v: eventosTotal,                          l: 'Eventos resueltos' },
      { v: scoreTotal.toLocaleString(),    l: 'Puntaje acumulado' },
      { v: bestScore.toLocaleString(),     l: 'Mejor puntaje' },
      { v: maxSurv,                               l: 'Máx. supervivientes' },
      { v: maxAlianzas,                           l: 'Máx. alianzas' },
    ].map(c => `<div class="hs-stat-card">
      <div class="hs-stat-val ${(c as { cls?: string }).cls ?? ''}">${c.v}</div>
      <div class="hs-stat-label">${c.l}</div>
    </div>`).join('')
  }

  // Promedios
  if (avg) {
    const avgM     = Math.round(h.reduce((a, e) => a + e.m, 0) / total)
    const avgA     = (h.reduce((a, e) => a + e.alliances.length, 0) / total).toFixed(1)
    const avgDur   = Math.round(tiempoTotal / total)
    const avgVisit = Math.round(eventosTotal / total)
    const avgScore = Math.round(scoreTotal / total)
    avg.innerHTML = [
      { v: avgM,                              l: 'Supervivientes' },
      { v: avgA,                              l: 'Alianzas' },
      { v: avgDur + 'm',                      l: 'Duración' },
      { v: avgVisit,                          l: 'Lugares visitados' },
      { v: avgScore.toLocaleString(),  l: 'Puntaje' },
    ].map(c => `<div class="hs-stat-card">
      <div class="hs-stat-val">${c.v}</div>
      <div class="hs-stat-label">${c.l} prom.</div>
    </div>`).join('')
  }

  // Destinos
  if (dest) {
    const destCounts: Record<string, number> = { amazonas: 0, patagonia_arg: 0, patagonia_chi: 0, tragico: 0 }
    h.forEach(e => {
      const d = resolveDestFromBadge(e) ?? 'tragico'
      if (d in destCounts) destCounts[d]++
    })
    const destLabels: Record<string, string> = {
      amazonas:      '🌿 Amazonas',
      patagonia_arg: '⭐ Patagonia Argentina',
      patagonia_chi: '🌊 Patagonia Chilena',
      tragico:       '💀 Final Trágico',
    }
    dest.innerHTML = Object.entries(destCounts).map(([k, v]) => {
      const pct = total > 0 ? Math.round(v / total * 100) : 0
      return `<div class="hs-dest-row">
        <div class="hs-dest-label">${destLabels[k]}</div>
        <div class="hs-dest-bar-bg"><div class="hs-dest-bar-fill" style="width:${pct}%"></div></div>
        <div class="hs-dest-count">${v}x</div>
      </div>`
    }).join('')
  }

  // Mejor partida
  if (best) {
    const bIdx = scoreArr.indexOf(bestScore)
    const bh   = h[bIdx] ?? h[0]
    const modeL = bh.diff === 'historico' ? '⚔️ Histórico' : '📖 Educativo'
    const dur   = Math.round(bh.durationMs / 60000)
    best.innerHTML = `<div class="hs-best-badge">${bh.endBadge}</div>
      <div class="hs-best-title">${bh.endTitle}</div>
      <div class="hs-best-details">
        <span>👥 ${bh.m} supervivientes</span>
        <span>🤝 ${bh.alliances.length} alianzas</span>
        <span>⏱ ${dur}min</span>
        <span>🗺 ${bh.visitedCount ?? '?'} lugares</span>
        <span>🏅 ${bestScore.toLocaleString()} pts</span>
        <span>${modeL}</span>
        <span>📅 ${new Date(bh.date).toLocaleDateString()}</span>
      </div>`
  }

  // Nota docente
  if (doc) {
    const nivelV = winRate >= 60 ? 'excelente' : winRate >= 35 ? 'sólido' : winRate >= 15 ? 'en desarrollo' : 'inicial'
    const avgA_val = (h.reduce((a, e) => a + e.alliances.length, 0) / total).toFixed(1)
    const nivelA = parseFloat(avgA_val) >= 3 ? 'alta' : 'baja'
    doc.innerHTML = `Este estudiante completó <strong>${total} partida${total !== 1 ? 's' : ''}</strong> con una tasa de victoria del <strong>${winRate}%</strong> — nivel ${nivelV}.
    Invirtió <strong>${tiempoTotal} minutos</strong> de juego activo resolviendo <strong>${eventosTotal} eventos históricos</strong>.
    Su promedio de alianzas es <strong>${avgA_val}</strong> (capacidad de negociación ${nivelA}).
    Puntaje acumulado total: <strong>${scoreTotal.toLocaleString()}</strong>.
    ${his > 0 ? `Completó <strong>${his} partida${his !== 1 ? 's' : ''} en modo Histórico</strong>, lo que implica comprensión de las condiciones reales de la conquista.` : ''}
    ${epicas > 0 ? `Logró <strong>${epicas} final${epicas !== 1 ? 'es' : ''} épico${epicas !== 1 ? 's' : ''}</strong>, indicador de toma de decisiones estratégica.` : ''}`
  }
}

// ── Logros ────────────────────────────────────────────

function renderHsLogros(desbloqueados: Set<string>): void {
  const edu      = document.getElementById('hs-logros-edu')
  const his      = document.getElementById('hs-logros-his')
  const barFill  = document.getElementById('hs-logros-bar-fill')
  const barLabel = document.getElementById('hs-logros-bar-label')

  const render = (el: HTMLElement | null, modo: Difficulty) => {
    if (!el) return
    el.innerHTML = LOGROS_DEF.filter(l => l.modos.includes(modo)).map(l => {
      const ok = desbloqueados.has(l.id)
      return `<div class="hs-logro ${ok ? 'ok' : 'locked'}">
        <div class="hs-logro-icon">${l.icon}</div>
        <div>
          <div class="hs-logro-nombre">${l.nombre}</div>
          <div class="hs-logro-desc">${l.desc}</div>
          ${ok ? '<div class="hs-logro-check">✓ Desbloqueado</div>' : ''}
        </div>
      </div>`
    }).join('')
  }
  render(edu, 'educativo' as Difficulty)
  render(his, 'historico' as Difficulty)

  const total = LOGROS_DEF.length
  const done  = desbloqueados.size
  const pct   = Math.round(done / total * 100)
  if (barFill)  barFill.style.width      = pct + '%'
  if (barLabel) barLabel.textContent     = `${done} de ${total} logros desbloqueados (${pct}%)`
}

// ── Lista de partidas ─────────────────────────────────

function renderHsPartidas(h: FinishedGame[]): void {
  const el = document.getElementById('hs-partidas-list')
  if (!el) return
  if (!h.length) {
    el.innerHTML = '<div id="hs-empty">No hay partidas completadas todavía.</div>'
    return
  }
  el.innerHTML = h.map(e => {
    const modeL = e.diff === 'historico'
      ? '<span class="hs-partida-mode-his">⚔️ Histórico</span>'
      : '<span class="hs-partida-mode-edu">📖 Educativo</span>'
    const caciqueLine = e.caciqueName
      ? `<div style="font-family:'Cinzel',serif;font-size:.65rem;color:var(--ocre);opacity:.8;margin-bottom:.25rem;letter-spacing:.08em">Cacique ${e.caciqueName}</div>`
      : ''
    const dur      = Math.round(e.durationMs / 60000)
    const score    = calcScoreFromFG(e)
    const conqChip = conqDistLabel(e)
    return `<div class="hs-partida">
      <div class="hs-partida-header">
        <div>
          ${caciqueLine}
          <div class="hs-partida-badge">${e.endBadge}</div>
          <div class="hs-partida-title">${e.endTitle}</div>
        </div>
        <div class="hs-partida-date">${new Date(e.date).toLocaleDateString()}</div>
      </div>
      <div class="hs-partida-stats">
        <span>👥 ${e.m} supervivientes</span>
        <span>🤝 ${e.alliances.length} alianzas</span>
        <span>🗺 ${e.visitedCount ?? '?'} lugares</span>
        <span>⏱ ${dur}min</span>
        <span>🏅 ${score.toLocaleString()} pts</span>
        ${modeL}
        ${conqChip}
      </div>
    </div>`
  }).join('')
}

// ── Helpers ───────────────────────────────────────────

/**
 * Genera un chip HTML que indica qué tan cerca llegó el conquistador.
 * Compatible con partidas antiguas (campos opcionales).
 */
function conqDistLabel(fg: FinishedGame): string {
  if (fg.conqCaught) return '<span class="hs-conq-chip caught">⚔️ Capturado</span>'
  if (fg.conqRouteIdx === undefined) return ''
  const playerPos = CONQ_BRIDGE.length + (fg.visitedCount ?? 0) - 1
  const dist      = playerPos - fg.conqRouteIdx
  if (dist <= 0) return '<span class="hs-conq-chip caught">⚔️ Capturado</span>'
  if (dist === 1) return '<span class="hs-conq-chip danger">⚔️ 1 paso detrás</span>'
  if (dist <= 3)  return '<span class="hs-conq-chip warn">⚔️ Cerca</span>'
  return '<span class="hs-conq-chip safe">✅ Con ventaja</span>'
}

/** Recalcula el puntaje a partir de un FinishedGame */
function calcScoreFromFG(fg: FinishedGame): number {
  const dur        = Math.round(fg.durationMs / 60000)
  const survScore  = fg.m * 8
  const allyScore  = fg.alliances.length * 120
  const explScore  = (fg.visitedCount ?? 0) * 45
  const timeBonus  = dur > 0 ? Math.max(0, Math.round(800 - dur * 3)) : 0
  const diffMult   = fg.diff === 'historico' ? 1.5 : 1.0
  return Math.round((survScore + allyScore + explScore + timeBonus) * diffMult)
}

/** Infiere el destino a partir del badge */
function resolveDestFromBadge(fg: FinishedGame): string | null {
  const b = fg.endBadge.toLowerCase()
  if (b.includes('amazonas'))      return 'amazonas'
  if (b.includes('patagonia arg')) return 'patagonia_arg'
  if (b.includes('patagonia chi')) return 'patagonia_chi'
  if (b.includes('trágico'))       return 'tragico'
  return null
}

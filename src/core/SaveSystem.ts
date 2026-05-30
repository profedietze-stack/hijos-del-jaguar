import type { GameState }    from './GameState.js'
import type { FinishedGame } from './GameState.js'
import { NODES_DEF, CONQ_BRIDGE } from '../data/nodes.js'

// ══════════════════════════════════════════════════════
// SAVE SYSTEM — abstracción de localStorage
// Claves usadas:
//   jaguar_save     → partida en curso (JSON)
//   jaguar_history  → array de FinishedGame (JSON, max 20)
//   jaguar_logros   → array de achievement IDs (JSON)
// ══════════════════════════════════════════════════════

export const SAVE_KEY     = 'jaguar_save'
export const HISTORY_KEY  = 'jaguar_history'
export const LOGROS_KEY   = 'jaguar_logros'

// ── PARTIDA EN CURSO ──────────────────────────────────

/** Serialización mínima del estado para localStorage */
interface SavePayload {
  diff:        string
  caciqueName: string
  stats:       GameState['stats']
  nodes:       GameState['nodes']
  history:     string[]
  alliances:   string[]
  currentNode: string | null
  finalTag:    string | null
  conq:        GameState['conq']
  startTime:   number
}

export function saveGame(gs: GameState): void {
  const payload: SavePayload = {
    diff:        gs.diff,
    caciqueName: gs.caciqueName,
    stats:       gs.stats,
    nodes:       gs.nodes,
    history:     gs.history,
    alliances:   gs.alliances,
    currentNode: gs.currentNode,
    finalTag:    gs.finalTag,
    conq:        gs.conq,
    startTime:   gs.startTime,
  }
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
  } catch (_) { /* storage lleno o modo privado */ }
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null
}

export function clearSavedGame(): void {
  localStorage.removeItem(SAVE_KEY)
}

/**
 * Carga la partida guardada y la convierte en un GameState válido.
 * Incluye compatibilidad hacia atrás con saves viejos.
 */
export function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return null

  let d: SavePayload
  try {
    d = JSON.parse(raw) as SavePayload
  } catch (_) {
    localStorage.removeItem(SAVE_KEY)
    return null
  }

  if (!d?.nodes || !d?.stats) {
    localStorage.removeItem(SAVE_KEY)
    return null
  }

  // Backward compat: merge nodos nuevos que no estaban en el save
  const nodes = { ...d.nodes }
  for (const [nid, def] of Object.entries(NODES_DEF)) {
    if (!nodes[nid]) {
      nodes[nid] = { ...def, completed: false, unlocked: false }
    }
    // Asegurar que cada nodo tenga eventId (aleatorio del pool)
    if (!nodes[nid].eventId && nodes[nid].eventPool.length > 0) {
      const pool = nodes[nid].eventPool
      nodes[nid] = { ...nodes[nid], eventId: pool[Math.floor(Math.random() * pool.length)] }
    }
  }

  // Backward compat: reconstruir unlockedFrom desde historial
  for (const nid of d.history ?? []) {
    const nd = nodes[nid]
    if (!nd) continue
    for (const childId of nd.next) {
      if (nodes[childId]?.unlocked && !nodes[childId].unlockedFrom) {
        nodes[childId] = { ...nodes[childId], unlockedFrom: nid }
      }
    }
  }

  // Backward compat: conquistador
  const histLen = (d.history ?? []).length
  const lag     = d.diff === 'educativo' ? 2 : 1
  const conq = d.conq?.routeIdx !== undefined
    ? d.conq
    : { routeIdx: Math.max(0, CONQ_BRIDGE.length + histLen - lag - 1), caught: false, reorgTurns: 0 }

  const gs: GameState = {
    diff:        (d.diff as GameState['diff']) ?? 'educativo',
    caciqueName: d.caciqueName ?? '',
    stats:       d.stats,
    nodes,
    history:     d.history     ?? [],
    alliances:   d.alliances   ?? [],
    currentNode: d.currentNode ?? null,
    finalTag:    d.finalTag    ?? null,
    conq,
    startTime:   d.startTime   ?? Date.now(),
    pendingGame: null,
  }

  return gs
}

// ── HISTORIAL DE PARTIDAS ─────────────────────────────

export function loadHistory(): FinishedGame[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as FinishedGame[]
  } catch (_) {
    return []
  }
}

export function pushToHistory(game: FinishedGame): void {
  try {
    const h = loadHistory()
    h.unshift(game)
    if (h.length > 20) h.length = 20
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
  } catch (_) { /* storage lleno */ }
}

// ── LOGROS ────────────────────────────────────────────

export function loadUnlockedAchievements(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOGROS_KEY) ?? '[]') as string[]
  } catch (_) {
    return []
  }
}

export function saveUnlockedAchievements(ids: string[]): void {
  try {
    localStorage.setItem(LOGROS_KEY, JSON.stringify(ids))
  } catch (_) { /* storage lleno */ }
}

/**
 * Agrega nuevos logros desbloqueados sin duplicar.
 * Devuelve los IDs que son genuinamente nuevos.
 */
export function unlockAchievements(newIds: string[]): string[] {
  const existing = new Set(loadUnlockedAchievements())
  const fresh    = newIds.filter(id => !existing.has(id))
  if (fresh.length > 0) {
    saveUnlockedAchievements([...existing, ...fresh])
  }
  return fresh
}

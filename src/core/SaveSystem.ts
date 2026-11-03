import type { GameState }    from './GameState.js'
import type { FinishedGame } from './GameState.js'
import { NODES_DEF, CONQ_BRIDGE } from '../data/nodes.js'
import { DIFF_CONFIG } from '../data/difficultyConfig.js'
import { normalizarAlianzas } from './alliances.js'

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
  tribeToken?: string
  stats:       GameState['stats']
  nodes:       GameState['nodes']
  history:     string[]
  alliances:   string[]
  currentNode: string | null
  finalTag:    string | null
  conq:        GameState['conq']
  startTime:   number
}

/** Devuelve false si no se pudo escribir (almacenamiento lleno o bloqueado). */
export function saveGame(gs: GameState): boolean {
  const payload: SavePayload = {
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
  }
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
    return true
  } catch (_) {
    return false   // storage lleno o modo privado
  }
}

// ── ACCESO SEGURO A localStorage ──────────────────────
// En modo privado o con el almacenamiento bloqueado, hasta LEER tira SecurityError.

function lsGet(key: string): string | null {
  try { return localStorage.getItem(key) } catch (_) { return null }
}
function lsRemove(key: string): void {
  try { localStorage.removeItem(key) } catch (_) { /* bloqueado */ }
}

/** Aviso para el jugador cuando se descartó un guardado ilegible. Se consume una vez. */
let _saveProblem: string | null = null
export function takeSaveProblem(): string | null {
  const p = _saveProblem
  _saveProblem = null
  return p
}

export function hasSavedGame(): boolean {
  return lsGet(SAVE_KEY) !== null
}

export function clearSavedGame(): void {
  lsRemove(SAVE_KEY)
}

/** Borra TODO el progreso del juego: partida, historial y logros */
export function clearAllProgress(): void {
  lsRemove(SAVE_KEY)
  lsRemove(HISTORY_KEY)
  lsRemove(LOGROS_KEY)
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
const isStrArr = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every(x => typeof x === 'string')
const num = (v: unknown, fb: number, mn = 0, mx = Infinity): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(mx, Math.max(mn, v)) : fb

/**
 * Valida un guardado CAMPO POR CAMPO y lo convierte en un GameState jugable.
 * Devuelve null si la estructura no tiene arreglo (el llamador avisa y empieza vacío).
 * Un `{...defaults, ...parsed}` solo se defiende del JSON ilegible: un campo con el tipo
 * cambiado pasaba entero y reventaba más adelante.
 */
export function sanitizeSave(raw: unknown): GameState | null {
  if (!isObj(raw)) return null
  if (raw.diff !== undefined && (typeof raw.diff !== 'string' || !DIFF_CONFIG[raw.diff])) return null
  const diff = (raw.diff ?? 'educativo') as GameState['diff']
  if (!isObj(raw.nodes) || !isObj(raw.stats)) return null
  if (raw.history !== undefined && !isStrArr(raw.history)) return null
  if (raw.alliances !== undefined && !isStrArr(raw.alliances)) return null

  const init = DIFF_CONFIG[diff].initStats
  const st = raw.stats
  const stats = {
    food:      num(st.food,  init.food,  0, 100),
    moral:     num(st.moral, init.moral, 0, 100),
    salud:     num(st.salud, init.salud, 0, 100),
    union:     num(st.union, init.union, 0, 100),
    warriors:  Math.floor(num(st.warriors,  init.warriors)),
    shamans:   Math.floor(num(st.shamans,   init.shamans)),
    civilians: Math.floor(num(st.civilians, init.civilians)),
  }

  // Nodos: la definición estática manda; del guardado solo se toma el progreso.
  const saved = raw.nodes
  const nodes: GameState['nodes'] = {}
  for (const [nid, def] of Object.entries(NODES_DEF)) {
    const sn = isObj(saved[nid]) ? saved[nid] as Record<string, unknown> : {}
    const eid = typeof sn.eventId === 'string' && def.eventPool.includes(sn.eventId)
      ? sn.eventId
      : def.eventPool[Math.floor(Math.random() * def.eventPool.length)]
    nodes[nid] = {
      ...def,
      completed:    sn.completed === true,
      unlocked:     sn.unlocked === true || (nid === 'n00' && Object.keys(sn).length === 0),
      eventId:      eid,
      unlockedFrom: typeof sn.unlockedFrom === 'string' && NODES_DEF[sn.unlockedFrom] ? sn.unlockedFrom : undefined,
    }
  }

  const history = ((raw.history as string[] | undefined) ?? []).filter(id => !!NODES_DEF[id])

  // Backward compat: reconstruir unlockedFrom desde historial
  for (const nid of history) {
    for (const childId of nodes[nid]!.next) {
      if (nodes[childId]?.unlocked && !nodes[childId].unlockedFrom) {
        nodes[childId] = { ...nodes[childId]!, unlockedFrom: nid }
      }
    }
  }

  const lag = diff === 'educativo' ? 2 : 1
  const rc = isObj(raw.conq) ? raw.conq : null
  const conq = {
    routeIdx:   Math.floor(num(rc?.routeIdx, Math.max(0, CONQ_BRIDGE.length + history.length - lag - 1))),
    caught:     rc?.caught === true,
    reorgTurns: Math.floor(num(rc?.reorgTurns, 0)),
  }

  // Solo vale un nodo desbloqueado y todavía sin jugar: es el evento pendiente.
  const cur = typeof raw.currentNode === 'string' && nodes[raw.currentNode]?.unlocked && !nodes[raw.currentNode]!.completed ? raw.currentNode : null

  return {
    diff,
    caciqueName: typeof raw.caciqueName === 'string' ? raw.caciqueName.slice(0, 24) : '',
    tribeToken:  typeof raw.tribeToken === 'string' && raw.tribeToken ? raw.tribeToken : '🦅',
    stats,
    nodes,
    history,
    alliances:   normalizarAlianzas((raw.alliances as string[] | undefined) ?? []),
    currentNode: cur,
    finalTag:    typeof raw.finalTag === 'string' ? raw.finalTag : null,
    conq,
    startTime:   num(raw.startTime, Date.now()),
    pendingGame: null,
  }
}

/**
 * Carga la partida guardada y la convierte en un GameState válido.
 * Si el guardado es ilegible lo descarta y deja un aviso (takeSaveProblem).
 */
export function loadGame(): GameState | null {
  const raw = lsGet(SAVE_KEY)
  if (!raw) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (_) {
    parsed = null
  }
  const gs = sanitizeSave(parsed)
  if (!gs) {
    lsRemove(SAVE_KEY)
    _saveProblem = 'La partida guardada estaba dañada y no se pudo recuperar. Podés empezar una nueva.'
    return null
  }
  return gs
}

// ── HISTORIAL DE PARTIDAS ─────────────────────────────

export function loadHistory(): FinishedGame[] {
  try {
    const h = JSON.parse(lsGet(HISTORY_KEY) ?? '[]') as unknown
    return Array.isArray(h) ? h.filter(isObj) as unknown as FinishedGame[] : []
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
    const a = JSON.parse(lsGet(LOGROS_KEY) ?? '[]') as unknown
    return isStrArr(a) ? a : []
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
